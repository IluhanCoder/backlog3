import { useEffect, useState } from "react";
import { requirementCategories, requirementCategoriesPluralTranslations, requirementCategoriesTranslations, RequirementTemp } from "./requirement-types";
import LoadingScreen from "../misc/loading-screen";
import requirementService from "./requirement-service";
import RequirementCard from "./requirement-card";

interface LocalParams {
    projectId: string
}

const RequirementsMapper = ({projectId}: LocalParams) => {
    const [requirements, setRequirements] = useState<RequirementTemp[]>();

    const getRequirements = async () => {
        const result = await requirementService.getRequirements(projectId);
        setRequirements([...result.requirements]);
    }

    useEffect(() => {
        getRequirements();
    }, []);

    if(requirements) return <div className="grid grid-cols-2 gap-6 p-2 ">
        {
            requirementCategories.map((category: string) => {
                const filteredRequirements = requirements.filter((requirement: RequirementTemp) => requirement.category === category);
                return <div className="flex flex-col gap-2 py-4 px-10 border rounded shadow rounded">
                    <div className="flex justify-center">{requirementCategoriesPluralTranslations[requirementCategories.indexOf(category)]}</div>
                    <div className="w-full overflow-auto max-h-72">
                            {filteredRequirements.length > 0 ? <div className="flex flex-wrap gap-2 max-w-2xl">{filteredRequirements.map((requirement: RequirementTemp) => <RequirementCard requirement={requirement}/>)}</div> : <div className="flex justify-center text-stone-500 p-8">Вимоги відсутні</div>}
                        </div>
                    </div>
            })
        }
    </div>
    else return <LoadingScreen/>
}

export default RequirementsMapper;