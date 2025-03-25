import $api from "../axios-setup";

export default new class AnalyticsService {
    async fetchTasksStamps(projectId: string) {
        return (await $api.post(`/task-stamps/${projectId}`, {})).data;
    }

    async taskAmount(projectId: string, startDate: Date, endDate: Date, isDaily: boolean, userId: string | undefined) {
        return (await $api.post("/analytics/task-amount", {projectId, startDate, endDate, isDaily, userId})).data;
    }

    async taskRatio(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        return (await $api.post("/analytics/task-ratio", {projectId, startDate, endDate, daily, userId})).data;
    }

    async phaseTaskRatio(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined, phaseId: string) {
        return (await $api.post("/analytics/task-ratio", {projectId, startDate, endDate, daily, userId, onlyPhases: true, phaseId})).data;
    }

    async createdTaskAmount(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        return (await $api.post("analytics/created-task-amount", {projectId, startDate, endDate, daily, userId})).data;
    }

    async predictRatio(projectId: string, userId: string | undefined) {
        return (await $api.post("/analytics/predict-ratio", {projectId, userId})).data;
    }

    async getDoneTasksStatistics(userId: string): Promise<{status: string, data: any[]}> {
        return (await $api.get(`/done-stats/${userId}`)).data;
    }

    async getLoginStatistics(userId: string): Promise<{status: string, data: any[]}> {
        return (await $api.get(`/login-stats/${userId}`)).data;
    }

    async fetchCreatedProjectAmount(userId: string, startDate: Date, endDate: Date, isDaily: boolean) {
        return (await $api.post("/created-project-amount", { userId, startDate, endDate, isDaily })).data;
    }

    async fullyCompletedProjectsAmount(startDate: Date, endDate: Date, isDaily: boolean, userId: string) {
        return (await $api.post("/done-project-amount", { startDate, endDate, isDaily, userId })).data;
    }
    
    async averageTaskAmount(startDate: Date, endDate: Date, isDaily: boolean, userId: string) {
        return (await $api.post("/average-tasks", { startDate, endDate, isDaily, userId })).data;
    }
}