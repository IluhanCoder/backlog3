import { ChangeEvent, useContext, useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import NewTaskForm from "./new-task-form";
import formStore from "../forms/form-store";
import { submitButtonStyle } from "../styles/button-syles";
import { BacklogResponse } from "../backlogs/backlog-types";
import PushTaskForm from "../sprint/push-task-form";
import { SprintResponse } from "../sprint/sprint-types";
import sprintService from "../sprint/sprint-service";
import LoadingScreen from "../misc/loading-screen";

interface LocalParams {
    backlogId: string,
    push: boolean,
    sprintId?: string,
    onCheck?: () => {},
    onPush?: () => {},
    onPull?: () => {}
}

function TasksMapper ({backlogId, onCheck, push, onPush, sprintId, onPull}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>();

    const handleCheck = async (event: ChangeEvent<HTMLInputElement>) => {
        const {id, checked} = event.target;
        if(checked) await taskService.checkTask(id);
        else await taskService.unCheckTask(id);
        if(onCheck) onCheck();
    }

    const getSprints = async () => {
        const result = await taskService.getBacklogTasks(backlogId);
        setTasks([...result.sprints])
    }

    useEffect(() => { getSprints() }, []);

    const handleSprintPush = (task: TaskResponse) => {
        formStore.setForm(<PushTaskForm backlogId={backlogId} task={task} callBack={onPush}/>)
    }

    const handleSprintPull = async (taskId: string) => {
        if(sprintId && onPull) { await sprintService.pullTask(taskId, sprintId); onPull(); }
    }

    if(tasks) return <div>
        {tasks.map((task: TaskResponse) => {
            return <div className="flex gap-2">
                <div>
                    <input type="checkbox" checked={task.isChecked} onChange={(e) => handleCheck(e)} id={task._id}/>
                </div>
                <div className={(task.isChecked ? "underline" : "")}>{task.name}</div>
                {push && <div><button type="button" onClick={() => handleSprintPush(task)} className={submitButtonStyle}>додати в спринт</button></div> || 
                    <div><button type="button" className={submitButtonStyle} onClick={() => handleSprintPull(task._id)}>прибрати зі спринту</button></div>}
            </div>
        })}
    </div>
    else return <LoadingScreen/>
}

export default TasksMapper;