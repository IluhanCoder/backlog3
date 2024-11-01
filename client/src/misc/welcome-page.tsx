import { VscRocket, VscOrganization, VscArrowSwap, VscSymbolEvent, VscGraphLine  } from "react-icons/vsc";
import userStore from "../user/user-store";
import { Link } from "react-router-dom";
import { lightButtonStyle, welcomeButtonStyle } from "../styles/button-syles";
import { observer } from "mobx-react";
import { SiVscodium } from "react-icons/si";
import formStore from "../forms/form-store";
import LoginForm from "../auth/login-form";

function WelcomePage() {
    return <div className="flex w-full p-4">
        <div className="flex justify-center w-full">
            <div className="flex justify-center w-2/3">
                <div className="flex flex-col gap-28 w-full">
                    <div className="flex justify-between">
                        <div className="text-2xl font-semibold flex gap-1">
                            <SiVscodium className="mt-1"/>
                            Methologist
                        </div>
                        <div>
                            <button type="button" className={welcomeButtonStyle + " flex gap-3"} onClick={() => formStore.setForm(<LoginForm/>)}>Увійти в обліковий запис <p>→</p></button>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="flex flex-col gap-10">
                            <h1 className="text-6xl text-gray-800 font-bold">Чому саме Methologist?</h1>
                                <div className="flex flex-col gap-4 text-xl px-10 font-light">
                                    <div className="flex justify-center gap-4">
                                        🕹️
                                        <p>три різних методології керування проєктами</p>
                                    </div>
                                    <div className="flex justify-center gap-4">
                                        👥
                                        <p>можливість збирати та керувати командою</p>
                                    </div>
                                    <div className="flex justify-center gap-4">
                                        ⏰
                                        <p>гнучке керування термінами проєктів</p>
                                    </div>
                                    <div className="flex justify-center gap-4">
                                        📋
                                        <p>розподіл та виконання задач</p>
                                    </div>
                                    <div className="flex justify-center gap-4">
                                        📈
                                        <p>збір статистики та аналіз ефективності</p>
                                    </div>
                                </div>
                                {userStore.user && 
                                <div className="flex justify-center">
                                    <Link to="/projects" className={lightButtonStyle}>ваші проєкти</Link>
                                </div>}
                                <div className="flex justify-center">
                                    <Link to="/registration" className={"flex gap-3 px-14 py-3 text-2xl " + welcomeButtonStyle}>розпочати роботу <p>→</p></Link>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
}

export default observer(WelcomePage);