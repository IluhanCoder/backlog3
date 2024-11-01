import { useEffect, useState } from "react";
import Phase from "./phase-type";
import Task, { TaskResponse } from "../task/task-types";
import taskService from "../task/task-service";
import TasksMapper from "../task/tasks-mapper";
import LoadingScreen from "../misc/loading-screen";
import { grayButtonStyle, redButtonSyle, submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import NewTaskForm from "../task/new-task-form";
import PhaseTasksMapper from "../task/phase-tasks-mapper";
import AssignForm from "../task/assign-form";
import TaskInfoForm from "../task/task-info-form";
import { Rights } from "../project/project-types";
import phaseService from "./phase-service";
import AssignPhaseForm from "./assignChargeForm";
import { BlockStyle } from "../styles/blocks-styles";
import AnalyticsGraph from "../analytics/graph";
import { convertArray } from "../analytics/analytics-helper";
import { TasksAnalyticsResponse } from "../analytics/analytics-types";
import analyticsService from "../analytics/analytics-service";
import DateFormater from "../misc/date-formatter";

interface LocalParams {
    phase: Phase,
    rights: Rights,
    isActive?: boolean,
    callBack?: () => Promise<void>
}

const PhaseCard = ({phase, rights, callBack, isActive = true}: LocalParams) => {
    const [tasks, setTasks] = useState<TaskResponse[]>();
    const [tasksRatioData, setTasksRatioData] = useState<TasksAnalyticsResponse[]>([]);

    const getTasks = async () => {
        const result = await taskService.getPhaseTasks(phase._id);
        setTasks([...result.tasks]);
    }

    const handleNewTask = () => {
        formStore.setForm(<NewTaskForm phaseId={phase._id} callBack={() => { getTasks(); getTasksAnalytics(); if(callBack) callBack(); }}/>);
    }

    const handleAssign = (task: TaskResponse) => {
        formStore.setForm(<AssignForm task={task} projectId={phase.projectId} callBack={() => {if(callBack) callBack(); getTasks()}}/>)
    }

    const handleDelete = async (taskId: string) => {
        await taskService.deleteTask(taskId);
        getTasks(); getTasksAnalytics();
        if(callBack) callBack();
    }

    const detailsHandler = (taskId: string) => {
        formStore.setForm(<TaskInfoForm taskId={taskId} callBack={getTasks} projectId={phase.projectId} rights={rights}/>)
    }

    const handleDeletePhase = async () => {
        await phaseService.deletePhase(phase._id);
        if(callBack) callBack();
    }

    const handleUp = async () => {
        await phaseService.moveUp(phase._id);
        if(callBack) await callBack();
    }

    const handleDown = async () => {
        await phaseService.moveDown(phase._id);
        if(callBack) await callBack();
    }

    const handleAssignCharge = async () => {
        formStore.setForm(<AssignPhaseForm phase={phase} callBack={getTasks}/>)
        if (callBack) callBack();
    }

    const getTasksAnalytics = async () => {
        const extraDate = new Date();
        extraDate.setMonth(extraDate.getMonth() - 1);
        const result = await analyticsService.phaseTaskRatio(phase.projectId, extraDate, new Date(), true, undefined, phase._id);
        setTasksRatioData([...result.result]);
    }

    useEffect(() => {
        getTasks();
    }, [phase]);

    useEffect(() => {
        getTasksAnalytics();
    }, [])

    if(phase) return <div className={BlockStyle + ` flex flex-col gap-4 ${(new Date(phase.endDate)).getTime() < (new Date()).getTime() ? "border-2 border-red-500" : ""} ${isActive ? "" : "bg-gray-200"}`}>
        <div className="flex w-full ">
            <div className="flex flex-col gap-2 grow">
                <div className="flex justify-center text-4xl font-thin">{`${phase.index + 1 + ". " + phase.name}`}</div>
                {phase.charge && <div className="flex justify-center gap-1 text-xs text-stone-500">
                    <label>Відповідальний за етап:</label>
                    <div>{phase.charge.nickname}</div>
                </div>}  
            </div>
            <div className="flex flex-col gap-2 text-xs mt-2 text-stone-500">
                        <div className="flex">
                            <label>Початок:</label>
                            <DateFormater dayOfWeek={false} value={phase.startDate}/>
                        </div>
                        <div className="flex">
                            <label>Кінець:</label>
                        <DateFormater dayOfWeek={false} value={phase.endDate}/>
                </div>
            </div>

        </div>
        <div className="flex">
            <div className="flex grow flex-col gap-3 p-2">
                <div className="flex text-2xl justify-center">Задачі етапу:</div>
                <div className="max-h-72 overflow-auto">
                    {tasks && <PhaseTasksMapper isActive={isActive} callBack={async () => { await getTasksAnalytics(); await getTasks(); if(callBack) await callBack(); }} rights={rights} tasks={tasks} detailsHandler={detailsHandler} assignHandler={handleAssign} deleteHandler={handleDelete}/>
                    || <LoadingScreen/>}
                </div>
                {rights.create && <div className="flex justify-center">
                    <button type="button" className={submitButtonStyle} onClick={handleNewTask}>
                        додати завдання
                    </button>
                </div>}
            </div>
            <div className="flex flex-col justify-center mb-10">
                <div className="flex justify-center">
                    <div className="flex flex-col gap-2">
                        <div className="text-center">Ефективність виконання задач</div>
                        <AnalyticsGraph width={400} height={200} data={convertArray(tasksRatioData)} name="%"/>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="flex flex-col gap-2 w-full">
                    {rights.edit && <div className="flex justify-end w-full">
                        <button type="button" onClick={handleUp} className={grayButtonStyle + " text-xs"}>Перемістити догори</button>
                    </div>}
                    {rights.edit && <div className="flex justify-end w-full">
                        <button type="button" onClick={handleDown} className={grayButtonStyle + " text-xs"}>Перемістити вниз</button>
                    </div>}
                    {rights.editParticipants && <div className="flex justify-end w-full">
                        <button type="button" className={grayButtonStyle + " text-xs"} onClick={handleAssignCharge}>назначити відповідального</button>
                    </div>}
                    <div className="flex justify-end w-full">
                        <button type="button" className={redButtonSyle} onClick={handleDeletePhase}>видалити етап</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    else return <LoadingScreen/>
}

export default PhaseCard;