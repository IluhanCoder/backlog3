import $api from "../axios-setup"
import { EditProjectCredentials, Participant, ParticipantResponse, ProjectCredentials, ProjectResponse, Rights } from "./project-types";

export default new class ProjectService {
    async getUserProjects() {
        const result: ProjectResponse[] = (await $api.get("/user-projects")).data.projects!;
        return result;
    }

    async newProject(credentials: ProjectCredentials) {
        const result = (await $api.post("/project", credentials)).data;
        return result;
    }

    async getProjectById(id: string) {
        const result = (await $api.get(`/project/${id}`)).data;
        return result;
    }

    async leaveProject(projectId: string) {
        const result = (await $api.delete(`/leave-project/${projectId}`)).data;
        return result;
    }

    async deleteParticipant(projectId: string, userId: string) {
        const result = (await $api.post(`delete-participant/${projectId}`, {userId})).data;
        return result;
    }

    async getParticipants(projectId: string) {
        const result = (await $api.get(`/participants/${projectId}`)).data;
        return result;
    }

    async getUserRights(projectId: string) {
        const result = (await $api.get(`/user-rights/${projectId}`)).data;
        return result;
    }   

    async getRights(projectId: string) {
        const result = (await $api.get(`/rights/${projectId}`)).data;
        return result;
    }

    async setRights(projectId: string, newRights: Participant[]) {
        const result = (await $api.patch(`/rights/${projectId}`,{rights: newRights})).data;
        return result;
    }

    async changeOwner(projectId: string, newOwnerId: string, oldOwnerId: string) {
        const result = (await $api.post(`/owner/${projectId}`, {newOwnerId, oldOwnerId})).data;
        return result;
    }

    async getOwnerId(projectId: string) {
        const result = (await $api.get(`/owner/${projectId}`)).data;
        return result;
    }

    async deleteProject(projectId: string) {
        const result = (await $api.delete(`/project/${projectId}`)).data;
        return result;
    }

    async calculatePrice(projectId: string): Promise<{status: string, price: number}> {
        const result = (await $api.get(`/price/${projectId}`)).data;
        return result;
    }

    async editProject(projectId: string, input: any) {
        const {owner, ...newProject} = input;
        await $api.put(`/project/${projectId}`, {newProject});
    }
}