"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const backlogSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    projectId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    }
});
exports.default = mongoose_1.default.model("Backlog", backlogSchema);
//# sourceMappingURL=backlog-model.js.map