"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sprintSchema = new mongoose_1.default.Schema({
    projectId: {
        type: mongoose_1.default.Types.ObjectId,
        default: null
    },
    backlogId: {
        type: mongoose_1.default.Types.ObjectId,
        default: null
    },
    name: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    goal: {
        type: String,
        required: false
    }
});
exports.default = mongoose_1.default.model("Sprint", sprintSchema);
//# sourceMappingURL=sprint-model.js.map