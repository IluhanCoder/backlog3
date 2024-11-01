"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const requirementSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: false,
    },
    description: {
        type: String,
        required: true,
        unique: false,
    },
    category: {
        type: String,
        required: true,
        unique: false,
    },
    projectId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        unique: false
    }
});
const RequirementModel = mongoose_1.default.model('Requirement', requirementSchema);
exports.default = RequirementModel;
//# sourceMappingURL=requirement-model.js.map