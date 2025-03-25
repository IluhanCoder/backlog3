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
const backlog_service_1 = __importDefault(require("./backlog-service"));
exports.default = new class BacklogController {
    getProjectBacklogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const backlogs = yield backlog_service_1.default.getProjectBacklogs(projectId);
                res.status(200).json({
                    status: "success",
                    backlogs
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
    getBacklogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { backlogId } = req.params;
                const backlog = yield backlog_service_1.default.getBacklogById(backlogId);
                res.status(200).json({
                    status: "success",
                    backlog
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
    createBacklog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const { name } = req.body;
                yield backlog_service_1.default.createBacklog(projectId, name);
                res.status(200).json({
                    status: "success",
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
    getBacklogTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { backlogId } = req.params;
                const tasks = yield backlog_service_1.default.getBacklogTasks(backlogId);
                res.status(200).json({
                    status: "success",
                    tasks
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
};
//# sourceMappingURL=backlog-controller.js.map