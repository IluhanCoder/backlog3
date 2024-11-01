"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const invite_model_1 = __importDefault(require("./invite-model"));
const project_model_1 = __importDefault(require("../projects/project-model"));
exports.default = new class InviteService {
    createInvite(host, guest, projectId, salary) {
        return __awaiter(this, void 0, void 0, function* () {
            yield invite_model_1.default.create({
                host: new mongoose_1.default.Types.ObjectId(host),
                guest: new mongoose_1.default.Types.ObjectId(guest),
                project: new mongoose_1.default.Types.ObjectId(projectId),
                salary
            });
        });
    }
    getInvited(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield invite_model_1.default.aggregate([
                {
                    $match: {
                        project: new mongoose_1.default.Types.ObjectId(projectId)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'guest',
                        foreignField: '_id',
                        as: 'invitedUserInfo'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        user: {
                            $arrayElemAt: ['$invitedUserInfo', 0]
                        }
                        // Add other fields from the user or invite schema if needed
                    }
                }
            ]);
            return result.map((invite) => invite.user);
        });
    }
    getInvitesToUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield invite_model_1.default.aggregate([
                {
                    $match: {
                        guest: new mongoose_1.default.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'host',
                        foreignField: '_id',
                        as: 'hostInfo'
                    }
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project',
                        foreignField: '_id',
                        as: 'projectInfo'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        host: {
                            $arrayElemAt: ['$hostInfo', 0]
                        },
                        project: {
                            $arrayElemAt: ['$projectInfo', 0]
                        },
                        salary: 1
                        // Add other fields from the invite schema if needed
                    }
                }
            ]);
            return result;
        });
    }
    seeInvite(inviteId, accept) {
        return __awaiter(this, void 0, void 0, function* () {
            const invite = yield invite_model_1.default.findById(inviteId);
            if (accept)
                yield project_model_1.default.findByIdAndUpdate(invite.project, { $push: {
                        participants: {
                            participant: invite.guest,
                            rights: {
                                create: true,
                                edit: false,
                                delete: false,
                                check: false,
                                editParticipants: false,
                                addParticipants: false,
                                editProjectData: false
                            },
                            salary: invite.salary
                        }
                    } });
            yield invite_model_1.default.findByIdAndDelete(inviteId);
        });
    }
    cancelInvite(guestId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield invite_model_1.default.deleteOne({
                guest: new mongoose_1.default.Types.ObjectId(guestId),
                project: new mongoose_1.default.Types.ObjectId(projectId)
            });
        });
    }
};
//# sourceMappingURL=invite-service.js.map