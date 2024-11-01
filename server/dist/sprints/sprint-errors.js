"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SprintError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status !== null && status !== void 0 ? status : 500;
    }
    static BadDates() {
        return new SprintError("Часові межі спринту не можуть бути ширшими за часові межі проєкту", 400);
    }
}
exports.default = SprintError;
//# sourceMappingURL=sprint-errors.js.map