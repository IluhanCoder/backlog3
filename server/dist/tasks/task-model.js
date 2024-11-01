"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubTaskModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    name: String,
    desc: String,
    projectId: {
        type: mongoose_1.default.Types.ObjectId,
        default: null
    },
    sprintId: {
        type: mongoose_1.default.Types.ObjectId,
        default: null
    },
    backlogId: {
        type: mongoose_1.default.Types.ObjectId,
        default: null
    },
    phaseId: {
        type: mongoose_1.default.Types.ObjectId,
        default: null
    },
    isChecked: Boolean,
    createdBy: mongoose_1.default.Types.ObjectId,
    created: Date,
    checkedDate: { type: Date, required: false },
    executors: [mongoose_1.default.Types.ObjectId],
    status: String,
    difficulty: String,
    priority: String,
    requirements: String,
});
const TaskModel = mongoose_1.default.model('Task', taskSchema);
exports.default = TaskModel;
const subTaskSchema = new mongoose_1.default.Schema({
    name: String,
    parentTask: mongoose_1.default.Types.ObjectId,
    isChecked: Boolean
});
exports.SubTaskModel = mongoose_1.default.model('SubTask', subTaskSchema);
//# sourceMappingURL=task-model.js.map