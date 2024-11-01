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
const mongoose_1 = __importDefault(require("mongoose"));
const requirement_model_1 = __importDefault(require("./requirement-model"));
exports.default = new class RequirementService {
    newRequirements(requirements) {
        return __awaiter(this, void 0, void 0, function* () {
            requirements.map((req) => __awaiter(this, void 0, void 0, function* () {
                yield requirement_model_1.default.create(req);
            }));
        });
    }
    deleteProjectRequirements(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield requirement_model_1.default.deleteMany({ projectId: new mongoose_1.default.Types.ObjectId(projectId) });
        });
    }
    getProjectRequirements(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedProjectId = new mongoose_1.default.Types.ObjectId(projectId);
            const result = yield requirement_model_1.default.find({ projectId: convertedProjectId });
            console.log(result);
            return result;
        });
    }
};
//# sourceMappingURL=requirement-service.js.map