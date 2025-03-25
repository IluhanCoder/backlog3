import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import FormComponent from "../forms/form-component";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import sprintService from "./sprint-service";
import { inputStyle } from "../styles/form-styles";

interface LocalParams {
    backlogId?: string,
    projectId?: string,
    callBack?: () => void
}

function NewSprintForm ({backlogId, projectId, callBack}: LocalParams) {
    const [formData, setFormData] = useState<{name: string}>({name: ""});

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        await sprintService.createSprint(formData.name, backlogId, projectId);
        if(callBack !== undefined) callBack();
        formStore.dropForm();
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [event.target.name]: event.target.value,
        });
    };  

    return <FormComponent formLabel="створення спринту">
        <form onSubmit={(event: FormEvent) => handleSubmit(event)} className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 py-2">
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-gray-600 text-xs">Назва спринту:</label>
                    <input className={inputStyle + " w-96"} type="text" name="name" onChange={handleChange}/>
                </div>
            </div>
            <div className="flex justify-center">
                <button type="submit" className={submitButtonStyle}>створити</button>
            </div>
        </form>
    </FormComponent>
}

export default NewSprintForm;