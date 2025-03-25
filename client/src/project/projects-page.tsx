import { useEffect, useState } from "react";
import Project, { ProjectResponse } from "./project-types";
import projectService from "./project-service";
import userStore from "../user/user-store";
import { observer } from "mobx-react";
import ProjectCard from "./project-card";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import NewProjectForm from "./new-project-form";
import LoadingScreen from "../misc/loading-screen";
import { inputStyle } from "../styles/form-styles";

function ProjectsPage () {
    const user = userStore.user;

    const [projects, setProjects] = useState<ProjectResponse[] | null>(null);
    const [filteredProjects, setFilteredProjects] = useState<ProjectResponse[]>([]);
    const [filter, setFilter] = useState<string>("");

    const filterProject = () => {
        const newData = projects?.filter((project: ProjectResponse) => project.name.toUpperCase().includes(filter.toUpperCase()));
        if(newData) setFilteredProjects([...newData]);
    }

    const fetchProjects = async () => {
        if(!user) {
            return;
        }
        const result = await projectService.getUserProjects();
        setProjects(result);
        setFilteredProjects(result);
    }

    const handleNewProject = () => {
        formStore.setForm(<NewProjectForm callBack={(fetchProjects)}/>);
    }

    useEffect(() => {fetchProjects()}, [user]);
    useEffect(() => {filterProject()}, [filter]);

    if(projects) return <div className="bg-gray-50 flex flex-col h-full p-4">
        <div className="font-thin px-6 pt-4 text-3xl text-center">
            Ваші проєкти
        </div>
        <div className="flex justify-end gap-2">
            <input type="text" placeholder="🔍  пошук" className={inputStyle + " py-1 w-80"} value={filter} onChange={(e: any) => setFilter(e.target.value)}/>
        </div>
        {projects.length > 0 && <div className="grow overflow-auto pt-6">
            <div className="flex px-6 flex-col gap-4">
            {filteredProjects.map((project: ProjectResponse) => {
                return <ProjectCard project={project}/>
            })}</div></div> || <div className="grow text-center pt-48 text-2xl font-bold text-gray-600">проєкти відсутні</div>}
        <div className="flex justify-center">
            <button type="button" className={submitButtonStyle} onClick={handleNewProject}>створити новий проєкт</button>
        </div>
    </div>
    else return <LoadingScreen/>
}

export default observer(ProjectsPage);