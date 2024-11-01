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
const sprint_service_1 = __importDefault(require("./sprint-service"));
const sprint_errors_1 = __importDefault(require("./sprint-errors"));
exports.default = new class SprintController {
    createSprint(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { backlogId, projectId, name } = req.body;
                console.log(projectId);
                yield sprint_service_1.default.createSprint(name, backlogId, projectId);
                res.status(200).json({
                    status: "success"
                });
            }
            catch (error) {
                if (error instanceof sprint_errors_1.default) {
                    res.status(error.status).json({
                        message: error.message,
                        status: "bad request"
                    });
                }
                else {
                    res.json({
                        status: "fail",
                        message: "internal server error"
                    }).status(500);
                    throw error;
                }
            }
        });
    }
    getBacklogSprints(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { backlogId } = req.params;
                const sprints = yield sprint_service_1.default.getBacklogSprints(backlogId);
                res.status(200).json({
                    status: "success",
                    sprints
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
    getSprintTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sprintId } = req.params;
                const tasks = yield sprint_service_1.default.getSprintTasks(sprintId);
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
    pushTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId, sprintId } = req.body;
                yield sprint_service_1.default.pushTask(taskId, sprintId);
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
    pullTaskIntoBacklog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId, backlogId } = req.body;
                yield sprint_service_1.default.pullTaskIntoBacklog(taskId, backlogId);
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
    editSprint(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sprintId } = req.params;
                const { name, goal, startDate, endDate } = req.body;
                yield sprint_service_1.default.editSprint(sprintId, name, goal, new Date(startDate), new Date(endDate));
                res.status(200).json({
                    status: "success"
                });
            }
            catch (error) {
                console.log(error);
                if (error instanceof sprint_errors_1.default) {
                    res.status(error.status).json({
                        message: error.message,
                        status: "bad request"
                    });
                }
                else {
                    res.json({
                        status: "fail",
                        message: "internal server error"
                    }).status(500);
                    throw error;
                }
            }
        });
    }
    getSprintById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sprintId } = req.params;
                const sprint = yield sprint_service_1.default.getSprintById(sprintId);
                res.status(200).json({
                    status: "success",
                    sprint
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
    deleteSprint(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sprintId } = req.params;
                yield sprint_service_1.default.deleteSprint(sprintId);
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
};
//# sourceMappingURL=sprint-controller.js.map