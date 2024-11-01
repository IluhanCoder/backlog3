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
const user_model_1 = __importDefault(require("../user/user-model"));
const auth_errors_1 = __importDefault(require("./auth-errors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const journal_service_1 = __importDefault(require("./journal-service"));
exports.default = new class AuthService {
    registrate(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield user_model_1.default.findOne({ $or: [{ nickname: credentials.nickname }, { email: credentials.email }] });
                if (existingUser)
                    throw auth_errors_1.default.UserExists();
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(credentials.password, salt);
                const user = yield user_model_1.default.create(Object.assign(Object.assign({}, credentials), { password: hashedPassword }));
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({ $or: [{ nickname: credentials.nickname }, { email: credentials.email }] });
                if (!user)
                    throw auth_errors_1.default.UserNotFound();
                const validPassword = yield bcrypt_1.default.compare(credentials.password, user.password);
                if (!validPassword)
                    throw auth_errors_1.default.WrongPassword();
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
                yield journal_service_1.default.login(user._id.toString());
                return token;
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (!userId)
                    throw auth_errors_1.default.VerificationFailed();
                const user = yield user_model_1.default.findById(userId);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
//# sourceMappingURL=auth-service.js.map