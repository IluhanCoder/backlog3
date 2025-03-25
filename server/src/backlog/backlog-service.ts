import mongoose from "mongoose";
import backlogModel from "./backlog-model";
import TaskModel from "../tasks/task-model";

export default new class BacklogService {
    async getProjectBacklogs(projectId: string) {
        const result = await backlogModel.find({projectId: new mongoose.Types.ObjectId(projectId)});
        return result;
    }

    async getBacklogById(backlogId: string) {
      const result = await backlogModel.findById(backlogId);
      return result;
    }

    async createBacklog (projectId: string, name: string) {
        await backlogModel.create({projectId: new mongoose.Types.ObjectId(projectId), name});
    }

    async getBacklogTasks(backlogId: string) {
        const result = await TaskModel.aggregate([
            // Step 1: Match tasks by the specified backlogId
            {
              $match: { backlogId: new mongoose.Types.ObjectId(backlogId) }
            },
            // Step 2: Lookup the executors' details from the User model
            {
              $lookup: {
                from: 'users', // Assuming 'users' is your User collection name
                localField: 'executors',
                foreignField: '_id',
                as: 'executors'
              }
            },
            // Step 3: Format the executors' details into UserResponse format
            {
              $project: {
                name: 1,
                desc: 1,
                backlogId: 1,
                projectId: 1,
                sprintId: 1,
                isChecked: 1,
                createdBy: 1,
                created: 1,
                checkedDate: 1,
                executors: {
                  $map: {
                    input: '$executors',
                    as: 'executor',
                    in: {
                      _id: '$$executor._id',
                      name: '$$executor.name',
                      surname: '$$executor.surname',
                      nickname: '$$executor.nickname',
                      email: '$$executor.email',
                      organisation: '$$executor.organisation',
                      avatar: '$$executor.avatar'
                    }
                  }
                },
                status: 1,
                difficulty: 1,
                priority: 1,
                requirements: 1
              }
            }
          ]);
        if(result.length > 0) return result;
        else return []
    }
}