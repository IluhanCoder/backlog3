import { requirementCategories, requirementCategoriesTranslations, RequirementTemp } from "./requirement-types";

interface LocalParams {
    requirement: RequirementTemp
}

const RequirementCard = ({ requirement }: LocalParams) => {
    return <div className="flex flex-col bg-stone-100 py-2 px-8 rounded shadow">
        <div className="w-full flex justify-center text-stone-400">
            <div className="text-xs">{requirementCategoriesTranslations[requirementCategories.indexOf(requirement.category)]}</div>
        </div>
        <div className="w-full flex justify-center text-xl">
            <div>{requirement.title}</div>
        </div>
        <div className="flex flex-col">
            <label>Опис:</label>
            <div className="px-6">{(requirement.description.length > 0) ? requirement.description : "Вимога не містить опису"}</div>
        </div>
        
    </div>
}

export default RequirementCard;