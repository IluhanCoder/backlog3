import { Link, useLinkClickHandler, useLocation, useNavigate } from "react-router-dom";
import formStore from "./forms/form-store";
import LoginForm from "./auth/login-form";
import { observer } from "mobx-react";
import userStore from "./user/user-store";
import authService from "./auth/auth-service";
import { GiCycle } from "react-icons/gi";
import { lightButtonStyle, smallLightButtonStyle } from "./styles/button-syles";
import Avatar from "react-avatar";
import { Buffer } from "buffer";

function Header() {
    const navigate = useNavigate();

    const handleLoginButtonClick = () => {
        formStore.setForm(<LoginForm/>);
    }
    
    const {pathname} = useLocation();

    const handleLogout = async () => {
        await authService.logout();
        navigate("/");
    }

    const convertImage = (image: any) => {
        const base64String = `data:image/jpeg;base64,${Buffer.from(image.data).toString('base64')}`;
        return base64String;
    };

    if(pathname !== "/registration" && pathname !== "/") return <div className="flex flex-col shadow justify-between gap-2 p-5 border-r bg-stone-50">
        <div className="flex flex-col gap-4">
            <div className="text-3xl text-green-500 font-semibold flex justify-center gap-1">
                <GiCycle className="mt-1"/>
                Agile
            </div>
            {userStore.user && <div className="mt-1 text-xl flex flex-col text-gray-700 gap-3">
                <Link to="/projects">Проєкти</Link>
                <Link to="/projects-stats">Статистика проєктів</Link>
                <Link to="/profile">Профіль</Link>
            </div>}
        </div>
        <div className="text-gray-600">
            {userStore.user && 
            <div className="flex flex-col gap-1">
                <Link to="/profile" className="flex gap-2">
                    <Avatar src={userStore.user.avatar ? convertImage(userStore.user.avatar.data) : ""} name={userStore.user.nickname} round size="30"/>
                    <div className="mt-1">{userStore.user.nickname}</div>
                </Link>
                <div className="flex justify-center pt-1">
                    <button className={smallLightButtonStyle} type="button" onClick={handleLogout}>вийти</button>
                </div>
            </div>
            || <div className="pt-1"><button className={smallLightButtonStyle} type="button" onClick={handleLoginButtonClick}>
                увійти
            </button></div>}
        </div>
    </div>
    else return <></>
}

export default observer(Header);