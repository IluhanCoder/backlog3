"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const inviteSchema = new mongoose_1.default.Schema({
    host: mongoose_1.default.Types.ObjectId,
    guest: mongoose_1.default.Types.ObjectId,
    project: mongoose_1.default.Types.ObjectId,
    salary: Number
});
exports.default = mongoose_1.default.model("Invite", inviteSchema);
//# sourceMappingURL=invite-model.js.map