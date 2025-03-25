import { useEffect, useState } from "react";
import { TaskResponse } from "../task/task-types";
import { SprintResponse } from "../sprint/sprint-types";
import { BacklogResponse } from "./backlog-types";
import taskService from "../task/task-service";
import sprintService from "../sprint/sprint-service";
import formStore from "../forms/form-store";
import PushTaskForm from "../sprint/push-task-form";
import BacklogTasksMapper from "../task/backlog-tasks-mapper";
import BacklogSprintsMapper from "../sprint/backlog-sprints-mapper";
import { smallLightButtonStyle, submitButtonStyle } from "../styles/button-syles";
import NewTaskForm from "../task/new-task-form";
import NewSprintForm from "../sprint/new-sprint-form";
import AssignForm from "../task/assign-form";
import TaskInfoForm from "../task/task-info-form";
import LoadingScreen from "../misc/loading-screen";
import { Rights } from "../project/project-types";
import { useNavigate, useParams } from "react-router-dom";
import backlogService from "./backlog-service";
import userService from "../user/user-service";

function BacklogPage() {
    const {id} = useParams();

    const navigate = useNavigate();

    const [reloadTrigger, setReloadTrigger] = useState(false);

    const [backlog, setBacklog] = useState<BacklogResponse>();
    const [rights, setRights] = useState<Rights>();

    const getData = async () => {
        if(!id) return;
        const response = await backlogService.getBacklogById(id);
        setBacklog({...response.backlog});
    }

    const getRights = async () => {
        if(backlog) { 
            const result = await userService.getCurrentUserRights(backlog?.projectId);
            setRights({...result.rights});
        }
    }

    useEffect(() => {getData()}, []);
    useEffect(() => {getRights()}, [backlog]);
    
    const handleNewTask = () => {
        if(backlog) formStore.setForm(<NewTaskForm backlogId={backlog._id} callBack={() => {
            getData();
            setReloadTrigger(prev => !prev);
        }}/>)
    }

    const handleNewSprint = () => {
        if(backlog) formStore.setForm(<NewSprintForm projectId={backlog.projectId} backlogId={backlog._id} callBack={() => {
            getData();
            setReloadTrigger(prev => !prev);
        }}/>)
    }

    return (backlog && rights) && <div>
        <div>
            <button type="button" onClick={() => navigate(-1)} className={smallLightButtonStyle + " absolute mt-3 ml-10"}>назад до проєкту</button>
        </div>
        <div className="p-10 bg-white rounded">
            <div className="flex justify-center text-3xl px-4 py-2">{backlog.name}</div>
            <div className="flex flex-col px-6 pb-4 gap-2">
                <div className="font-bold text-gray-600">Задачі беклогу:</div>
                <BacklogTasksMapper callBack={() => {
                getData();
                setReloadTrigger(prev => !prev);
            }} key={reloadTrigger ? 'reload-1' : 'reload-2'} rights={rights} backlogId={backlog?._id} projectId={backlog?.projectId}/>
                {rights.create && <div className="flex pb-4 px-6 justify-center">
                    <button className={submitButtonStyle} type="button" onClick={handleNewTask}>Створити задачу</button>
                </div>}
            </div>
            <div className="flex flex-col px-6 pb-4 gap-2">
                <div className="font-bold text-gray-600">Спринти:</div>
                <BacklogSprintsMapper key={reloadTrigger ? 'reload-1' : 'reload-2'} backlogId={backlog._id} projectId={backlog.projectId} rights={rights} />
                {rights.create && <div className="flex pb-4 px-6 justify-center">
                    <button className={submitButtonStyle} type="button" onClick={handleNewSprint}>Створити спринт</button>
                </div>}
            </div>
        </div>
        </div> || <LoadingScreen/>
}

export default BacklogPage;