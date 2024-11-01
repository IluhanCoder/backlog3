"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const phaseSchema = new mongoose_1.default.Schema({
    projectId: {
        type: mongoose_1.default.Types.ObjectId
    },
    index: {
        type: Number,
        default: 0
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
    },
    charge: {
        type: mongoose_1.default.Types.ObjectId,
        required: false
    }
});
exports.default = mongoose_1.default.model("Phase", phaseSchema);
//# sourceMappingURL=phase-model.js.map