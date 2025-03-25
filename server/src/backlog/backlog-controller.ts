import { Request, Response } from "express";
import backlogService from "./backlog-service";

export default new class BacklogController {
    async getProjectBacklogs(req: Request, res: Response) {
        try {
            const {projectId} = req.params;
            const backlogs = await backlogService.getProjectBacklogs(projectId);
            res.status(200).json({
                status: "success",
                backlogs
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }        
    }

    async getBacklogById(req: Request, res: Response) {
        try {
            const {backlogId} = req.params;
            const backlog = await backlogService.getBacklogById(backlogId);
            res.status(200).json({
                status: "success",
                backlog
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async createBacklog(req: Request, res: Response) {
        try {
            const {projectId} = req.params;
            const {name} = req.body;
            await backlogService.createBacklog(projectId, name);
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

    async getBacklogTasks(req: Request, res: Response) {
        try {
            const {backlogId} = req.params;
            const tasks = await backlogService.getBacklogTasks(backlogId);
            res.status(200).json({
                status: "success",
                tasks
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