import { Request, Response } from "express";
import analyticsService from "./analytics-service";

export default new class AnalyticsController {
    async taskAmount(req: Request, res: Response) {
        try {
            const {projectId, startDate, endDate, isDaily, userId} = req.body;
            const result = await analyticsService.checkedTaskAmount(projectId, new Date(startDate), new Date(endDate), isDaily, userId);
            res.status(200).json({
                status: "success",
                result
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }

    async averageTasksPerPerProject(req: Request, res: Response) {
        try {
            const {userId, startDate, endDate, isDaily} = req.body;
            const result = await analyticsService.averageTasksPerProjectAmount(userId, startDate, endDate, isDaily);
            res.status(200).json({
                status: "success",
                result
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }

    async createdProjectAmount(req: Request, res: Response) {
        try {
            const {userId, startDate, endDate, isDaily} = req.body;
            const result = await analyticsService.createdProjectAmount(userId, startDate, endDate, isDaily);
            res.status(200).json({
                status: "success",
                result
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }

    async doneProjectAmount(req: Request, res: Response) {
        try {
            const {userId, startDate, endDate, isDaily} = req.body;
            const result = await analyticsService.fullyCompletedProjectsAmount(userId, startDate, endDate, isDaily);
            res.status(200).json({
                status: "success",
                result
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }

    async taskRatio(req: Request, res: Response) {
        try {
            const {projectId, startDate, endDate, daily, userId, phaseId} = req.body;
            const result = await analyticsService.taskRatio(projectId, new Date(startDate), new Date(endDate), daily, userId, phaseId);
            res.status(200).json({
                status: "success",
                result
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }

    async createdTaskAmount(req: Request, res: Response) {
        try {
            const {projectId, startDate, endDate, daily, userId} = req.body;
            const result = await analyticsService.createdTaskAmount(projectId, new Date(startDate), new Date(endDate), daily, userId);
            res.status(200).json({
                status: "success",
                result
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    
    async predictRatio(req: Request, res: Response) {
        try {
            const {projectId, userId} = req.body;
            const result = await analyticsService.predictRatio(projectId, userId);
            console.log(result);
            res.status(200).json({
                status: "success",
                result
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
}