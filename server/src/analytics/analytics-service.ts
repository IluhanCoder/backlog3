import mongoose from 'mongoose';
import TaskModel from "../tasks/task-model";
import taskService from "../tasks/task-service";
import backlogModel from '../backlog/backlog-model';
import Task, { TaskResponse } from '../tasks/task-types';
import { UserResponse } from '../user/user-type';
import { SimpleLinearRegression } from "ml-regression-simple-linear";
import sprintService from '../sprints/sprint-service';
import ProjectModel from '../projects/project-model';
import sprintModel from '../sprints/sprint-model';
import phaseModel from '../phase/phase-model';
import Project from '../projects/project-types';
import Phase from '../phase/phase-type';
  
  interface Statistic {
    day?: number;
    month: number;
    year: number;
    amount: number;
  }

  type GroupBy = "day" | "month";

interface ProjectStatistic {
  day?: number;
    month: number;
    year: number;
  amount: number;
}

export default new class AnalyticsService {
    // Helper to collect all tasks
    private async getFilteredTasks(
      projectId: string,
      startDate: Date,
      endDate: Date,
      userId: string | null = null,
      phaseId?: string
    ): Promise<Task[]> {
      const convertedProjectId = new mongoose.Types.ObjectId(projectId);
  
      const projectTasks: Task[] = await TaskModel.find({
        projectId: convertedProjectId,
        created: { $gte: startDate, $lte: endDate },
      });
      
      const backlogs = await backlogModel.find({ projectId: convertedProjectId });
      const backlogTasks: Task[] = await this.getTasksFromBacklogs(backlogs, startDate, endDate);
  
      const phases = await phaseModel.find({ projectId: convertedProjectId });
      const phaseTasks: Task[] = (phaseId) ? await TaskModel.find({phaseId: new mongoose.Types.ObjectId(phaseId)}) : await this.getTasksFromPhases(phases, startDate, endDate);

      let allTasks: Task[];
      if(phaseId === undefined) allTasks = [...projectTasks, ...backlogTasks, ...phaseTasks];
      else allTasks = [...phaseTasks];

      return userId
        ? allTasks.filter(task =>
            task.executors.some(executor =>
              executor.equals(new mongoose.Types.ObjectId(userId))
            )
          )
        : allTasks;
    }

    public async createdProjectAmount(
    userId: string,
    startDate: Date,
    endDate: Date,
    isDaily: boolean
): Promise<ProjectStatistic[]> {
    const projects: Project[] = await ProjectModel.find({
        owner: new mongoose.Types.ObjectId(userId),
        created: { $gte: startDate, $lte: endDate }
    });

    return this.generateProjectStatistic(projects, startDate, endDate, isDaily ? "day" : "month");
}

public async fullyCompletedProjectsAmount(
  userId: string,
  startDate: Date,
  endDate: Date,
  isDaily: boolean
): Promise<ProjectStatistic[]> {
  const projects: Project[] = await ProjectModel.find({
      owner: new mongoose.Types.ObjectId(userId),
      created: { $gte: startDate, $lte: endDate }
  });

  // Фільтрація проєктів, де всі таски "done"
  const filteredProjects = await Promise.all(projects.map(async (project: Project) => {
      const tasks = await this.getFilteredTasks(project._id.toString(), startDate, endDate);
      return tasks.length > 0 && tasks.every(task => task.status === "done") ? project : null;
  }));

  const completedProjects = filteredProjects.filter(p => p !== null) as Project[];

  return this.generateProjectStatistic(completedProjects, startDate, endDate, isDaily ? "day" : "month");
}

generateProjectStatistic(
  projects: Project[],
  startDate: Date,
  endDate: Date,
  groupBy: GroupBy = "day"
): ProjectStatistic[] {
  const statistics: Record<string, number> = {};

  projects.forEach((project) => {
      const date = new Date(project.created);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      const key = groupBy === "day" ? `${year}-${month}-${day}` : `${year}-${month}`;
      statistics[key] = (statistics[key] || 0) + 1;
  });

  // Генерація діапазону дат з нормалізацією часу
  const result: ProjectStatistic[] = [];
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
      } else {
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(1);
      }
  }

  return result;
}
  
    // Helper to collect tasks from backlogs
    private async getTasksFromBacklogs(
      backlogs: any[],
      startDate: Date,
      endDate: Date
    ): Promise<Task[]> {
      const allBacklogTasks: Task[] = [];
  
      for (const backlog of backlogs) {
        const sprints = await sprintModel.find({ backlogId: backlog._id });
  
        for (const sprint of sprints) {
          const sprintTasks: Task[] = await TaskModel.find({
            sprintId: sprint._id,
            created: { $gte: startDate, $lte: endDate },
          });
          allBacklogTasks.push(...sprintTasks);
        }
  
        const directBacklogTasks: Task[] = await TaskModel.find({
          backlogId: backlog._id,
          sprintId: null,
          created: { $gte: startDate, $lte: endDate },
        });
        allBacklogTasks.push(...directBacklogTasks);
      }
      return allBacklogTasks;
    }
  
    // Helper to collect tasks from phases
    private async getTasksFromPhases(
      phases: any[],
      startDate: Date,
      endDate: Date
    ): Promise<Task[]> {
      const phaseTasks: Task[] = [];
  
      for (const phase of phases) {
        const tasks: Task[] = await TaskModel.find({
          phaseId: phase._id,
          created: { $gte: startDate, $lte: endDate },
        });
        phaseTasks.push(...tasks);
      }
      return phaseTasks;
    }
  
    // Predict ratio for future months using linear regression
    public async predictRatio(projectId: string, userId: string | undefined) {
      const tasks: Statistic[] = await this.taskRatio(
        projectId,
        new Date(2025, 0, 1),
        new Date(2026, 1, 0),
        false,
        userId
      );
    
      console.log("Task Ratios:", tasks); // Перевіряємо, які дані надходять
    
      const months = tasks.map(entry => entry.month); // Очікує числа 1-12
      const ratios = tasks.map(entry => entry.amount);
    
      // Якщо всі значення нулі, не запускаємо регресію
      if (ratios.every(r => r === 0)) {
        console.warn("All ratios are zero. Regression may not work properly.");
        return months.map(month => ({ year: 2025, month, amount: 0 }));
      }
    
      const regression = new SimpleLinearRegression(months, ratios);
    
      const predictedRatios: Statistic[] = [];
      for (let month = 1; month <= 12; month++) {
        const predictedRatio = regression.predict(month);
        predictedRatios.push({ year: 2025, month, amount: predictedRatio });
      }
    
      console.log("Predicted Ratios:", predictedRatios);
      return predictedRatios;
    }
    
  
    // Other methods remain unchanged...
  
    public async createdTaskAmount(
        projectId: string,
        startDate: Date,
        endDate: Date,
        isDaily: boolean,
        userId: string | null = null
      ): Promise<Statistic[]> {
        const tasks: Task[] = await this.getFilteredTasks(projectId, startDate, endDate, userId);
        const stats = this.generateStatistics(tasks, startDate, endDate, isDaily, task => task.created);
      
        return this.accumulateAmounts(stats);
    }

    public async averageTasksPerProjectAmount(
      userId: string,
      startDate: Date,
      endDate: Date,
      isDaily: boolean
    ): Promise<ProjectStatistic[]> {
      const convertedUserId = new mongoose.Types.ObjectId(userId);
    
      // Отримуємо проєкти користувача
      const projects: Project[] = await ProjectModel.find({ owner: convertedUserId });
    
      const tasks: Task[] = [];
      // Отримуємо всі таски користувача в межах дат
      await Promise.all(projects.map(async (project) => {
        const projectTasks = await this.getFilteredTasks(
          project._id.toString(),
          startDate,
          endDate
        );
        tasks.push(...projectTasks);
      }));
    
      // Отримуємо всі фази по всім проєктам користувача
      const projectIds = projects.map(p => p._id);
      const phases: Phase[] = await phaseModel.find({ projectId: { $in: projectIds } });
    
      return this.generateAverageTasksStatistic(tasks, projects, startDate, endDate, isDaily);
    }
    
    
    
    
    private generateAverageTasksStatistic(
      tasks: Task[],
      projects: Project[],
      startDate: Date,
      endDate: Date,
      isDaily: boolean
    ): ProjectStatistic[] {
      // Фіксуємо появу кожного проєкту по created
      const projectAppearDates: Record<string, Date> = {};
    
      projects.forEach(project => {
        projectAppearDates[project._id.toString()] = project.created;
      });
    
      const result: ProjectStatistic[] = [];
    
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
        } else {
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(1);
        }
      }
    
      return result;
    }

    private accumulateAmounts(stats: Statistic[]): Statistic[] {
      let cumulativeAmount = 0;
  
      return stats.map((entry, index) => {
          if (index === 0) {
              cumulativeAmount = entry.amount; // Початкове значення
          } else {
              cumulativeAmount += entry.amount; // Накопичуємо
          }
          return { ...entry, amount: cumulativeAmount };
      });
  }
  
  
    public async checkedTaskAmount(
      projectId: string,
      startDate: Date,
      endDate: Date,
      isDaily: boolean,
      userId: string | null = null
    ): Promise<Statistic[]> {
      const tasks: Task[] = await this.getFilteredTasks(projectId, startDate, endDate, userId);
      const checkedTasks: Task[] = tasks.filter(task => task.checkedDate);
      return this.generateStatistics(checkedTasks, startDate, endDate, isDaily, task => task.checkedDate!);
    }
  
    public async taskRatio(
        projectId: string,
        startDate: Date,
        endDate: Date,
        isDaily: boolean,
        userId: string | null = null,
        phaseId?: string
      ): Promise<Statistic[]> {
        const tasks: Task[] = await this.getFilteredTasks(projectId, startDate, endDate, userId, phaseId);
        // Generate statistics for task counts by month or day
        const stats = this.generateStatistics(tasks, startDate, endDate, isDaily, task => task.created);

        // Accumulate task status ratios (done vs total)
        return this.calculateCumulativeRatios(stats, tasks);
      }
      
      private calculateCumulativeRatios(stats: Statistic[], tasks: Task[]): Statistic[] {
        return stats.map(entry => {
          const currentDate = new Date(entry.year, entry.month - 1, entry.day || 1);
      
          console.log("Processing date:", entry.year, entry.month, entry.day, "=>", currentDate.toISOString());
      
          // Фільтруємо задачі, створені ДО або НА поточний період
          const tasksUntilNow = tasks.filter(task => {
            const taskCreated = new Date(task.created);
            return taskCreated.getFullYear() < currentDate.getFullYear() ||
              (taskCreated.getFullYear() === currentDate.getFullYear() && taskCreated.getMonth() <= currentDate.getMonth());
          });
      
          if (tasksUntilNow.length === 0) {
            console.log(`No tasks before ${currentDate.toISOString()}, ratio = 0`);
            return { ...entry, amount: 0 };
          }
      
          // Фільтруємо виконані задачі
          const doneTasks = tasksUntilNow.filter(task => {
            if (!task.checkedDate) return false;
            const taskChecked = new Date(task.checkedDate);
            return taskChecked <= currentDate;
          }).length;
      
          const ratio = (doneTasks / tasksUntilNow.length) * 100;
      
          console.log(`Tasks until ${currentDate.toISOString()}: Total = ${tasksUntilNow.length}, Done = ${doneTasks}, Ratio = ${ratio}`);
      
          return { ...entry, amount: ratio };
        });
      }
      
      
      
      private isBeforeOrSame(date1: Date, date2: Date): boolean {
        return (
          date1.getMonth() < date2.getMonth() ||
          (date1.getMonth() === date2.getMonth() && date1.getDate() <= date2.getDate())
        );
      }
      
  
      private generateStatistics(
        tasks: Task[],
        startDate: Date,
        endDate: Date,
        isDaily: boolean,
        dateExtractor: (task: Task) => Date
      ): Statistic[] {
        const statsMap: { [key: string]: { amount: number } } = {};
      
        // Генеруємо список дат у заданому діапазоні
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const key = isDaily
            ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`
            : `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}`;
      
          statsMap[key] = { amount: 0 };
      
          // Оновлюємо дату
          if (isDaily) {
            currentDate.setDate(currentDate.getDate() + 1);
          } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
        }
      
        // Додаємо таски в правильні групи
        tasks.forEach(task => {
          const date = dateExtractor(task);
          const key = isDaily
            ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
            : `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      
          if (!statsMap[key]) return; // Пропускаємо значення поза діапазоном
      
          statsMap[key].amount++;
        });
      
        return Object.entries(statsMap).map(([key, value]) => {
          const [year, month, day] = key.split("-").map(Number);
          return {
            year,
            month,
            ...(isDaily && { day }), // Додаємо day лише якщо isDaily = true
            amount: value.amount
          };
        });
      }
      
      
  
    private generateDateRange(
      startDate: Date,
      endDate: Date,
      isDaily: boolean
    ): { year: number; month: number; day?: number }[] {
      const dates: { year: number; month: number; day?: number }[] = [];
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
  }