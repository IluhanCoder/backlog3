"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_errors_1 = __importDefault(require("./auth-errors"));
const auth_service_1 = __importDefault(require("./auth-service"));
function authMiddleware(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                throw auth_errors_1.default.Unauthorized();
            }
            const token = authorization.split(' ')[1];
            const user = yield auth_service_1.default.verifyToken(token);
            if (!user) {
                throw auth_errors_1.default.Unauthorized();
            }
            req.user = user;
            next();
        }
        catch (error) {
            if (error instanceof auth_errors_1.default)
                res.status(error.status).json({
                    message: error.message,
                    status: "bad request"
                });
            else {
                res.status((_a = error.status) !== null && _a !== void 0 ? _a : 500).json({
                    status: "internal server error"
                });
                throw error;
            }
        }
    });
}
exports.default = authMiddleware;
//# sourceMappingURL=auth-middleware.js.map