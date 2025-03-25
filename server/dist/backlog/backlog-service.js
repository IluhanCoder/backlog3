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
const backlog_model_1 = __importDefault(require("./backlog-model"));
const task_model_1 = __importDefault(require("../tasks/task-model"));
exports.default = new class BacklogService {
    getProjectBacklogs(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield backlog_model_1.default.find({ projectId: new mongoose_1.default.Types.ObjectId(projectId) });
            return result;
        });
    }
    getBacklogById(backlogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield backlog_model_1.default.findById(backlogId);
            return result;
        });
    }
    createBacklog(projectId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield backlog_model_1.default.create({ projectId: new mongoose_1.default.Types.ObjectId(projectId), name });
        });
    }
    getBacklogTasks(backlogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield task_model_1.default.aggregate([
                // Step 1: Match tasks by the specified backlogId
                {
                    $match: { backlogId: new mongoose_1.default.Types.ObjectId(backlogId) }
                },
                // Step 2: Lookup the executors' details from the User model
                {
                    $lookup: {
                        from: 'users', // Assuming 'users' is your User collection name
                        localField: 'executors',
                        foreignField: '_id',
                        as: 'executors'
                    }
                },
                // Step 3: Format the executors' details into UserResponse format
                {
                    $project: {
                        name: 1,
                        desc: 1,
                        backlogId: 1,
                        projectId: 1,
                        sprintId: 1,
                        isChecked: 1,
                        createdBy: 1,
                        created: 1,
                        checkedDate: 1,
                        executors: {
                            $map: {
                                input: '$executors',
                                as: 'executor',
                                in: {
                                    _id: '$$executor._id',
                                    name: '$$executor.name',
                                    surname: '$$executor.surname',
                                    nickname: '$$executor.nickname',
                                    email: '$$executor.email',
                                    organisation: '$$executor.organisation',
                                    avatar: '$$executor.avatar'
                                }
                            }
                        },
                        status: 1,
                        difficulty: 1,
                        priority: 1,
                        requirements: 1
                    }
                }
            ]);
            if (result.length > 0)
                return result;
            else
                return [];
        });
    }
};
//# sourceMappingURL=backlog-service.js.map