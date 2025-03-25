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
const task_model_1 = __importDefault(require("../tasks/task-model"));
const backlog_model_1 = __importDefault(require("../backlog/backlog-model"));
const ml_regression_simple_linear_1 = require("ml-regression-simple-linear");
const project_model_1 = __importDefault(require("../projects/project-model"));
const sprint_model_1 = __importDefault(require("../sprints/sprint-model"));
const phase_model_1 = __importDefault(require("../phase/phase-model"));
exports.default = new class AnalyticsService {
    // Helper to collect all tasks
    getFilteredTasks(projectId, startDate, endDate, userId = null, phaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedProjectId = new mongoose_1.default.Types.ObjectId(projectId);
            const projectTasks = yield task_model_1.default.find({
                projectId: convertedProjectId,
                created: { $gte: startDate, $lte: endDate },
            });
            const backlogs = yield backlog_model_1.default.find({ projectId: convertedProjectId });
            const backlogTasks = yield this.getTasksFromBacklogs(backlogs, startDate, endDate);
            const phases = yield phase_model_1.default.find({ projectId: convertedProjectId });
            const phaseTasks = (phaseId) ? yield task_model_1.default.find({ phaseId: new mongoose_1.default.Types.ObjectId(phaseId) }) : yield this.getTasksFromPhases(phases, startDate, endDate);
            let allTasks;
            if (phaseId === undefined)
                allTasks = [...projectTasks, ...backlogTasks, ...phaseTasks];
            else
                allTasks = [...phaseTasks];
            return userId
                ? allTasks.filter(task => task.executors.some(executor => executor.equals(new mongoose_1.default.Types.ObjectId(userId))))
                : allTasks;
        });
    }
    createdProjectAmount(userId, startDate, endDate, isDaily) {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield project_model_1.default.find({
                owner: new mongoose_1.default.Types.ObjectId(userId),
                created: { $gte: startDate, $lte: endDate }
            });
            return this.generateProjectStatistic(projects, startDate, endDate, isDaily ? "day" : "month");
        });
    }
    fullyCompletedProjectsAmount(userId, startDate, endDate, isDaily) {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield project_model_1.default.find({
                owner: new mongoose_1.default.Types.ObjectId(userId),
                created: { $gte: startDate, $lte: endDate }
            });
            // Фільтрація проєктів, де всі таски "done"
            const filteredProjects = yield Promise.all(projects.map((project) => __awaiter(this, void 0, void 0, function* () {
                const tasks = yield this.getFilteredTasks(project._id.toString(), startDate, endDate);
                return tasks.length > 0 && tasks.every(task => task.status === "done") ? project : null;
            })));
            const completedProjects = filteredProjects.filter(p => p !== null);
            return this.generateProjectStatistic(completedProjects, startDate, endDate, isDaily ? "day" : "month");
        });
    }
    generateProjectStatistic(projects, startDate, endDate, groupBy = "day") {
        const statistics = {};
        projects.forEach((project) => {
            const date = new Date(project.created);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const key = groupBy === "day" ? `${year}-${month}-${day}` : `${year}-${month}`;
            statistics[key] = (statistics[key] || 0) + 1;
        });
        // Генерація діапазону дат з нормалізацією часу
        const result = [];
        let currentDate = new Date(startDate);
        currentDate.setHours(0, 0, 0, 0); // Обнуляємо час, щоб уникнути проблеми
        const fixedEndDate = new Date(endDate);
        fixedEndDate.setHours(23, 59, 59, 999); // Усуваємо проблему з часом у порівнянні
        while (currentDate <= fixedEndDate) {
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
            const day = currentDate.getDate().toString().padStart(2, "0");
            const key = groupBy === "day" ? `${year}-${month}-${day}` : `${year}-${month}`;
            result.push({
                year,
                month: Number(month),
                day: groupBy === "day" ? Number(day) : undefined,
                amount: statistics[key] || 0
            });
            // Лог для відстеження генерації дат
            // Перехід до наступного дня або місяця
            if (groupBy === "day") {
                currentDate.setDate(currentDate.getDate() + 1);
            }
            else {
                currentDate.setMonth(currentDate.getMonth() + 1);
                currentDate.setDate(1);
            }
        }
        return result;
    }
    // Helper to collect tasks from backlogs
    getTasksFromBacklogs(backlogs, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const allBacklogTasks = [];
            for (const backlog of backlogs) {
                const sprints = yield sprint_model_1.default.find({ backlogId: backlog._id });
                for (const sprint of sprints) {
                    const sprintTasks = yield task_model_1.default.find({
                        sprintId: sprint._id,
                        created: { $gte: startDate, $lte: endDate },
                    });
                    allBacklogTasks.push(...sprintTasks);
                }
                const directBacklogTasks = yield task_model_1.default.find({
                    backlogId: backlog._id,
                    sprintId: null,
                    created: { $gte: startDate, $lte: endDate },
                });
                allBacklogTasks.push(...directBacklogTasks);
            }
            return allBacklogTasks;
        });
    }
    // Helper to collect tasks from phases
    getTasksFromPhases(phases, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const phaseTasks = [];
            for (const phase of phases) {
                const tasks = yield task_model_1.default.find({
                    phaseId: phase._id,
                    created: { $gte: startDate, $lte: endDate },
                });
                phaseTasks.push(...tasks);
            }
            return phaseTasks;
        });
    }
    // Predict ratio for future months using linear regression
    predictRatio(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.taskRatio(projectId, new Date(2024, 0, 1), new Date(2025, 0, 1), false, userId);
            const months = tasks.map(entry => entry.month);
            const ratios = tasks.map(entry => entry.amount);
            const regression = new ml_regression_simple_linear_1.SimpleLinearRegression(months, ratios);
            const predictedRatios = [];
            for (let month = 0; month <= 11; month++) {
                const predictedRatio = regression.predict(month);
                predictedRatios.push({ year: 2025, month, amount: predictedRatio });
            }
            return predictedRatios;
        });
    }
    // Other methods remain unchanged...
    createdTaskAmount(projectId, startDate, endDate, isDaily, userId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.getFilteredTasks(projectId, startDate, endDate, userId);
            const stats = this.generateStatistics(tasks, startDate, endDate, isDaily, task => task.created);
            return this.accumulateAmounts(stats);
        });
    }
    averageTasksPerProjectAmount(userId, startDate, endDate, isDaily) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedUserId = new mongoose_1.default.Types.ObjectId(userId);
            // Отримуємо проєкти користувача
            const projects = yield project_model_1.default.find({ owner: convertedUserId });
            const tasks = [];
            // Отримуємо всі таски користувача в межах дат
            yield Promise.all(projects.map((project) => __awaiter(this, void 0, void 0, function* () {
                const projectTasks = yield this.getFilteredTasks(project._id.toString(), startDate, endDate);
                tasks.push(...projectTasks);
            })));
            // Отримуємо всі фази по всім проєктам користувача
            const projectIds = projects.map(p => p._id);
            const phases = yield phase_model_1.default.find({ projectId: { $in: projectIds } });
            return this.generateAverageTasksStatistic(tasks, projects, startDate, endDate, isDaily);
        });
    }
    generateAverageTasksStatistic(tasks, projects, startDate, endDate, isDaily) {
        // Фіксуємо появу кожного проєкту по created
        const projectAppearDates = {};
        projects.forEach(project => {
            projectAppearDates[project._id.toString()] = project.created;
        });
        const result = [];
        let currentDate = new Date(startDate);
        currentDate.setHours(0, 0, 0, 0);
        const fixedEndDate = new Date(endDate);
        fixedEndDate.setHours(23, 59, 59, 999);
        while (currentDate <= fixedEndDate) {
            const activeProjects = projects.filter(p => projectAppearDates[p._id.toString()] <= currentDate);
            const activeTasks = tasks.filter(task => {
                const taskDate = new Date(task.created);
                return taskDate <= currentDate;
            });
            const totalProjects = activeProjects.length;
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
            const day = currentDate.getDate().toString().padStart(2, "0");
            result.push({
                year,
                month: Number(month),
                day: isDaily ? Number(day) : undefined,
                amount: totalProjects > 0 ? activeTasks.length / totalProjects : 0
            });
            if (isDaily) {
                currentDate.setDate(currentDate.getDate() + 1);
            }
            else {
                currentDate.setMonth(currentDate.getMonth() + 1);
                currentDate.setDate(1);
            }
        }
        return result;
    }
    accumulateAmounts(stats) {
        let cumulativeAmount = 0;
        return stats.map(entry => {
            cumulativeAmount += entry.amount;
            return Object.assign(Object.assign({}, entry), { amount: cumulativeAmount });
        });
    }
    checkedTaskAmount(projectId, startDate, endDate, isDaily, userId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.getFilteredTasks(projectId, startDate, endDate, userId);
            const checkedTasks = tasks.filter(task => task.checkedDate);
            return this.generateStatistics(checkedTasks, startDate, endDate, isDaily, task => task.checkedDate);
        });
    }
    taskRatio(projectId, startDate, endDate, isDaily, userId = null, phaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.getFilteredTasks(projectId, startDate, endDate, userId, phaseId);
            // Generate statistics for task counts by month or day
            const stats = this.generateStatistics(tasks, startDate, endDate, isDaily, task => task.created);
            // Accumulate task status ratios (done vs total)
            return this.calculateCumulativeRatios(stats, tasks);
        });
    }
    calculateCumulativeRatios(stats, tasks) {
        let cumulativeDone = 0;
        let cumulativeTotal = 0;
        return stats.map(entry => {
            // Filter tasks created up to the current entry's month or day
            const tasksUntilNow = tasks.filter(task => {
                return this.isBeforeOrSame(task.created, new Date(entry.year, entry.month - 1, entry.day || 1));
            });
            console.log(new Date(entry.year, entry.month - 1, entry.day || 1));
            const doneTasks = tasksUntilNow.filter(task => (task.status === "done" && this.isBeforeOrSame(task.checkedDate, new Date(entry.year, entry.month - 1, entry.day || 1)))).length;
            cumulativeDone = doneTasks; // Update cumulative done count
            cumulativeTotal = tasksUntilNow.length; // Update total tasks count
            console.log("done: " + cumulativeDone);
            console.log("total: " + cumulativeTotal);
            // Calculate the ratio (percentage of done tasks)
            const ratio = cumulativeTotal > 0 ? (cumulativeDone / cumulativeTotal) * 100 : 0;
            console.log("ratio: " + ratio);
            return Object.assign(Object.assign({}, entry), { amount: ratio });
        });
    }
    isBeforeOrSame(date1, date2) {
        return (date1.getMonth() < date2.getMonth() ||
            (date1.getMonth() === date2.getMonth() && date1.getDate() <= date2.getDate()));
    }
    generateStatistics(tasks, startDate, endDate, isDaily, dateExtractor, options) {
        const statsMap = {};
        tasks.forEach(task => {
            const date = dateExtractor(task);
            const key = isDaily
                ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                : `${date.getFullYear()}-${date.getMonth() + 1}`;
            if (!statsMap[key]) {
                statsMap[key] = { done: 0, total: 0 };
            }
            statsMap[key].total++;
            if (task.status === 'done') {
                statsMap[key].done++;
            }
        });
        const range = this.generateDateRange(startDate, endDate, isDaily);
        return range.map(({ year, month, day }) => {
            const key = isDaily ? `${year}-${month}-${day}` : `${year}-${month}`;
            const { done, total } = statsMap[key] || { done: 0, total: 0 };
            const amount = (options === null || options === void 0 ? void 0 : options.ratio) && total > 0 ? Math.round((done / total) * 100) : total;
            return { year, month, day, amount };
        });
    }
    generateDateRange(startDate, endDate, isDaily) {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const day = isDaily ? currentDate.getDate() : undefined;
            dates.push({ year, month, day });
            currentDate.setDate(currentDate.getDate() + (isDaily ? 1 : 30));
        }
        return dates;
    }
};
//# sourceMappingURL=analytics-service.js.map