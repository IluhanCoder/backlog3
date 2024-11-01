import { ChangeEvent, useState } from "react";
import { requirementCategories, requirementCategoriesTranslations, RequirementTemp } from "./requirement-types";
import { grayButtonStyle, submitButtonStyle } from "../styles/button-syles";
import RequirementCard from "./requirement-card";
import { inputStyle } from "../styles/form-styles";

interface LocalParams {
    requirementsState: [RequirementTemp[], React.Dispatch<React.SetStateAction<RequirementTemp[]>>]
}

const RequirementsPusher = ({ requirementsState }: LocalParams) => {
    const [requirements, setRequirements] = requirementsState;

    const defaultFormData = {
        title: "",
        description: "",
        category: requirementCategories[0],
        projectId: undefined
    }

    const [formData, setFormData] = useState<RequirementTemp>(defaultFormData);

    const handleChange = (event: any) => {
        setFormData({
        ...formData,
        [event.target.name]: event.target.value,
        });
    };   

    const handlePush = () => {
        if(formData.title.length > 0) {
            setRequirements([...requirements, formData]);
            setFormData({...defaultFormData});
        }
    }

    //todo: clear form inputs when push

    return <div>
        <div className="flex flex-col gap-2 px-20">
            <div className="flex gap-4 justify-center">
                <div>
                    <input type="text" className={inputStyle} placeholder="вимога" value={formData.title} name="title" onChange={handleChange}/>
                </div>
                <div>
                    <input type="text" className={inputStyle} placeholder="опис" value={formData.description} name="description" onChange={handleChange}/>
                </div>
            </div>
            <div className="flex gap-4 w-full">
                <label className="mt-1">Категорія:</label>
                <select className={inputStyle + " grow"} name="category" value={formData.category} onChange={handleChange}>
                   {
                    requirementCategories.map((category: string, index: number) => 
                        <option value={category}>
                            {requirementCategoriesTranslations[index]}
                        </option>
                    )
                   }
                </select>
            </div>
            <div className="flex justify-center">
                <button type="button" className={grayButtonStyle + " py-0.5"} onClick={handlePush}>додати</button>
            </div>
        </div>
        <div className="flex w-full justify-center p-4">
            <div className="flex overflow-auto">
                    <div className="flex w-full gap-4 max-w-2xl flex-wrap max-h-64">
                        {
                            requirements.length > 0 ? requirements.map((req: RequirementTemp) => <div>
                                    <RequirementCard requirement={req}/>
                                </div>) : <div className="flex w-full justify-center mt-16 text-stone-700">Тут ви можете додавати вимоги</div>
                        }
                    </div>
            </div>
        </div>
    </div>
}

export default RequirementsPusher;