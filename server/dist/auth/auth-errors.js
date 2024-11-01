"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status !== null && status !== void 0 ? status : 500;
    }
    static UserExists() {
        return new AuthError("Користувач з таким Email або логіном вже існує", 400);
    }
    static Unauthorized() {
        return new AuthError("Unauthorized", 400);
    }
    static UserNotFound() {
        return new AuthError("Користувача не було знайдено", 400);
    }
    static WrongPassword() {
        return new AuthError("Неправильний пароль", 400);
    }
    static VerificationFailed() {
        return new AuthError("VerificationFailed", 400);
    }
}
exports.default = AuthError;
//# sourceMappingURL=auth-errors.js.map