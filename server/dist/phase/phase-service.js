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
const phase_model_1 = __importDefault(require("./phase-model"));
const task_model_1 = __importDefault(require("../tasks/task-model"));
exports.default = new class PhaseService {
    createPhase(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            yield phase_model_1.default.create(credentials);
        });
    }
    getProjectPhases(projectId, chargeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedProjectId = new mongoose_1.default.Types.ObjectId(projectId);
            const convertedChargeId = new mongoose_1.default.Types.ObjectId(chargeId);
            const pipeline = [];
            if (chargeId)
                pipeline.push({ $match: { charge: convertedChargeId } });
            console.log(pipeline);
            const result = yield phase_model_1.default.aggregate([
                {
                    $match: {
                        projectId: convertedProjectId
                    }
                },
                ...pipeline,
                {
                    $lookup: {
                        from: "users",
                        foreignField: "_id",
                        localField: "charge",
                        as: "charge"
                    }
                },
                {
                    $unwind: {
                        path: '$charge',
                        preserveNullAndEmptyArrays: true, // Keeps tasks even if they don't have a matching project
                    }
                },
                {
                    $sort: {
                        "index": 1
                    }
                },
                {
                    $project: {
                        _id: 1,
                        projectId: 1,
                        index: 1,
                        name: 1,
                        startDate: 1,
                        endDate: 1,
                        goal: 1,
                        charge: 1
                    }
                }
            ]);
            return result;
        });
    }
    deletePhase(phaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedPhase = yield phase_model_1.default.findByIdAndDelete(phaseId);
            const phasesToModify = yield phase_model_1.default.find({ projectId: deletedPhase.projectId, index: { $gt: deletedPhase.index } });
            phasesToModify.map((phase) => __awaiter(this, void 0, void 0, function* () {
                const newIndex = phase.index - 1;
                yield phase_model_1.default.findByIdAndUpdate(phase._id.toString(), { index: newIndex });
            }));
        });
    }
    getActiveWaterfallIndex(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedProjectId = new mongoose_1.default.Types.ObjectId(projectId);
            const phases = yield phase_model_1.default.find({ projectId: convertedProjectId });
            const sortedPhases = phases.sort((a, b) => a.index - b.index);
            const allTasksAreDone = (phaseId) => __awaiter(this, void 0, void 0, function* () {
                const tasks = yield task_model_1.default.find({ phaseId });
                return tasks.length > 0 && !tasks.some((task) => task.status !== "done");
            });
            let index = 0;
            for (; index < sortedPhases.length && (yield allTasksAreDone(sortedPhases[index]._id)); index++)
                ;
            return index;
        });
    }
    getPhasesAmount(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedProjectId = new mongoose_1.default.Types.ObjectId(projectId);
            const phases = yield phase_model_1.default.find({ projectId: convertedProjectId });
            return phases.length;
        });
    }
    moveUp(phaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const phaseData = yield phase_model_1.default.findById(phaseId);
            const oldIndex = phaseData.index;
            if (oldIndex > 0) {
                yield phase_model_1.default.findOneAndUpdate({ projectId: phaseData.projectId, index: oldIndex - 1 }, { index: oldIndex });
                yield phase_model_1.default.findByIdAndUpdate(phaseId, { index: oldIndex - 1 });
            }
        });
    }
    moveDown(phaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const phaseData = yield phase_model_1.default.findById(phaseId);
            const oldIndex = phaseData.index;
            const phasesAmount = yield this.getPhasesAmount(phaseData.projectId.toString());
            if (oldIndex < phasesAmount) {
                yield phase_model_1.default.findOneAndUpdate({ projectId: phaseData.projectId, index: oldIndex + 1 }, { index: oldIndex });
                yield phase_model_1.default.findByIdAndUpdate(phaseId, { index: oldIndex + 1 });
            }
        });
    }
    assignCharge(phaseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedUserId = new mongoose_1.default.Types.ObjectId(userId);
            yield phase_model_1.default.findByIdAndUpdate(phaseId, { charge: convertedUserId });
        });
    }
};
//# sourceMappingURL=phase-service.js.map