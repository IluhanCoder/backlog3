import { FormEvent, useState } from "react";
import { largeSubmitButtonStyle, submitButtonStyle } from "../styles/button-syles";
import { inputStyle, linkStyle } from "../styles/form-styles";
import RegCredantials from "./auth-types";
import { ChangeEvent } from "react";
import authService from "./auth-service";
import ErrorContainer from "../errors/error-container";
import { observer } from "mobx-react";
import errorStore from "../errors/error-store";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import formStore from "../forms/form-store";
import LoginForm from "./login-form";

function RegistationPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegCredantials>({
        name: "",
        surname: "",
        nickname: "",
        email: "",
        organisation: "",
        password: "",
        pswSubmit: ""
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
    };    

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        errorStore.dropErrors();

        if(formData.password !== formData.pswSubmit) {
            errorStore.pushError("Пароль та підтвердження паролю мають співпадати");
            return;
        }

        try {
            const result = await authService.registrate(formData);

            if(result?.status === "success") { 
                alert("Користувача було успішно зареєстровано");
                await authService.login(formData);
                navigate("/");
            }
        } catch (error) {
            throw error;
        }
    }

    return <div className="flex flex-col p-10">
        <div className="flex justify-center">
            <div className="flex justify-center px-12 w-2/3">
                <div className="flex flex-col w-full">
                    <div className="flex flex-col gap-2 py-6">
                        <div className="flex justify-center">
                            <h1 className="text-3xl">Вітаємо в Agile 😉</h1>
                        </div>
                        <div className="flex justify-center text-stone-600">
                            <p>Просимо ввести інформацію про Вас, щоб Ви могли продовжити роботу із системою</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 p-4 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-1">
                                <input className={inputStyle} placeholder="імʼя" type="text" name="name" onChange={handleChange}/>
                            </div>
                            <div className="flex flex-col gap-1 col-span-1">
                                <input className={inputStyle} placeholder="псевдонім користувача (логін)" type="text" onChange={handleChange} name="nickname"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <input className={inputStyle} placeholder="прізвище" type="text" onChange={handleChange} name="surname"/>
                            </div>
                            <div className="flex flex-col gap-1 col-span-1">
                                <input className={inputStyle}  placeholder="email" type="email" onChange={handleChange} name="email"/>
                            </div>
                            <div className="flex flex-col gap-1 col-span-2">
                                <input className={inputStyle} placeholder="назва організації, в якій ви працюєте" type="text" onChange={handleChange} name="organisation"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <input className={inputStyle} placeholder="пароль" type="password" onChange={handleChange} name="password"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <input className={inputStyle}  placeholder="підтвердження пароля" type="password" onChange={handleChange} name="pswSubmit"/>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <ErrorContainer/>
                        </div>
                        <div className="flex justify-center pt-4">
                            <button type="submit" className={largeSubmitButtonStyle} onClick={handleSubmit}>Зареєструватися</button>
                        </div>
                        <div className="flex justify-center pt-6">
                            <button type="button" onClick={() => formStore.setForm(<LoginForm/>)} className={linkStyle}>Я вже маю обліковий запис</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
}

export default observer(RegistationPage);