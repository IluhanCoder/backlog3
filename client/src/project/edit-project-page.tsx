import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Project, { EditProjectCredentials, ParticipantResponse, ProjectCredentials, ProjectResponse, Rights } from "./project-types";
import projectService from "./project-service";
import LoadingScreen from "../misc/loading-screen";
import DatePicker from "../analytics/date-picker";
import { redButtonSyle, submitButtonStyle } from "../styles/button-syles";
import userStore from "../user/user-store";
import NewOwnerForm from "./new-owner-form";
import formStore from "../forms/form-store";
import { inputStyle } from "../styles/form-styles";

const EditProjectPage = () => {
    const navigate = useNavigate();

    const {projectId} = useParams();
    const [formData, setFormData] = useState<EditProjectCredentials>();
    const [projectData, setProjectData] = useState<ProjectResponse>();
    const [rights, setRights] = useState<Rights>();

    const getProjectData = async () => {
        if(!projectId) return;
        const result = await projectService.getProjectById(projectId);
        setFormData({...result.project});
        setProjectData({...result.project});
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if(formData) 
            setFormData({
                ...formData,
                [event.target.name]: event.target.value,
            });
    };  

    const handleStart = (date: Date) => {
        if(formData) {
            if(date >= formData.endDate) return;
            const newData: EditProjectCredentials = {
                ...formData,
                startDate: date
            };
            setFormData({...newData});
        }
    }

    const handleEnd = (date: Date) => {
        if(formData) {
            if(date <= formData.startDate) return;
            const newData: EditProjectCredentials = {
               ...formData,
               endDate: date
            };
            setFormData({...newData});
        }
    }

    const handleSubmit = async () => {
        if(!projectId || !formData) return
        await projectService.editProject(projectId, formData);
        window.location.reload();
    }

    const handleProjectDelete = async () => {
        if(projectId) {
            await projectService.deleteProject(projectId);
            navigate("/projects");
        }
    }

    const handleChangeOwner = () => {
        if(projectData) {
            formStore.setForm(<NewOwnerForm project={projectData} callBack={getProjectData}/>);
        }
    }

    const getUserRights = () => {
        if(projectData?.owner._id === userStore.user?._id) {
            setRights({
            create: true,
            edit: true,
            delete: true,
            check: true,
            editParticipants: true,
            addParticipants: true,
            editProjectData: true
            });
            return; }
        const currentUser = projectData?.participants.find((participant: ParticipantResponse) => 
            participant.participant._id === userStore.user?._id);
        const userRights = currentUser?.rights;
        setRights(userRights);
    }

    useEffect(() => { 
        getProjectData(); 
    } , []);

    useEffect(() => {
        getUserRights();
    }, [projectData])

    if(formData) return <div className="flex justify-center mt-4"><div className="flex flex-col gap-4 py-4 text-xl px-20">
        <div className="flex gap-2">
            <label className="mt-1">назва проєкту:</label>
            <input className={inputStyle} type="text" name="name" value={formData.name} onChange={handleChange}/>
        </div>
        <div className="flex gap-2">
            <label className="mt-1">днів на тиждень:</label>
            <input className={inputStyle} type="number" name="daysPerWeek" value={formData.daysPerWeek} onChange={handleChange}/>
        </div>
        <div className="flex gap-2">
            <label className="mt-1">годин на добу:</label>
            <input className={inputStyle} type="number" name="hoursPerDay" value={formData.hoursPerDay} onChange={handleChange}/>
        </div>
        <div className="flex justify-center">
            <div className="flex flex-col gap-2">
                <div>Терміни проєкту:</div>
                <DatePicker className="flex flex-col gap-2" startDate={formData.startDate} endDate={formData.endDate} handleStart={handleStart} handleEnd={handleEnd}/>
            </div>
        </div>
        <div className="flex flex-col gap-2">
                {rights?.editProjectData && <div className="flex justify-center"><button type="button" className={redButtonSyle + " text-xs mt-1"} onClick={handleProjectDelete}>
                видалити проєкт
                </button></div>}
            {projectData?.owner._id === userStore.user?._id && <div className="flex justify-center">
                                <button className={redButtonSyle + " text-xs mt-1"} type="button" onClick={handleChangeOwner}>змінити власника проекту</button>
                            </div>}
            <div className="flex justify-center mt-4"><button className={submitButtonStyle} onClick={handleSubmit}>підтвердити зміни</button></div>
        </div>
    </div></div>
    else return <LoadingScreen/>
}

export default EditProjectPage;