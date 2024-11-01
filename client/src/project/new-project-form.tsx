import FormComponent from "../forms/form-component";
import { FormEvent, useState, ChangeEvent } from "react";
import errorStore from "../errors/error-store";
import { Parameters, ProjectCredentials, typeOptions } from "./project-types";
import userStore from "../user/user-store";
import formStore from "../forms/form-store";
import projectService from "./project-service";
import { submitButtonStyle } from "../styles/button-syles";
import { inputStyle } from "../styles/form-styles";
import ErrorContainer from "../errors/error-container";
import RequirementsPusher from "../requirements/requirements-pusher";
import { RequirementTemp } from "../requirements/requirement-types";
import DatePicker from "../analytics/date-picker";

interface LocalParams {
    callBack: () => void
}

//todo: validation (especially requirements validation)

function NewProjectForm({callBack}: LocalParams) {
    const currentDate = new Date;

    const [formData, setFormData] = useState<ProjectCredentials>({
        name: "",
        startDate: currentDate,
        endDate: new Date((new Date()).setDate(currentDate.getDate() + 10)),
        type: "auto",
        hoursPerDay: 8,
        daysPerWeek: 5,
        requirements: undefined,
        parameters: {
            integration: false,
            support: false,
            fixation: false
        }
    });

    const handleParametersChange = (event: ChangeEvent<HTMLInputElement>) => {
        const parameterName = event.target.name;
        const oldParameters = formData.parameters;
        const newParameters = {...oldParameters};
        newParameters[parameterName as keyof Parameters] = !formData.parameters[parameterName as keyof Parameters];
        setFormData({...formData, parameters:  newParameters});
    }

    const requirementsState = useState<RequirementTemp[]>([]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        errorStore.dropErrors();
    
        if(formData.name.length === 0) {
            errorStore.pushError("Всі поля мають бути заповнені");
            return;
        }
    
        const result = await projectService.newProject({...formData, requirements: requirementsState[0]});
    
        if(result?.status === "success") { 
            formStore.dropForm();
            callBack();
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            });
    };   

    const handleStart = (date: Date) => {
        if(formData) {
            if(date >= formData.endDate) return;
            const newData: ProjectCredentials = {
                ...formData,
                startDate: date
            };
            setFormData({...newData});
        }
    }

    const handleEnd = (date: Date) => {
        if(formData) {
            if(date <= formData.startDate) return;
            const newData: ProjectCredentials = {
               ...formData,
               endDate: date
            };
            setFormData({...newData});
        }
    }

    return <FormComponent formLabel="Новий проєкт">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 px-4">
            <div className="flex gap-10">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <input className={inputStyle} placeholder="назва" name="name" type="text" onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Терміни</label>
                        <DatePicker className="flex flex-col gap-2" startDate={formData.startDate} endDate={formData.endDate} handleStart={handleStart} handleEnd={handleEnd}/>
                    </div>
                    <div className="flex gap-2">
                        <label>Тип проєкту:</label>
                        <select className={inputStyle} name="type" onChange={handleChange}>
                            <option value="auto">визначити автоматично</option>
                            { typeOptions.map((option: string) => <option value={option}>{option}</option>)}
                        </select>
                    </div>
                    <div className="w-full border rounded border-stone-300"></div>
                    {formData.type === "auto" && <div className="flex justify-center">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-center text-xl">параметри</div>
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <input name="integration" type="checkbox" checked={formData.parameters.integration} onChange={handleParametersChange}/>
                                    <label>Інтеграція замовника</label>
                                </div>
                                <div className="flex gap-2">
                                    <input name="support" type="checkbox" checked={formData.parameters.support} onChange={handleParametersChange}/>
                                    <label>Підтримка змін вимог</label>    
                                </div>
                                <div className="flex gap-2">
                                    <input name="fixation" type="checkbox" checked={formData.parameters.fixation} onChange={handleParametersChange}/>
                                    <label>Фіксованість задач</label>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
                <div className="flex flex-col gap-4 py-1">
                    <div className="flex justify-center text-xl ">
                        вимоги
                    </div>
                    <div className="flex flex-col gap-1">
                        <RequirementsPusher requirementsState={requirementsState}/>
                    </div>
                    <div className="flex justify-center">
                        <ErrorContainer/>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <button type="submit" className={submitButtonStyle}>створити</button>
            </div>
        </form>
    </FormComponent>
}

export default NewProjectForm;