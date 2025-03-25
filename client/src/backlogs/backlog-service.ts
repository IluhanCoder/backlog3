import $api from "../axios-setup"
import { BacklogResponse } from "./backlog-types";

export default new class BacklogService {
    async getProjectBacklogs (proejctId: string) {
        return (await $api.get(`/backlogs/${proejctId}`)).data;
    }

    async getBacklogById (backlogId: string): Promise<{status: string, backlog: BacklogResponse}> {
        return (await $api.get(`/backlog/${backlogId}`)).data;
    }

    async createBacklog(projectId: string, name: string) {
        return (await $api.post(`/backlog/${[projectId]}`, {name})).data;
    }
}