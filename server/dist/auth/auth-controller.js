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
const auth_service_1 = __importDefault(require("./auth-service"));
const auth_errors_1 = __importDefault(require("./auth-errors"));
const journal_service_1 = __importDefault(require("./journal-service"));
exports.default = new class AuthController {
    registration(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = req.body;
                const user = yield auth_service_1.default.registrate(credentials);
                return res.status(200).json({
                    status: "success",
                    user
                });
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
    login(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = req.body;
                const token = yield auth_service_1.default.login(credentials);
                return res.status(200).json({
                    status: "success",
                    token
                });
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
    verifyToken(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                const user = yield auth_service_1.default.verifyToken(token);
                return res.status(200).json({
                    status: "success",
                    user
                });
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
    getDoneStatistics(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const result = yield journal_service_1.default.getDoneStatistics(userId);
                return res.status(200).json({
                    status: "success",
                    data: result
                });
            }
            catch (error) {
                res.status((_a = error.status) !== null && _a !== void 0 ? _a : 500).json({
                    status: "internal server error"
                });
                throw error;
            }
        });
    }
    getLoginStatistics(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const result = yield journal_service_1.default.getDailyLoginStats(userId);
                return res.status(200).json({
                    status: "success",
                    data: result
                });
            }
            catch (error) {
                res.status((_a = error.status) !== null && _a !== void 0 ? _a : 500).json({
                    status: "internal server error"
                });
                throw error;
            }
        });
    }
};
//# sourceMappingURL=auth-controller.js.map