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
const analytics_service_1 = __importDefault(require("./analytics-service"));
exports.default = new class AnalyticsController {
    taskAmount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, startDate, endDate, isDaily, userId } = req.body;
                const result = yield analytics_service_1.default.checkedTaskAmount(projectId, new Date(startDate), new Date(endDate), isDaily, userId);
                res.status(200).json({
                    status: "success",
                    result
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
    taskRatio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, startDate, endDate, daily, userId, phaseId } = req.body;
                const result = yield analytics_service_1.default.taskRatio(projectId, new Date(startDate), new Date(endDate), daily, userId, phaseId);
                res.status(200).json({
                    status: "success",
                    result
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
    createdTaskAmount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, startDate, endDate, daily, userId } = req.body;
                const result = yield analytics_service_1.default.createdTaskAmount(projectId, new Date(startDate), new Date(endDate), daily, userId);
                res.status(200).json({
                    status: "success",
                    result
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
    predictRatio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, userId } = req.body;
                const result = yield analytics_service_1.default.predictRatio(projectId, userId);
                console.log(result);
                res.status(200).json({
                    status: "success",
                    result
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
};
//# sourceMappingURL=analytics-controller.js.map