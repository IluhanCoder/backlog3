"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const journalSchema = new mongoose_1.default.Schema({
    userId: mongoose_1.default.Types.ObjectId,
    date: Date,
    action: String
});
exports.default = mongoose_1.default.model("Journal", journalSchema);
//# sourceMappingURL=journal-model.js.map