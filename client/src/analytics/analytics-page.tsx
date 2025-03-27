import { useEffect, useState } from "react";
import { TasksAnalyticsResponse } from "./analytics-types";
import analyticsService from "./analytics-service";
import { useParams } from "react-router-dom";
import { UserResponse } from "../user/user-types";
import UsersMapper from "../user/users-mapper";
import userStore from "../user/user-store";
import { observer } from "mobx-react";
import AnalyticsGraph from "./graph";
import { convertArray } from "./analytics-helper";
import DatePicker from "./date-picker";
import { Link } from "react-router-dom";
import { lightButtonStyle } from "../styles/button-syles";

function AnalyticsPage () {
    const {projectId} = useParams();

    const [taskAmountData, setTasksAmountData] = useState<TasksAnalyticsResponse[]>([]);
    const [tasksRatioData, setTasksRatioData] = useState<TasksAnalyticsResponse[]>([]);
    const [createdTaskData, setCreatedTaskData] = useState<TasksAnalyticsResponse[]>([]);
    const [prediction, setPrediction] = useState<TasksAnalyticsResponse[]>([]);

    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
    const [isDaily, setIsDaily] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<Date>(new Date(2024, 10, 1));
    const [endDate, setEndDate] = useState<Date>(new Date(2025, 3, 1));

    const handleStart = (date: Date) => {
        if (date >= endDate) return;
        setStartDate(date);
    }

    const handleEnd = (date: Date) => {
        if (date <= startDate) return;
        setEndDate(date);
    }

    const getTasksAmoutAnalytics = async () => {
        if(projectId && userStore.user?._id) { 
            const result = await analyticsService.taskAmount(projectId, startDate, endDate, isDaily, (isCurrentUser) ? userStore.user?._id : undefined);
            setTasksAmountData([...result.result]);
        }
    }   

    const getTasksRatioData = async () => {
        if(projectId && userStore.user?._id) {
            const result = await analyticsService.taskRatio(projectId, startDate, endDate, isDaily, (isCurrentUser) ? userStore.user?._id : undefined);
            setTasksRatioData([...result.result]);
        }
    }

    const getCreatedTaskData = async () => {
        if(projectId && userStore.user?._id) {
            const result = await analyticsService.createdTaskAmount(projectId, startDate, endDate, isDaily, (isCurrentUser) ? userStore.user?._id : undefined);
            console.log(result);
            setCreatedTaskData([...result.result]);
        }
    }

    const getPrediction = async () => {
        if(projectId && userStore.user?._id) {
            const result = await analyticsService.predictRatio(projectId, (isCurrentUser) ? userStore.user?._id : undefined);
            setPrediction([...result.result]);
        }
    }

    useEffect(() => { getTasksAmoutAnalytics(); getTasksRatioData(); getCreatedTaskData(); getPrediction() }, [userStore.user?._id, isDaily, isCurrentUser, startDate, endDate]);

    return <div className="flex flex-col p-4 gap-2">
        <div className="py-2">
            <Link to={`/project/${projectId}`} className={lightButtonStyle}>Назад до проєкту</Link>
        </div>
        <div className="flex justify-center">
            <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                    <input type="checkBox" checked={isDaily} onChange={() => setIsDaily(!isDaily)}/>
                    <label>щоденна статистика</label>
                </div>
                <div className="flex gap-2">
                    <input type="checkBox" checked={isCurrentUser} onChange={() => setIsCurrentUser(!isCurrentUser)}/>
                    <label>тільки задачі, призначені вам</label>
                </div>
            </div>
        </div>
        <div className="flex justify-center">
            <DatePicker className="flex gap-4" startDate={startDate} endDate={endDate} handleStart={handleStart} handleEnd={handleEnd}/>
        </div>
        <div className="flex justify-center mt-2">
            <div className="flex flex-col gap-2">
                <div className="text-2xl flex justify-center">Кількість створених завдань</div>
                <AnalyticsGraph data={convertArray(createdTaskData)} name="кількість"/>
            </div>
        </div>
        <div className="flex justify-center">
            <div className="flex flex-col gap-2">
                <div className="text-2xl flex justify-center">Виконання задач</div>
                <AnalyticsGraph data={convertArray(taskAmountData)} name="кількість"/>
            </div>
        </div>
        <div className="flex justify-center">
            <div className="flex flex-col gap-2">
                <div className="text-2xl flex justify-center">Співвідношення виконанних і невиконанних задач</div>
                <AnalyticsGraph data={convertArray(tasksRatioData)} name="%"/>
            </div>
        </div>
        <div className="flex justify-center">
            <div className="flex flex-col gap-2">
                <div className="text-2xl flex justify-center">Прогноз ефективності (лінійна регресія)</div>
                <AnalyticsGraph data={convertArray(prediction)} name="%"/>
            </div>
        </div>
    </div>
}

export default observer(AnalyticsPage);