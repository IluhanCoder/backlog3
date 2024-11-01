import { observer } from "mobx-react-lite";
import userStore from "./user-store";
import InvitesToUserMapper from "../invite/invitesToUser-mapper";
import { useEffect, useState } from "react";
import User, { UserResponse } from "./user-types";
import userService from "./user-service";
import { lightButtonStyle, smallLightButtonStyle, submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import EditProfileForm from "./edit-profile-form";
import { Buffer } from "buffer";
import Avatar from "react-avatar";
import UserStats from "../analytics/user-stats";

interface LocalParams {
    userId: string
}

function ProfilePage ({userId}: LocalParams) {
    const [isCurrentProfile, setIsCurrentProfile] = useState<boolean>(false);
    const [userData, setUserData] = useState<User | null>();

    const getUserData = async () => {
        const result = await userService.getUserById(userId);
        setUserData({...result.user});
    }

    const handleEditProfile = async () => {
        if(userData) formStore.setForm(<EditProfileForm userData={userData} callback={getUserData}/>)
    }
    
    const handleNewAvatar = async (files: FileList | null) => {
        if(files) {
            await userService.setAvatar(files[0]);
            getUserData();
        }
    }

    const convertImage = (image: any) => {
        console.log(image.data)
        const base64String = `data:image/jpeg;base64,${Buffer.from(image.data.data).toString('base64')}`;
        return base64String;
    };

    useEffect(() => {
        getUserData();
        if(userId === userStore.user?._id) setIsCurrentProfile(true);
    }, [])

    return <div className="flex flex-col p-16">
        <div className="flex ">
            <div className={`flex ${(isCurrentProfile) ? "w-1/4" : "w-full"} gap-4`}>
                <div className="flex flex-col justify-center w-full gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center">
                            <Avatar name={userData?.nickname} src={userData?.avatar ? convertImage(userData?.avatar) : ""} className="rounded"/>
                        </div>
                        {isCurrentProfile && <div className="flex justify-center">
                            <label htmlFor="files" className={smallLightButtonStyle + " hover:bg-blue-200"}>Змінити аватар</label>
                            <input type="file" id="files" className="hidden" onChange={(e) => handleNewAvatar(e.target.files)}/>
                        </div>}
                    </div>
                    <div className="flex justify-center text-3xl">
                        {userData?.nickname}
                    </div>
                    <div className="flex justify-center">
                    <div className="flex flex-col gap-4  bg-gray-100 rounded p-6 px-8">
                        <div className="flex flex-col text-xl">
                            <div className="flex gap-2">
                                <label className="text-gray-500">ім'я:</label>
                                <div>{userData?.name}</div>
                            </div>
                            <div className="flex gap-2">
                                <label className="text-gray-500">прізвище:</label>
                                    <div>{userData?.surname}</div>
                                </div>
                                <div className="flex gap-2">
                                    <label className="text-gray-500">компанія:</label>
                                    <div>{userData?.organisation}</div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                {isCurrentProfile && <button type="button" className={lightButtonStyle} onClick={handleEditProfile}>редагувати профіль</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isCurrentProfile && <div className="flex justify-center w-3/4">
                <InvitesToUserMapper/>
            </div>}
        </div>
        <div className="flex flex-col gap-2">
            <UserStats userId={userId}/>
        </div>
    </div>
}

export default observer(ProfilePage);