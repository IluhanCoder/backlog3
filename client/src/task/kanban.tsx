import { useEffect, useState } from "react";
import Task, { TaskResponse } from "./task-types";
import taskService from "./task-service";
import { useParams } from "react-router-dom";
import userStore from "../user/user-store";
import { UserResponse } from "../user/user-types";
import { ProjectResponse, Rights } from "../project/project-types";
import projectService from "../project/project-service";
import { VscTriangleLeft, VscTriangleRight } from "react-icons/vsc";
import formStore from "../forms/form-store";
import TaskInfoForm from "./task-info-form";
import { Link } from "react-router-dom";
import { lightButtonStyle, submitButtonStyle } from "../styles/button-syles";
import LoadingScreen from "../misc/loading-screen";
import { observer } from "mobx-react";
import KanBanTaskCard from "./kanban-task-card";
import NewTaskForm from "./new-task-form";

interface LocalParams {
    project: ProjectResponse,
    rights: Rights,
    callBack: () => {}
}

function KanBan({ project, rights, callBack }: LocalParams) {
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [ownerId, setOwnerId] = useState<string>();

    const handleMove = async (taskId: string, statusIndex: number) => {
        await taskService.setStatus(taskId, statusIndex);
        callBack();
    }

    const currentUserIsExecutorOrOwner = (task: TaskResponse) => {
        const executor = task.executors.find((executor: UserResponse) => executor._id === userStore.user?._id);
        return executor !== undefined || ownerId === userStore.user?._id
    }

    const handleTaskClick = async (taskId: string) => {
        if(project._id && rights) {
            const allTasksDone = (await taskService.allSubTasksAreDone(taskId)).areDone;
            formStore.setForm(<TaskInfoForm disableStatusChange={!allTasksDone} rights={rights} taskId={taskId} callBack={callBack} projectId={project._id}/>)
        }
    }

    const handleNewTask = () => {
        formStore.setForm(<NewTaskForm projectId={project?._id} callBack={callBack}/>)
    }

    if(project.tasks) return <div className="flex flex-col gap-3 bg-white p-4">
        <div className="flex gap-2 justify-center pr-4">
            <input type="checkbox" checked={isFiltered} onChange={() => setIsFiltered(!isFiltered)}/>
            <label>тільки задачі, назначені вам</label>
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
            <div className="bg-gray-100 rounded p-4 flex flex-col gap-2">
                <div className="text-gray-600 font-bold">Треба виконати:</div>
                {project.tasks.map((task: TaskResponse) => {
                    if((!isFiltered || currentUserIsExecutorOrOwner(task)) &&  task.status === "toDo") 
                        return <KanBanTaskCard callBack={callBack} task={task} rights={rights} handleMove={handleMove} handleTaskClick={handleTaskClick} currentUserIsExecutorOrOwner={currentUserIsExecutorOrOwner}/>
                })}
            </div>
            <div className="bg-gray-100 rounded p-4 flex flex-col gap-2">
                <div className="text-gray-600 font-bold">В процесі:</div>
                {project.tasks.map((task: TaskResponse) => {
                    if((!isFiltered || currentUserIsExecutorOrOwner(task)) && task.status === "inProgress") 
                        return <KanBanTaskCard callBack={callBack} task={task} rights={rights} handleMove={handleMove} handleTaskClick={handleTaskClick} currentUserIsExecutorOrOwner={currentUserIsExecutorOrOwner}/>
                })}
            </div>
            <div className="bg-gray-100 rounded p-4 flex flex-col gap-2">
                <div className="text-gray-600 font-bold">Виконано:</div>
                {project.tasks.map((task: TaskResponse) => {
                    if((!isFiltered || currentUserIsExecutorOrOwner(task)) && task.status === "done") 
                        return <KanBanTaskCard callBack={callBack} task={task} rights={rights} handleMove={handleMove} handleTaskClick={handleTaskClick} currentUserIsExecutorOrOwner={currentUserIsExecutorOrOwner}/>
                })}
            </div>
        </div>
        <div className="flex justify-center">
            <button type="button" className={submitButtonStyle} onClick={handleNewTask}>додати задачу</button>
        </div>
    </div>
    else return <LoadingScreen/>
}

export default observer(KanBan);