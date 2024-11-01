"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const projectSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    created: {
        type: Date,
        required: true,
        unique: false,
    },
    lastModified: {
        type: Date,
        required: true,
        unique: false,
    },
    owner: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        unique: false,
    },
    participants: {
        type: [{
                participant: mongoose_1.default.Types.ObjectId,
                rights: {
                    create: Boolean,
                    edit: Boolean,
                    delete: Boolean,
                    check: Boolean,
                    editParticipants: Boolean,
                    addParticipants: Boolean,
                    editProjectData: Boolean
                },
                salary: Number
            }],
        required: true,
        unique: false,
    },
    parameters: {
        integration: Boolean,
        support: Boolean,
        fixation: Boolean
    },
    type: {
        type: String,
        required: true,
        unique: false,
    },
    daysPerWeek: Number,
    hoursPerDay: Number,
    startDate: Date,
    endDate: Date
});
const ProjectModel = mongoose_1.default.model('Project', projectSchema);
exports.default = ProjectModel;
//# sourceMappingURL=project-model.js.map