import $api from "../axios-setup";
import { Rights } from "../project/project-types";
import userStore from "./user-store";
import User from "./user-types";

export default new class UserService {
    async fetchUsers() {
        return (await $api.get("/users")).data;
    }

    async getUserById(userId: string) {
        return (await $api.get(`/user/${userId}`)).data;
    }

    async getCurrentUserRights(projectId: string): Promise<{status: string, rights: Rights}> {
        return (await $api.get(`/user-rights/${projectId}`)).data;
    }

    async updateUser(userId: string, newData: User) {
        return (await $api.post(`/user-update/${userId}`, {newData})).data;
    }

    async setAvatar(avatar: File) {
        const formData = new FormData();
        formData.append("file", avatar);
        return (await $api.post("/avatar", formData)).data;
    }
}