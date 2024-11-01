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
const sprint_model_1 = __importDefault(require("./sprint-model"));
const backlog_model_1 = __importDefault(require("../backlog/backlog-model"));
const task_model_1 = __importDefault(require("../tasks/task-model"));
const project_model_1 = __importDefault(require("../projects/project-model"));
const sprint_errors_1 = __importDefault(require("./sprint-errors"));
exports.default = new class SprintService {
    createSprint(name, backlogId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield project_model_1.default.findById(projectId);
            const newSprint = {
                backlogId: backlogId ? new mongoose_1.default.Types.ObjectId(backlogId) : null,
                projectId: projectId ? new mongoose_1.default.Types.ObjectId(projectId) : null,
                name,
                goal: "",
                startDate: project.startDate,
                endDate: project.endDate
            };
            yield sprint_model_1.default.create(newSprint);
        });
    }
    getBacklogSprints(backlogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield sprint_model_1.default.find({ backlogId: new mongoose_1.default.Types.ObjectId(backlogId) });
            return result;
        });
    }
    getSprintTasks(sprintId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield task_model_1.default.find({ sprintId: new mongoose_1.default.Types.ObjectId(sprintId) });
            return result;
        });
    }
    pushTask(taskId, sprintId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedSprintId = new mongoose_1.default.Types.ObjectId(sprintId);
            yield task_model_1.default.findByIdAndUpdate(taskId, { backlogId: null, sprintId: convertedSprintId, projectId: null });
        });
    }
    pullTaskIntoBacklog(taskId, backlogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedBacklogId = new mongoose_1.default.Types.ObjectId(backlogId);
            yield task_model_1.default.findByIdAndUpdate(taskId, { backlogId: convertedBacklogId, sprintId: null, projectId: null });
        });
    }
    editSprint(sprintId, name, goal, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const sprint = yield sprint_model_1.default.findById(sprintId);
            const backlog = yield backlog_model_1.default.findById(sprint.backlogId);
            const project = yield project_model_1.default.findById(backlog.projectId);
            console.log(project);
            if (startDate.getTime() < project.startDate.getTime() || endDate.getTime() > project.endDate.getTime())
                throw sprint_errors_1.default.BadDates();
            yield sprint_model_1.default.findByIdAndUpdate(sprintId, { name, goal, startDate, endDate });
        });
    }
    getSprintById(sprintId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sprint_model_1.default.findById(sprintId);
        });
    }
    deleteSprint(sprintId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sprint_model_1.default.findByIdAndDelete(sprintId);
        });
    }
};
//# sourceMappingURL=sprint-service.js.map