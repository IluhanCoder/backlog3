"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProjectError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status !== null && status !== void 0 ? status : 500;
    }
    static ProjectNotFound() {
        return new ProjectError("Проєкт не було знайдено", 400);
    }
}
exports.default = ProjectError;
//# sourceMappingURL=project-errors.js.map