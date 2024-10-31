import { Request, Response } from "express";
import projectService from "./project-service";
import { AuthenticatedRequest } from "../auth/auth-types";
import { ProjectResponse } from "./project-types";
import inviteService from "../invites/invite-service";
import requirementService from "../requirements/requirement-service";
import { RequirementTemp } from "../requirements/requirement-types";

export default new class ProjectController {
    async newProject(req: AuthenticatedRequest, res: Response) {
        try {
            const requestBody = req.body;
            const owner = req.user;
            const result = await projectService.createProject({...requestBody, owner: owner._id});
            return res.json({
                status: "success",
                projectId: result._id
            }).status(200);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getProjectById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const project = await projectService.getProjectById(id);
            return res.json({
                status: "success",
                project
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getUserProjects(req: AuthenticatedRequest, res: Response) {
        try {
            const { user } = req;
            const projects: ProjectResponse[] = await projectService.getUserProjects(user._id.toString());
            res.json({
                status: "success",
                projects
            }).status(500);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async leaveProject(req: AuthenticatedRequest, res: Response) {
        try {
            const { projectId } = req.params;
            const { user } = req;
            await projectService.deleteParitcipant(projectId, user._id);
            res.status(200).json({
                status: "success"
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async deleteParticipant(req: AuthenticatedRequest, res: Response) {
        try {
            const { projectId } = req.params;
            const { userId } = req.body;
            await projectService.deleteParitcipant(projectId, userId);
            res.status(200).json({
                status: "success"
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getParticipants(req: AuthenticatedRequest, res: Response) {
        try {
            const {projectId} = req.params;
            const participants = await projectService.getParicipants(projectId);
            res.status(200).json({
                status: "success",
                participants
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getUserRights(req: AuthenticatedRequest, res: Response) {
        try {
            const {projectId} = req.params;
            const currentUser = req.user;
            const rights = await projectService.getUserRights(currentUser._id, projectId);
            res.status(200).json({
                status: "success",
                rights
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getRights(req: AuthenticatedRequest, res: Response) {
        try {
            const {projectId} = req.params;
            const rights = await projectService.getRights(projectId);
            res.status(200).json({
                status: "success",
                rights
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async setRights(req: AuthenticatedRequest, res: Response) {
        try {
            const {projectId} = req.params;
            const {rights} = req.body;
            await projectService.setRights(projectId, rights);
            res.status(200).json({
                status: "success",
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async changeOwner(req: AuthenticatedRequest, res: Response) {
        try {
            const {projectId} = req.params;
            const {oldOwnerId, newOwnerId} = req.body;
            await projectService.changeOwner(projectId, newOwnerId);
            res.status(200).json({
                status: "success",
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getOwnerId(req: AuthenticatedRequest, res: Response) {
        try {
            const {projectId} = req.params;
            const ownerId = await projectService.getOwnerId(projectId);
            res.status(200).json({
                status: "success",
                ownerId
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async deleteProject(req: AuthenticatedRequest, res: Response) {
        try {
            const {projectId} = req.params;
            await projectService.deleteProject(projectId);
            res.status(200).json({
                status: "success"
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async calculatePrice(req: Request, res: Response) {
        try {
            const {projectId} = req.params;
            const price = await projectService.calculatePrice(projectId);
            res.status(200).json({
                status: "success",
                price
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async editProject(req: Request, res: Response) {
        try {
            const {projectId} = req.params;
            const {newProject} = req.body;
            await projectService.editProject(projectId, newProject);
            res.status(200).json({
                status: "success"
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }
}