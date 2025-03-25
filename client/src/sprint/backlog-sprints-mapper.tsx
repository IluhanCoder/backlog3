import { useEffect, useState } from "react";
import { SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import { TaskResponse } from "../task/task-types";
import SprintTasksMapper from "../task/sprint-tasks-mapper";
import formStore from "../forms/form-store";
import EditSprintForm from "./edit-sprint-form";
import { lightButtonStyle, redButtonSyle, submitButtonStyle } from "../styles/button-syles";
import { Rights } from "../project/project-types";
import LoadingScreen from "../misc/loading-screen";

interface LocalParams {
    backlogId: string,
    projectId: string,
    rights: Rights
}

function BacklogSprintsMapper({rights, backlogId, projectId}: LocalParams) {
    const [sprints, setSprints] = useState<SprintResponse[]>();

    const getData = async () => {
            const response = await sprintService.getSprints(backlogId);
            setSprints([...response.sprints]);
        }

    const handleEdit = (sprintId: string) => {
        formStore.setForm(<EditSprintForm sprintId={sprintId} callBack={getData}/>);
    }

    useEffect(() => {
        getData();
    }, []);

    const handlePull = async (taskId: string) => {
        await sprintService.pullTask(taskId, backlogId);
        getData();
    }

    const handleDelete = async (sprintId: string) => {
        await sprintService.deleteSprint(sprintId);
        getData();
    }

    const isTerminated = (sprint: SprintResponse) => {
        return new Date() > new Date(sprint.endDate);
    }

    if(sprints) return <div className="flex flex-col gap-2">
        {sprints.length > 0 && sprints.map((sprint: SprintResponse) => <div className={`flex rounded border px-6 py-3 flex-col ${(isTerminated(sprint)) ? "border-red-500 border-2" : "border"}`}>
            <div className="flex justify-between">
                <div className="text-xl">{sprint.name}</div>
                <div className="flex gap-2">
                    {rights.edit && <button type="button" onClick={() => handleEdit(sprint._id)} className={lightButtonStyle}>редагувати спринт</button>}
                    {rights.delete && <button type="button" onClick={() => handleDelete(sprint._id)} className={redButtonSyle}>видалити спринт</button>}
                </div>
            </div>
            <div>
                <div>задачі спринту:</div>
                <SprintTasksMapper rights={rights} backlogId={backlogId} projectId={projectId} sprintId={sprint._id}/>
            </div>
        </div>) || <div className="flex justify-center p-8 text-xl font-bold text-gray-600">спринти відсутні</div> }
    </div>
    else return <LoadingScreen/>
}

export default BacklogSprintsMapper;