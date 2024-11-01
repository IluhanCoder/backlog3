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
const project_service_1 = __importDefault(require("./project-service"));
exports.default = new class ProjectController {
    newProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requestBody = req.body;
                const owner = req.user;
                const result = yield project_service_1.default.createProject(Object.assign(Object.assign({}, requestBody), { owner: owner._id }));
                return res.json({
                    status: "success",
                    projectId: result._id
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
    getProjectById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const project = yield project_service_1.default.getProjectById(id);
                return res.json({
                    status: "success",
                    project
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
    getUserProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const projects = yield project_service_1.default.getUserProjects(user._id.toString());
                res.json({
                    status: "success",
                    projects
                }).status(500);
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
    leaveProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const { user } = req;
                yield project_service_1.default.deleteParitcipant(projectId, user._id);
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
    deleteParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const { userId } = req.body;
                yield project_service_1.default.deleteParitcipant(projectId, userId);
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
    getParticipants(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const participants = yield project_service_1.default.getParicipants(projectId);
                res.status(200).json({
                    status: "success",
                    participants
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
    getUserRights(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const currentUser = req.user;
                const rights = yield project_service_1.default.getUserRights(currentUser._id, projectId);
                res.status(200).json({
                    status: "success",
                    rights
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
    getRights(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const rights = yield project_service_1.default.getRights(projectId);
                res.status(200).json({
                    status: "success",
                    rights
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
    setRights(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const { rights } = req.body;
                yield project_service_1.default.setRights(projectId, rights);
                res.status(200).json({
                    status: "success",
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
    changeOwner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const { oldOwnerId, newOwnerId } = req.body;
                yield project_service_1.default.changeOwner(projectId, newOwnerId);
                res.status(200).json({
                    status: "success",
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
    getOwnerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const ownerId = yield project_service_1.default.getOwnerId(projectId);
                res.status(200).json({
                    status: "success",
                    ownerId
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
    deleteProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                yield project_service_1.default.deleteProject(projectId);
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
    calculatePrice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const price = yield project_service_1.default.calculatePrice(projectId);
                res.status(200).json({
                    status: "success",
                    price
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
    editProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.params;
                const { newProject } = req.body;
                yield project_service_1.default.editProject(projectId, newProject);
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
};
//# sourceMappingURL=project-controller.js.map