import mongoose from "mongoose";
import journalModel from "./journal-model"

export default new class JournalService  {
    async write (userId: string, action: string) {
        const convertedUserId = new mongoose.Types.ObjectId(userId);
        await journalModel.create({
            userId: convertedUserId,
            action,
            date: new Date()
        });
    }

    async login(userId: string) {
        await this.write(userId, "login");
    }

    async logout(userId: string) {
        await this.write(userId, "logout");
    }

    async createdTask(userId: string) {
        await this.write(userId, "created task");
    }

    async doneTask(userId: string) {
        await this.write(userId, "done task");
    }

    getDaysOfCurrentMonth() {
        const days = [];
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
        for (let day = 1; day <= now.getDate() + 1; day++) {
            days.push(new Date(now.getFullYear(), now.getMonth(), day));
        }
    
        return days;
    }

// Function to get task completion stats by day, including zero-count days
    async getDoneStatistics(userId: string) {
        const daysOfCurrentMonth = this.getDaysOfCurrentMonth();
        const startOfMonth = daysOfCurrentMonth[0];
        const endOfMonth = daysOfCurrentMonth[daysOfCurrentMonth.length - 1];

        const dailyStats = await journalModel.aggregate([
            { 
                $match: { 
                    userId: new mongoose.Types.ObjectId(userId),
                    action: "done task", 
                    date: { $gte: startOfMonth, $lte: endOfMonth } 
                } 
            },
            {
                $group: {
                    _id: { day: { $dayOfMonth: "$date" } },
                    amount: { $sum: 1 }
                }
            },
            {
                $project: {
                    day: "$_id.day",
                    amount: 1,
                    _id: 0
                }
            }
    ]);

    // Combine stats with all days of the month
    return daysOfCurrentMonth.map(date => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const stat = dailyStats.find(stat => stat.day === day);
        return { month, day, amount: stat ? stat.amount : 0 };
    });
}

async getDailyLoginStats(userId: string) {
    const daysOfCurrentMonth = this.getDaysOfCurrentMonth();
    const startOfMonth = daysOfCurrentMonth[0];
    const endOfMonth = daysOfCurrentMonth[daysOfCurrentMonth.length - 1];

    const dailyStats = await journalModel.aggregate([
        { 
            $match: { 
                userId: new mongoose.Types.ObjectId(userId),
                action: "login", 
                date: { $gte: startOfMonth, $lte: endOfMonth } 
            } 
        },
        {
            $group: {
                _id: { day: { $dayOfMonth: "$date" } },
                amount: { $sum: 1 }
            }
        },
        {
            $project: {
                day: "$_id.day",
                amount: 1,
                _id: 0
            }
        }
    ]);

    // Combine stats with all days of the month
    return daysOfCurrentMonth.map(date => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const stat = dailyStats.find(stat => stat.day === day);
        return { month, day, amount: stat ? stat.amount : 0 };
    });
}
}