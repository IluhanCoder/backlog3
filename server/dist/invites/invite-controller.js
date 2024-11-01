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
const invite_service_1 = __importDefault(require("./invite-service"));
exports.default = new class InviteController {
    createInvite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = req.user;
                const { guest, projectId, salary } = req.body;
                yield invite_service_1.default.createInvite(currentUser._id.toString(), guest, projectId, salary);
                res.status(200).json({
                    status: "success"
                });
            }
            catch (error) {
                res.json({
                    status: "fail",
                    message: "internal server error"
                }).status(500);
                throw error;
            }
        });
    }
    getInvited(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const invited = yield invite_service_1.default.getInvited(projectId);
                res.status(200).json({
                    status: "success",
                    invited
                });
            }
            catch (error) {
                res.json({
                    status: "fail",
                    message: "internal server error"
                }).status(500);
                throw error;
            }
        });
    }
    getInvitesToUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = req.user;
                const invites = yield invite_service_1.default.getInvitesToUser(currentUser._id);
                res.status(200).json({
                    status: "success",
                    invites
                });
            }
            catch (error) {
                res.json({
                    status: "fail",
                    message: "internal server error"
                }).status(500);
                throw error;
            }
        });
    }
    seeInvite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { inviteId } = req.params;
                const { accept } = req.body;
                yield invite_service_1.default.seeInvite(inviteId, accept);
                res.status(200).json({ status: "success" });
            }
            catch (error) {
                res.json({
                    status: "fail",
                    message: "internal server error"
                }).status(500);
                throw error;
            }
        });
    }
    cancelInvite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { guestId, projectId } = req.body;
                yield invite_service_1.default.cancelInvite(guestId, projectId);
                res.status(200).json({ status: "success" });
            }
            catch (error) {
                res.json({
                    status: "fail",
                    message: "internal server error"
                }).status(500);
                throw error;
            }
        });
    }
};
//# sourceMappingURL=invite-controller.js.map