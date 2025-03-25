import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";
import formStore from "../forms/form-store";
import AssignForm from "./assign-form";
import { UserResponse } from "../user/user-types";
import { lightButtonStyle, redButtonSyle } from "../styles/button-syles";
import TaskInfoForm from "./task-info-form";
import TaskStatusDisplayer from "./task-status-diplayer";
import { Rights } from "../project/project-types";
import TaskPriorityDisplayer from "./task-priority-displayer";
import LoadingScreen from "../misc/loading-screen";
import PushTaskForm from "../sprint/push-task-form";

interface LocalParams {
    backlogId: string,
    projectId: string,
    rights: Rights,
    callBack?: () => void
}

function BacklogTasksMapper ({rights, backlogId, projectId, callBack}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>();

    const getData = async () => {
        const tasksResponse = await taskService.getBacklogTasks(backlogId);
        setTasks([...tasksResponse.tasks]);
    }

    useEffect(() => {
        getData()
    }, []);

    const handlePush = async (task: TaskResponse) => {
        formStore.setForm(<PushTaskForm backlogId={backlogId} task={task} callBack={() => {getData(); if(callBack) callBack()}}/>)
    }

    const detailsHandler = (taskId: string) => {
        formStore.setForm(<TaskInfoForm rights={rights} projectId={projectId} callBack={() => getData()} taskId={taskId}/>)
    }

    const handleDeleteTask = async (taskId: string) => {
        await taskService.deleteTask(taskId);
        getData();
    }

    // const handleAssing = (task: TaskResponse) => {
    //     formStore.setForm(<AssignForm task={task} projectId={projectId} callBack={getData}/>)
    // }

    if(tasks) 
        if(tasks.length > 0) return <div className="flex flex-col gap-1">{tasks.map((task: TaskResponse) => task.name && <div className="rounded py-2 pl-10 pr-4 gap-6 border-2 flex justify-between">
                <div className="text-xl font-bold mt-0.5">{task.name}</div>
                <div>
                    <TaskStatusDisplayer className="mt-1" status={task.status}/>
                </div>
                <div>
                    <TaskPriorityDisplayer className="mt-1" priority={task.priority}/>
                </div>
                <div className="flex gap-2">
                    <button type="button" className={lightButtonStyle} onClick={() => detailsHandler(task._id)}>деталі</button>
                    {rights.edit && <button type="button" className={lightButtonStyle} onClick={() => handlePush(task)}>додати до спринту</button>}
                    {rights.delete && <button type="button" className={redButtonSyle} onClick={() => handleDeleteTask(task._id)}>видалити</button>}
                </div>
            </div>
        )}</div>
        else return <div className="flex justify-center p-8 text-xl font-bold text-gray-600">задачі відсутні</div>
    else return <LoadingScreen/>
}

export default BacklogTasksMapper;