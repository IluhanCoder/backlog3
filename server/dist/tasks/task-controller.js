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
const task_service_1 = __importDefault(require("./task-service"));
const journal_service_1 = __importDefault(require("../auth/journal-service"));
exports.default = new class TaskController {
    addTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { task } = req.body;
                const user = req.user;
                yield task_service_1.default.addTask(task);
                yield journal_service_1.default.createdTask(user._id);
                return res.json({
                    status: "success",
                    message: "задачу було успішно додано"
                }).status(200);
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
    getProjectTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const result = yield task_service_1.default.getProjectTasks(projectId);
                res.status(200).json({
                    status: "success",
                    tasks: result
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
    checkTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.params;
                const user = req.user;
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
    unCheckTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.params;
                yield task_service_1.default.unCheckTask(taskId);
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
    setStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.params;
                const { status } = req.body;
                const user = req.user;
                yield task_service_1.default.setStatus(taskId, Number(status));
                if (status === "done")
                    yield journal_service_1.default.doneTask(user._id.toString());
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
    assignTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId, userId } = req.body;
                yield task_service_1.default.assignTask(taskId, userId);
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
    deleteTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.params;
                yield task_service_1.default.deleteTask(taskId);
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
    getTaskById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.params;
                const task = yield task_service_1.default.getTaskById(taskId);
                res.status(200).json({
                    status: "success",
                    task
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
    updateTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.params;
                const { task } = req.body;
                const user = req.user;
                yield task_service_1.default.updateTask(taskId, task, user._id);
                res.status(200).json({
                    status: "success",
                    task
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
    getPhaseTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phaseId } = req.params;
                const tasks = yield task_service_1.default.getPhaseTasks(phaseId);
                return res.status(200).json({
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
    createSubTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { parentTaskId, name } = req.body;
                yield task_service_1.default.createSubTask(parentTaskId, name);
                return res.status(200).json({
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
    checkSubTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { subTaskId } = req.params;
                yield task_service_1.default.checkSubTask(subTaskId);
                return res.status(200).json({
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
    getSubTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { parentTaskId } = req.params;
                const result = yield task_service_1.default.getSubTasks(parentTaskId);
                return res.status(200).json({
                    status: "success",
                    subTasks: result
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
    allSubTasksAreDone(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.params;
                const result = yield task_service_1.default.allSubTasksAreDone(taskId);
                return res.status(200).json({
                    status: "success",
                    areDone: result
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
    deleteSubTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { subTaskId } = req.params;
                yield task_service_1.default.deleteSubTask(subTaskId);
                return res.status(200).json({
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
//# sourceMappingURL=task-controller.js.map