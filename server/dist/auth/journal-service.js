"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const journal_model_1 = __importDefault(require("./journal-model"));
exports.default = new class JournalService {
    write(userId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedUserId = new mongoose_1.default.Types.ObjectId(userId);
            yield journal_model_1.default.create({
                userId: convertedUserId,
                action,
                date: new Date()
            });
        });
    }
    login(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.write(userId, "login");
        });
    }
    logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.write(userId, "logout");
        });
    }
    createdTask(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.write(userId, "created task");
        });
    }
    doneTask(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.write(userId, "done task");
        });
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
    getDoneStatistics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const daysOfCurrentMonth = this.getDaysOfCurrentMonth();
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            const endOfMonth = now;
            const dailyStats = yield journal_model_1.default.aggregate([
                {
                    $match: {
                        userId: new mongoose_1.default.Types.ObjectId(userId),
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
            const getDaysInRange = (start, end) => {
                const days = [];
                const date = new Date(start);
                while (date <= end) {
                    days.push(new Date(date));
                    date.setDate(date.getDate() + 1);
                }
                return days;
            };
            const daysInRange = getDaysInRange(startOfMonth, endOfMonth);
            // Combine stats with all days of the month
            return daysInRange.map(date => {
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const stat = dailyStats.find(stat => stat.day === day);
                return { month, day, amount: stat ? stat.amount : 0 };
            });
        });
    }
    getDailyLoginStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const daysOfCurrentMonth = this.getDaysOfCurrentMonth();
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            const endOfMonth = now;
            const dailyStats = yield journal_model_1.default.aggregate([
                {
                    $match: {
                        userId: new mongoose_1.default.Types.ObjectId(userId),
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
            const getDaysInRange = (start, end) => {
                const days = [];
                const date = new Date(start);
                while (date <= end) {
                    days.push(new Date(date));
                    date.setDate(date.getDate() + 1);
                }
                return days;
            };
            // Combine stats with all days of the month
            const daysInRange = getDaysInRange(startOfMonth, endOfMonth);
            // Combine stats with all days of the month
            return daysInRange.map(date => {
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const stat = dailyStats.find(stat => stat.day === day);
                return { month, day, amount: stat ? stat.amount : 0 };
            });
        });
    }
};
//# sourceMappingURL=journal-service.js.map