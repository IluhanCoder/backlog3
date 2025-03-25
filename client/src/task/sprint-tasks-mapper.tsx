import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";
import { SprintResponse } from "../sprint/sprint-types";
import { UserResponse } from "../user/user-types";
import { lightButtonStyle, redButtonSyle } from "../styles/button-syles";
import TaskStatusDisplayer from "./task-status-diplayer";
import { Rights } from "../project/project-types";
import TaskPriorityDisplayer from "./task-priority-displayer";
import sprintService from "../sprint/sprint-service";
import TaskInfoForm from "./task-info-form";
import formStore from "../forms/form-store";

interface LocalParams {
    sprintId: string,
    projectId: string,
    backlogId: string,
    rights: Rights
}

function SprintTasksMapper ({sprintId, projectId, backlogId, rights}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);

    const getTasks = async () => {
        const result = await taskService.getSprintTasks(sprintId);
        setTasks([...result.tasks]);
    }

    const detailsHandler = (taskId: string) => {
        formStore.setForm(<TaskInfoForm rights={rights} projectId={sprintId} callBack={() => getTasks()} taskId={taskId}/>)
    }

    const handleDelete = async (taskId: string) => {
        await taskService.deleteTask(taskId);
        getTasks();
    }
    
    const handlePull = async (taskId: string) => {
        await sprintService.pullTask(taskId, backlogId);
        getTasks();
    }

    useEffect(() => { getTasks() }, [sprintId]);

    if(tasks[0] && tasks[0].name) return <div className="flex flex-col gap-1">{tasks.map((task: TaskResponse) => task.name && <div className="rounded py-2 pl-10 pr-4 gap-6 border-2 flex justify-between">
            <div className="text-xl font-bold mt-0.5">{task.name}</div>
            <div>
                <TaskStatusDisplayer className="mt-1" status={task.status}/>
            </div>
            <div>
                <TaskPriorityDisplayer className="mt-1" priority={task.priority}/>
            </div>
            <div className="flex gap-2">
                <button type="button" className={lightButtonStyle} onClick={() => detailsHandler(task._id)}>деталі</button>
                {rights.edit && <button type="button" className={lightButtonStyle} onClick={() => handlePull(task._id)}>прибрати</button>}
                {rights.delete && <button type="button" className={redButtonSyle} onClick={() => handleDelete(task._id)}>видалити</button>}
            </div>
        </div>
    )}</div>
    else return <div className="flex justify-center font-bold pb-10">задачі відсутні</div>
}

export default SprintTasksMapper;