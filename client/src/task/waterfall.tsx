import { useEffect, useState } from "react";
import formStore from "../forms/form-store";
import NewPhaseForm from "../phase/new-phase-form";
import { ProjectResponse, Rights } from "../project/project-types";
import { submitButtonStyle } from "../styles/button-syles";
import Phase, { PhaseCredentials } from "../phase/phase-type";
import LoadingScreen from "../misc/loading-screen";
import PhasesMapper from "../phase/phase-mapper";
import phaseService from "../phase/phase-service";
import userStore from "../user/user-store";
import { observer } from "mobx-react";

interface LocalParams {
    project: ProjectResponse,
    rights: Rights
}

const Waterfall = ({project, rights}: LocalParams) => {
    const [phases, setPhases] = useState<Phase[] | undefined>(undefined);
    const [isMyPhases, setIsMyPhases] = useState<boolean>(false);

    const newPhaseHandler = async (formData: PhaseCredentials) => {
        await phaseService.CreatePhase({...formData, index: phases ? phases?.length : 0});
        formStore.dropForm();
        getPhases();
    }

    const HandleNewPhase = () => {
        formStore.setForm(<NewPhaseForm newPhaseHandler={newPhaseHandler} projectId={project._id} callBack={getPhases}/>);
    }

    const getPhases = async () => {
        const result = isMyPhases ? await phaseService.getProjectPhases(project._id, userStore.user?._id) : await phaseService.getProjectPhases(project._id); 
        setPhases([...result.phases]);
    }

    useEffect(() => {
        getPhases();
    }, [isMyPhases]);

    if(phases) return <div className="h-fit">
        <div className="flex gap-2 justify-center">
            <input type="checkbox" checked={isMyPhases} onChange={(event) => setIsMyPhases(!isMyPhases)}/>
            <label>Тільки етапи, за які відповідальні ви</label>
        </div>
        <div className="max-h-[1000px] overflow-auto">
            <PhasesMapper projectId={project._id} callBack={getPhases} phases={phases} rights={rights}/>
        </div>
        <div className="flex justify-center">
            <button type="button" className={submitButtonStyle + " text-2xl"} onClick={HandleNewPhase}>
                додати етап
            </button>
        </div>
    </div>
    else return <LoadingScreen/>
}

export default observer(Waterfall);