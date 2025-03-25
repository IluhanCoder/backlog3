import { useEffect, useState } from "react";
import { convertArray } from "./analytics-helper";
import AnalyticsGraph from "./graph";
import analyticsService from "./analytics-service";
import LoadingScreen from "../misc/loading-screen";
import userStore from "../user/user-store";
import { observer } from "mobx-react";
import DatePicker from "./date-picker";

const UserProjectStats = () => {
    const [createdProjectsData, setCreatedProjectsData] = useState<any[] | null>(null);
    const [completedProjectsData, setCompletedProjectsData] = useState<any[] | null>(null);
    const [averageTasksData, setAverageTasksData] = useState<any[] | null>(null);
    const [isDaily, setIsDaily] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date>(new Date(2024, 8, 1));
    const [endDate, setEndDate] = useState<Date>(new Date(2025, 2, 1));

    const getData = async () => {
        if (userStore.user?._id) {
            console.log(startDate, endDate);
            const resultOne = await analyticsService.fetchCreatedProjectAmount(userStore.user._id, startDate, endDate, isDaily);
            setCreatedProjectsData([...resultOne.result]);
            const resultTwo = await analyticsService.fullyCompletedProjectsAmount(startDate, endDate, isDaily, userStore.user._id);
            setCompletedProjectsData([...resultTwo.result]);
            const resultThree = await analyticsService.averageTaskAmount(startDate, endDate, isDaily, userStore.user._id);
            setAverageTasksData([...resultThree.result]);
        }
    };

    const handleStart = (date: Date) => {
        if (date >= endDate) return;
        setStartDate(date);
    }

    const handleEnd = (date: Date) => {
        if (date <= startDate) return;
        setEndDate(date);
    }

    useEffect(() => {
        getData();
    }, [userStore.user?._id, isDaily, startDate, endDate]);

    return (
        <div className="flex flex-col p-4 gap-2">
            <div className="flex justify-center">
                <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                        <input type="checkBox" checked={isDaily} onChange={() => setIsDaily(!isDaily)} />
                        <label>Щоденна статистика</label>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="flex justify-center">
                    <DatePicker className="flex gap-4" startDate={startDate} endDate={endDate} handleStart={handleStart} handleEnd={handleEnd}/>
                </div>
            </div>
            <div className="flex justify-center mt-2">
                {createdProjectsData ? (
                    <div className="flex flex-col gap-2">
                        <div className="text-2xl flex justify-center">Кількість створених проєктів</div>
                        <AnalyticsGraph data={convertArray(createdProjectsData)} name="кількість" />
                    </div>
                ) : (
                    <LoadingScreen />
                )}
            </div>
            <div className="flex justify-center mt-2">
                {completedProjectsData ? (
                    <div className="flex flex-col gap-2">
                        <div className="text-2xl flex justify-center">Кількість завершених проєктів</div>
                        <AnalyticsGraph data={convertArray(completedProjectsData)} name="кількість" />
                    </div>
                ) : (
                    <LoadingScreen />
                )}
            </div>
            <div className="flex justify-center mt-2">
                {averageTasksData ? (
                    <div className="flex flex-col gap-2">
                        <div className="text-2xl flex justify-center">Середня кількість задач в проєкті</div>
                        <AnalyticsGraph data={convertArray(averageTasksData)} name="кількість" />
                    </div>
                ) : (
                    <LoadingScreen />
                )}
            </div>
        </div>
    );
};

export default observer(UserProjectStats);
