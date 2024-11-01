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
const user_model_1 = __importDefault(require("./user-model"));
exports.default = new class UserService {
    fetchUsers(currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_model_1.default.find({ _id: { $ne: currentUser._id } });
            return result;
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_model_1.default.findById(userId);
            return result;
        });
    }
    updateUser(userId, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_model_1.default.findByIdAndUpdate(userId, newData);
        });
    }
    setAvatar(file, userId, oldAvatarId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(file);
            let imageUploadObject = {
                data: file.buffer,
                contentType: file.mimetype
            };
            const result = yield user_model_1.default.findByIdAndUpdate(userId, { avatar: imageUploadObject });
            return result;
        });
    }
};
//# sourceMappingURL=user-service.js.map