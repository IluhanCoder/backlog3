import { ChangeEvent, useEffect, useState } from "react";
import FormComponent from "../forms/form-component";
import { TaskResponse } from "../task/task-types";
import { SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import LoadingScreen from "../misc/loading-screen";

interface LocalParams {
    task: TaskResponse,
    backlogId: string,
    callBack?: () => void
}

function PushTaskForm({task, callBack, backlogId}: LocalParams) {
    const [sprints, setSprints] = useState<SprintResponse[]>();    
    const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>();

    const getData = async () => {
        const result = await sprintService.getSprints(backlogId);
        setSprints([...result.sprints]);
    }

    useEffect(() => {
        getData();
    }, []);

    const handleSelect = (sprintId: string) => {
        setSelectedSprintId(sprintId);
    }

    const handleSubmit = async () => {
        if(selectedSprintId) { 
            await sprintService.pushTask(task._id, selectedSprintId);
            formStore.dropForm();
            if(callBack) callBack();
        }
    }

    return <FormComponent formLabel={`Додати "${task.name}" до спринту`}>
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-2">{
                sprints && sprints.map((sprint: SprintResponse) => <button className={(sprint._id === selectedSprintId ? "text-blue-500 " : "text-black ") + "bg-gray-100 rounded px-2 py-1"} type="button" onClick={() => handleSelect(sprint._id)}>{sprint.name}</button>) || <LoadingScreen/>
                }</div>
            <div className="flex justify-center">
                <button type="button" className={submitButtonStyle} disabled={!selectedSprintId} onClick={handleSubmit}>додати</button>
            </div>
        </div>
    </FormComponent>
}

export default PushTaskForm;