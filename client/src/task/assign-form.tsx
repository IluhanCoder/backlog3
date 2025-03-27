import { useEffect, useState } from "react";
import { BacklogResponse } from "../backlogs/backlog-types";
import FormComponent from "../forms/form-component";
import { TaskResponse } from "./task-types";
import { UserResponse } from "../user/user-types";
import projectService from "../project/project-service";
import { ParticipantResponse } from "../project/project-types";
import UsersMapper from "../user/users-mapper";
import { submitButtonStyle } from "../styles/button-syles";
import taskService from "./task-service";
import formStore from "../forms/form-store";
import LoadingScreen from "../misc/loading-screen";

interface LocalParams {
    task: TaskResponse,
    projectId: string,
    callBack?: () => void
}

function AssignForm({task, projectId, callBack}: LocalParams) {
    const [users, setUsers] = useState<ParticipantResponse[] | null>(null);
    const [selected, setSelected] = useState<UserResponse[]>([]);

    const getUsers = async () => {
        const result = await projectService.getParticipants(projectId);
        setUsers([...result.participants]);
    }

    const handleSubmit = async () => {
        selected.map(async (user: UserResponse) => {
            await taskService.assignTask(task._id, user._id);
        })
        formStore.dropForm();
        if(callBack) callBack();
    }

    useEffect(() => {
        getUsers();
    }, [])
 
    return <FormComponent formLabel="Назначити задачу">
        {users && <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
                <UsersMapper task={task} users={users.map((participant: ParticipantResponse) => participant.participant)} selectedState={[selected, setSelected]}/>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex">Обрані користувачі:</div>
                <div>{selected.length > 0 && (selected.map((user: UserResponse) => <div>{user.nickname}</div>) || <div className="text-xs text-gray-600">жодного користувача не обрано</div>)}</div>
            </div>
            <button type="button" className={submitButtonStyle} onClick={handleSubmit}>назначити</button>
        </div> || <div className="w-96"><LoadingScreen/></div>}
    </FormComponent>
}

export default AssignForm;