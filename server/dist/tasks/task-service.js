"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const task_model_1 = __importStar(require("./task-model"));
const backlog_model_1 = __importDefault(require("../backlog/backlog-model"));
const task_statuses_1 = __importStar(require("./task-statuses"));
const journal_service_1 = __importDefault(require("../auth/journal-service"));
exports.default = new class TaskService {
    addTask(newTask) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const task = {
                    projectId: newTask.projectId ? new mongoose_1.default.Types.ObjectId(newTask.projectId) : null,
                    backlogId: newTask.backlogId ? new mongoose_1.default.Types.ObjectId(newTask.backlogId) : null,
                    sprintId: newTask.sprintId ? new mongoose_1.default.Types.ObjectId(newTask.sprintId) : null,
                    phaseId: newTask.phaseId ? new mongoose_1.default.Types.ObjectId(newTask.phaseId) : null,
                    name: newTask.name,
                    desc: newTask.desc,
                    isChecked: false,
                    createdBy: new mongoose_1.default.Types.ObjectId(newTask.createdBy),
                    created: new Date(),
                    checkedDate: undefined,
                    executors: (_a = newTask.executors) !== null && _a !== void 0 ? _a : [],
                    status: task_statuses_1.default[0],
                    difficulty: task_statuses_1.TaskDifficulties[1],
                    priority: task_statuses_1.TaskPriorities[1],
                    requirements: newTask.requirements
                };
                yield task_model_1.default.create(task);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getProjectTasks(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield task_model_1.default.aggregate([
                    // Step 1: Match tasks by the specified projectId
                    {
                        $match: { projectId: new mongoose_1.default.Types.ObjectId(projectId) }
                    },
                    // Step 2: Lookup executors details from the User collection
                    {
                        $lookup: {
                            from: 'users', // Assuming 'users' is your User collection name
                            localField: 'executors',
                            foreignField: '_id',
                            as: 'executorDetails'
                        }
                    },
                    // Step 3: Format tasks to match TaskResponse
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
                            status: 1,
                            difficulty: 1,
                            priority: 1,
                            requirements: 1,
                            executors: {
                                $map: {
                                    input: '$executorDetails',
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
                            }
                        }
                    }
                ]);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPhaseTasks(phaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield task_model_1.default.aggregate([
                // Step 1: Match tasks by the specified projectId
                {
                    $match: { phaseId: new mongoose_1.default.Types.ObjectId(phaseId) }
                },
                // Step 2: Lookup executors details from the User collection
                {
                    $lookup: {
                        from: 'users', // Assuming 'users' is your User collection name
                        localField: 'executors',
                        foreignField: '_id',
                        as: 'executorDetails'
                    }
                },
                // Step 3: Format tasks to match TaskResponse
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
                        status: 1,
                        difficulty: 1,
                        priority: 1,
                        requirements: 1,
                        executors: {
                            $map: {
                                input: '$executorDetails',
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
                        }
                    }
                }
            ]);
            return result;
        });
    }
    checkTask(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield task_model_1.default.findByIdAndUpdate(taskId, { isChecked: true });
            }
            catch (error) {
                throw error;
            }
        });
    }
    unCheckTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield task_model_1.default.findByIdAndUpdate(taskId, { isChecked: false });
            }
            catch (error) {
                throw error;
            }
        });
    }
    setStatus(taskId, index) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {
                    checkedDate: (index === 2) ? new Date() : null,
                    status: task_statuses_1.default[index]
                };
                yield task_model_1.default.findByIdAndUpdate(taskId, query);
            }
            catch (error) {
                throw error;
            }
        });
    }
    assignTask(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield task_model_1.default.findByIdAndUpdate(taskId, { $push: { executors: userId } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllTasks(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield backlog_model_1.default.aggregate([
                {
                    $match: {
                        projectId: new mongoose_1.default.Types.ObjectId(projectId),
                    },
                },
                {
                    $lookup: {
                        from: 'sprints',
                        localField: 'sprints',
                        foreignField: '_id',
                        as: 'sprintData',
                    },
                },
                {
                    $project: {
                        tasks: {
                            $concatArrays: ['$tasks', { $ifNull: ['$sprintData.tasks', []] }],
                        },
                    },
                },
                {
                    $unwind: {
                        path: '$tasks',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'tasks',
                        localField: 'tasks',
                        foreignField: '_id',
                        as: 'taskData',
                    },
                },
                {
                    $unwind: {
                        path: '$taskData',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'taskData.executors',
                        foreignField: '_id',
                        as: 'executorsData',
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'taskData.createdBy',
                        foreignField: '_id',
                        as: 'createdByData',
                    },
                },
                {
                    $group: {
                        _id: null,
                        tasks: {
                            $push: {
                                _id: '$taskData._id',
                                name: '$taskData.name',
                                desc: '$taskData.desc',
                                projectId: '$taskData.projectId',
                                isChecked: '$taskData.isChecked',
                                created: '$taskData.created',
                                checkedDate: '$taskData.checkedDate',
                                executors: '$executorsData',
                                createdBy: '$createdByData',
                                status: "$taskData.status"
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        tasks: 1,
                    },
                },
            ]);
            return result[0].tasks;
        });
    }
    deleteTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedTaskId = new mongoose_1.default.Types.ObjectId(taskId);
            yield task_model_1.default.findByIdAndDelete(taskId);
            task_model_1.SubTaskModel.deleteMany({ parentTask: convertedTaskId });
        });
    }
    getTaskById(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield task_model_1.default.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(taskId)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "executors",
                        foreignField: "_id",
                        as: "executorsData"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        desc: 1,
                        requirements: 1,
                        priority: 1,
                        status: 1,
                        difficulty: 1,
                        created: 1,
                        checkedDate: 1,
                        // Other fields you want to include from the task
                        executors: {
                            $map: {
                                input: "$executorsData",
                                as: "executor",
                                in: {
                                    _id: "$$executor._id",
                                    nickname: "$$executor.nickname",
                                    // Other fields you want to include from the user
                                }
                            }
                        }
                    }
                }
            ]);
            return result[0];
        });
    }
    updateTask(taskId, newData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newData.status === "done") {
                newData.checkedDate = new Date();
                yield journal_service_1.default.doneTask(userId);
            }
            else
                newData.checkedDate = null;
            yield task_model_1.default.findByIdAndUpdate(taskId, newData);
        });
    }
    createSubTask(parentTaskId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedTaskId = new mongoose_1.default.Types.ObjectId(parentTaskId);
            yield task_model_1.SubTaskModel.create({ parentTask: convertedTaskId, name, isChecked: false });
        });
    }
    checkSubTask(subTaskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldCheck = (yield task_model_1.SubTaskModel.findById(subTaskId)).isChecked;
            yield task_model_1.SubTaskModel.findByIdAndUpdate(subTaskId, { isChecked: !oldCheck });
        });
    }
    getSubTasks(parentTaskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedTaskId = new mongoose_1.default.Types.ObjectId(parentTaskId);
            const result = yield task_model_1.SubTaskModel.find({ parentTask: convertedTaskId });
            return result.length > 0 ? result : null;
        });
    }
    allSubTasksAreDone(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subTasks = yield this.getSubTasks(taskId);
            const result = (subTasks) ? !subTasks.find((subTask) => !subTask.isChecked) : true;
            return result;
        });
    }
    deleteSubTask(subTaskId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield task_model_1.SubTaskModel.findByIdAndDelete(subTaskId);
        });
    }
};
//# sourceMappingURL=task-service.js.map