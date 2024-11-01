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
const phase_service_1 = __importDefault(require("./phase-service"));
exports.default = new class PhaseController {
    createPhase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credentials } = req.body;
                yield phase_service_1.default.createPhase(credentials);
                return res.json({
                    status: "success"
                }).status(200);
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
    getProjectPhases(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const { chargeId } = req.body;
                const phases = yield phase_service_1.default.getProjectPhases(projectId, chargeId);
                return res.json({
                    status: "success",
                    phases
                }).status(200);
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
    deletePhase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phaseId } = req.params;
                yield phase_service_1.default.deletePhase(phaseId);
                return res.json({
                    status: "success"
                }).status(200);
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
    getActiceWaterfallIndex(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const index = yield phase_service_1.default.getActiveWaterfallIndex(projectId);
                return res.json({
                    status: "success",
                    index
                }).status(200);
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
    moveUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phaseId } = req.params;
                yield phase_service_1.default.moveUp(phaseId);
                return res.json({
                    status: "success"
                }).status(200);
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
    moveDown(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phaseId } = req.params;
                yield phase_service_1.default.moveDown(phaseId);
                return res.json({
                    status: "success"
                }).status(200);
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
    assignCharge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phaseId } = req.params;
                const { userId } = req.body;
                yield phase_service_1.default.assignCharge(phaseId, userId);
                return res.json({
                    status: "success"
                }).status(200);
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
//# sourceMappingURL=phase-controller.js.map