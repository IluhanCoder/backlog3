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
const user_service_1 = __importDefault(require("./user-service"));
exports.default = new class UserController {
    fetchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = req.user;
                const result = yield user_service_1.default.fetchUsers(currentUser);
                res.status(200).json({
                    status: "success",
                    users: result
                });
            }
            catch (error) {
                res.json({
                    status: "fail",
                    message: "internal server error"
                }).status(500);
                throw error;
            }
        });
    }
    getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                res.status(200).json({
                    status: "success",
                    user
                });
            }
            catch (error) {
                res.json({
                    status: "fail",
                    message: "internal server error"
                }).status(500);
                throw error;
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user = yield user_service_1.default.getUserById(userId);
                res.status(200).json({
                    status: "success",
                    user
                });
            }
            catch (error) {
                res.json({
                    status: "fail",
                    message: "internal server error"
                }).status(500);
                throw error;
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const { newData } = req.body;
                yield user_service_1.default.updateUser(userId, newData);
                res.status(200).json({
                    status: "success"
                });
            }
            catch (error) {
                res.json({
                    status: "fail",
                    message: "internal server error"
                }).status(500);
                throw error;
            }
        });
    }
    setAvatar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, file } = req;
                if (req.file)
                    yield user_service_1.default.setAvatar(file, user._id);
                return res.status(200).json({
                    status: "success"
                });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({ message: "Set avatar error" });
            }
        });
    }
};
//# sourceMappingURL=user-controller.js.map