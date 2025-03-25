import mongoose from "mongoose";
import ProjectModel from "./project-model";
import Project, { ExtendedProjectResponse, Parameters, Participant, ParticipantResponse, ProjectCredentials, Rights } from "./project-types";
import inviteService from "../invites/invite-service";
import backlogModel from "../backlog/backlog-model";
import requirementService from "../requirements/requirement-service";
import UserModel from "../user/user-model";
import TaskModel from "../tasks/task-model";
import Task from "../tasks/task-types";
import sprintModel from "../sprints/sprint-model";
import Sprint from "../sprints/sprint-types";
import Backlog from "../backlog/backlog-types";
import Phase from "../phase/phase-type";
import phaseModel from "../phase/phase-model";
import { differenceInBusinessDays } from "date-fns";
import { RequirementTemp } from "../requirements/requirement-types";
import backlogService from "../backlog/backlog-service";

//todo: add project dates, and sprint dates validation

// const fullLookUp = [
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'owner',
//       foreignField: '_id',
//       as: 'ownerInfo'
//     }
//   },
//   {
//     $unwind: {
//       path: '$participants',
//       preserveNullAndEmptyArrays: true
//     }
//   },
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'participants.participant',
//       foreignField: '_id',
//       as: 'participantsInfo'
//     }
//   },
//   {
//     $group: {
//       _id: '$_id',
//       name: { $first: '$name' },
//       created: { $first: '$created' },
//       type: { $first: '$type' },
//       lastModified: { $first: '$lastModified' },
//       owner: { $first: '$ownerInfo' },
//       participants: {
//         $push: {
//           participant: { $arrayElemAt: ['$participantsInfo', 0] },
//           rights: '$participants.rights'
//         }
//       },
//       tasks: { $first: '$tasks' }
//     }
//   },
//   {
//     $lookup: {
//       from: 'tasks',
//       localField: '_id',
//       foreignField: 'projectId',
//       as: 'tasks'
//     }
//   },
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'tasks.executors',
//       foreignField: '_id',
//       as: 'executorsInfo'
//     }
//   },
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'tasks.createdBy',
//       foreignField: '_id',
//       as: 'creatorsInfo'
//     }
//   },
//   {
//     $project: {
//       _id: 1,
//       name: 1,
//       created: 1,
//       lastModified: 1,
//       owner: { $arrayElemAt: ['$owner', 0] },
//       participants: 1,
//       type: 1,
//       tasks: {
//         $map: {
//           input: '$tasks',
//           as: 'task',
//           in: {
//             _id: '$$task._id',
//             name: '$$task.name',
//             desc: '$$task.desc',
//             projectId: '$$task.projectId',
//             isChecked: '$$task.isChecked',
//             createdBy: {
//               $arrayElemAt: [
//                 {
//                   $filter: {
//                     input: '$creatorsInfo',
//                     as: 'creator',
//                     cond: {
//                       $eq: ['$$creator._id', '$$task.createdBy']
//                     }
//                   }
//                 },
//                 0
//               ]
//             },
//             created: '$$task.created',
//             checkedDate: '$$task.checkedDate',
//             executors: {
//               $map: {
//                 input: '$executorsInfo',
//                 as: 'executor',
//                 in: {
//                   _id: '$$executor._id',
//                   name: '$$executor.name',
//                   surname: '$$executor.surname',
//                   nickname: '$$executor.nickname',
//                   organisation: '$$executor.organisation',
//                   email: '$$executor.email'
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// ]

const fullLookUp = [
  // Step 1: Lookup owner details from the User collection
  {
    $lookup: {
      from: 'users', // Assuming 'users' is your User collection name
      localField: 'owner',
      foreignField: '_id',
      as: 'owner'
    }
  },
  {
    $unwind: '$owner' // Unwind the owner array as each project has one owner
  },
  // Step 2: Lookup the participants' details from the User collection
  {
    $lookup: {
      from: 'users',
      localField: 'participants.participant',
      foreignField: '_id',
      as: 'participantDetails'
    }
  },
  // Step 3: Combine the participants with their rights into ParticipantResponse
  {
    $project: {
      name: 1,
      created: 1,
      lastModified: 1,
      daysPerWeek: 1,
      hoursPerDay: 1,
      startDate: 1,
      endDate: 1,
      owner: {
        _id: '$owner._id',
        name: '$owner.name',
        surname: '$owner.surname',
        nickname: '$owner.nickname',
        email: '$owner.email',
        organisation: '$owner.organisation',
        avatar: '$owner.avatar'
      },
      participants: {
        $map: {
          input: '$participants',
          as: 'participant',
          in: {
            participant: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$participantDetails',
                    as: 'details',
                    cond: { $eq: ['$$details._id', '$$participant.participant'] }
                  }
                },
                0
              ]
            },
            rights: '$$participant.rights',
            salary: '$$participant.salary'
          }
        }
      },
      type: 1
    }
  },
  // Step 4: Lookup tasks related to the project using projectId
  {
    $lookup: {
      from: 'tasks', // Assuming 'tasks' is your Task collection name
      localField: '_id',
      foreignField: 'projectId',
      as: 'tasks'
    }
  },
  // Step 5: Format tasks to match TaskResponse
  {
    $project: {
      _id: 1,
      name: 1,
      created: 1,
      lastModified: 1,
      owner: 1,
      participants: 1,
      type: 1,
      daysPerWeek: 1,
      hoursPerDay: 1,
      startDate: 1,
      endDate: 1,
      tasks: {
        $map: {
          input: '$tasks',
          as: 'task',
          in: {
            _id: '$$task._id',
            name: '$$task.name',
            desc: '$$task.desc',
            backlogId: '$$task.backlogId',
            projectId: '$$task.projectId',
            sprintId: '$$task.sprintId',
            isChecked: '$$task.isChecked',
            createdBy: '$$task.createdBy',
            created: '$$task.created',
            checkedDate: '$$task.checkedDate',
            executors: '$$task.executors',
            status: '$$task.status',
            difficulty: '$$task.difficulty',
            priority: '$$task.priority',
            requirements: '$$task.requirements'
          }
        }
      }
    }
  },
  // Step 6: Lookup executors for tasks
  {
    $lookup: {
      from: 'users',
      localField: 'tasks.executors',
      foreignField: '_id',
      as: 'executorDetails'
    }
  },
  {
    $project: {
      name: 1,
      created: 1,
      lastModified: 1,
      owner: 1,
      participants: 1,
      type: 1,
      daysPerWeek: 1,
      hoursPerDay: 1,
      startDate: 1,
      endDate: 1,
      tasks: {
        $map: {
          input: '$tasks',
          as: 'task',
          in: {
            _id: '$$task._id',
            name: '$$task.name',
            desc: '$$task.desc',
            backlogId: '$$task.backlogId',
            projectId: '$$task.projectId',
            sprintId: '$$task.sprintId',
            isChecked: '$$task.isChecked',
            createdBy: '$$task.createdBy',
            created: '$$task.created',
            checkedDate: '$$task.checkedDate',
            executors: {
              $map: {
                input: '$executorDetails',
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
            status: '$$task.status',
            difficulty: '$$task.difficulty',
            priority: '$$task.priority',
            requirements: '$$task.requirements'
          }
        }
      }
    }
  }
]

export default new class ProjectService {
      determineProjectType(parameters: Parameters): "scrum" | "waterfall" | "kanban" {
        const { integration, support, fixation } = parameters;

        if (integration && support && !fixation) {
            return "scrum"; // High customer integration and adaptability to changes
        } else if (!integration && !support && fixation) {
            return "waterfall"; // Fixed tasks with minimal flexibility and low customer involvement
        } else if (!fixation && support) {
            return "kanban"; // Flexibility without fixed task structure
        } else {
            // Default type or additional logic if needed
            return "kanban"; // Default choice if no clear match
        }
    }

    async createProject(credentials: ProjectCredentials) {
        try {
            const currentDate = new Date();
            const newProject: Project = {
                ...credentials,
                owner: new mongoose.Types.ObjectId(credentials.owner),
                created: currentDate,
                lastModified: currentDate,
                participants: []
            }
            if(credentials.type === "auto") {
              newProject.type = this.determineProjectType(credentials.parameters);
            }
            const result = await ProjectModel.create(newProject);
            const newRequirements: RequirementTemp[] = credentials.requirements.map((requirement: RequirementTemp) => {return {...requirement, projectId: result._id}})
            await requirementService.newRequirements(newRequirements);
            if(newProject.type === "scrum") {
              credentials.requirements.map((requirement: RequirementTemp) => {
                backlogService.createBacklog(result._id.toString(), requirement.title);
              })
            }
             return result;
        } catch (error) {
            throw error;
        }
    }

    async getProjectById(projectId: string) {
        try {
            const result: ExtendedProjectResponse = (await ProjectModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(projectId)
                    }
                },
                ...fullLookUp
              ]))[0]
            result.invited = await inviteService.getInvited(projectId);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getUserProjects(userId: string) {
      try {
        const result = await ProjectModel.aggregate([
          {
            $match: {
              $or: [
                { owner: new mongoose.Types.ObjectId(userId) },
                { 'participants.participant': new mongoose.Types.ObjectId(userId) },
              ],
            },
          },
          ...fullLookUp
        ])
        return result;
      } catch (error) {
        throw error;
      }
    }

    async deleteParitcipant(projectId: string, userId: string) {
      try {
        await ProjectModel.findByIdAndUpdate(projectId, {$pull: {participants: {participant: new mongoose.Types.ObjectId(userId)}}});
      } catch (error) {
        throw error;
      }
    }

    async getParicipants(projectId: string) {
      try {
        const result = await ProjectModel.aggregate([
          {
            $match: {
                _id: new mongoose.Types.ObjectId(projectId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "participants.participant",
                foreignField: "_id",
                as: "participantData"
            }
        },
        {
            $project: {
                _id: 0, // Exclude the _id field if not needed
                participants: {
                    $map: {
                        input: "$participants",
                        as: "participant",
                        in: {
                            participant: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$participantData",
                                            as: "user",
                                            cond: {
                                                $eq: ["$$user._id", "$$participant.participant"]
                                            }
                                        }
                                    },
                                    0
                                ]
                            },
                            right: "$$participant.rights",
                            salary: "$$participant.salary"
                        }
                    }
                }
            }
        },
        {
            $unwind: "$participants"
        },
        {
            $replaceRoot: { newRoot: "$participants" }
        }
        ]);
        return result;
      } catch (error) {
        throw error;
      }
    }

    async getUserRights (userId: string, projectId: string) {
      try {
        const project: Project = await ProjectModel.findById(projectId);
        const userParticipating = project.participants.find((participant: any) => (new mongoose.Types.ObjectId(userId)).equals(participant.participant));
        if(project.owner.toString() === userId.toString()) return {
          create: true,
          edit: true,
          delete: true,
          check: true,
          editParticipants: true,
          addParticipants: true,
          editProjectData: true
        } as Rights
        if (userParticipating) return userParticipating.rights;
        else return null;
      } catch (error) {
        throw error;
      }
    }

    async getRights (projectId: string) {
      try {
        const rights = await ProjectModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(projectId) // Replace "your_project_id" with the actual project ID
            }
          },
          {
            $unwind: "$participants"
          },
          {
            $lookup: {
              from: "users",
              localField: "participants.participant",
              foreignField: "_id",
              as: "participants.user"
            }
          },
          {
            $unwind: "$participants.user"
          },
          {
            $project: {
              _id: 0,
              participant: "$participants.user",
              rights: "$participants.rights"
            }
          }
        ]);
        return rights;
      } catch (error) {
        throw error;
      }
    }

    async setRights (projectId: string, newParticipants: Participant[]) {
      try {
        const convertedNewParticipants = newParticipants.map((participant: Participant) => { return {participant: new mongoose.Types.ObjectId(participant.participant), rights: participant.rights}});
        await ProjectModel.findByIdAndUpdate(projectId, {participants: convertedNewParticipants});
      } catch (error) {
        throw error;
      }
    }

    //todo: check change owner

    async changeOwner (projectId: string, newOwnerId: string) {
      try {
        const project: Project = await ProjectModel.findById(projectId);

        const convertedNewOwnerId = new mongoose.Types.ObjectId(newOwnerId);
        const convertedOldOwnerId = project.owner;

        const newOwner: Participant = project.participants.find((participant) => participant.participant.equals(convertedNewOwnerId));

        await ProjectModel.findByIdAndUpdate(projectId, { owner: convertedNewOwnerId, $pull: { participants: newOwner } } );

        const newParticipant: Participant = { participant: convertedOldOwnerId, salary: 0, rights: {
          create: true,
          edit: true,
          delete: true,
          check: true,
          editParticipants: true,
          addParticipants: true,
          editProjectData: true
        }}

        await ProjectModel.findByIdAndUpdate(projectId, { $push: {participants: newParticipant}});
      } catch (error) {
        throw error;
      }
    }

    async getOwnerId (projectId) {
      try {
        return (await ProjectModel.findById(projectId)).owner;
      } catch (error) {
        throw error;
      }
    }

    async deleteProject (projectId) {
      try {
        await backlogModel.deleteMany({projectId: new mongoose.Types.ObjectId(projectId)});
        await requirementService.deleteProjectRequirements(projectId);
        await ProjectModel.findByIdAndDelete(projectId);
      } catch (error) {
        throw error;
      }
    } 

    async getTypeByProjectId(projectId: string) {
      const project = await this.getProjectById(projectId);
      return project.type;
    }

    async calculatePrice(projectId: string): Promise<number> {
      const convertedProjectId = new mongoose.Types.ObjectId(projectId);
    
      // Fetch the project along with participants and new fields
      const project = await ProjectModel.findById(projectId).lean() as Project;
      const { participants, daysPerWeek, hoursPerDay, startDate: projectStartDate, endDate: projectEndDate } = project;
    
      // Helper function to fetch all project tasks
      const getAllProjectTasks = async (): Promise<Task[]> => {
        const generalTasks: Task[] = await TaskModel.find({ projectId: convertedProjectId });
        const backlogs: Backlog[] = await backlogModel.find({ projectId: convertedProjectId });
    
        const sprintTasks: Task[] = [];
        const phaseTasks: Task[] = [];
    
        // Gather tasks for sprints linked to backlogs
        for (const backlog of backlogs) {
          const sprints: Sprint[] = await sprintModel.find({ backlogId: backlog._id });
    
          for (const sprint of sprints) {
            const tasksForSprint: Task[] = await TaskModel.find({ sprintId: sprint._id });
            sprintTasks.push(...tasksForSprint);
          }
        }
    
        // Gather tasks associated with project phases
        const phases: Phase[] = await phaseModel.find({ projectId: convertedProjectId });
        for (const phase of phases) {
          const tasksForPhase: Task[] = await TaskModel.find({ phaseId: phase._id });
          phaseTasks.push(...tasksForPhase);
        }
    
        return [...generalTasks, ...sprintTasks, ...phaseTasks];
      };
    
      // Calculate working hours between two dates using project settings
      const calculateWorkingHours = (startDate: Date, endDate: Date): number => {
        const totalDays = differenceInBusinessDays(endDate, startDate);
        const fullWeeks = Math.floor(totalDays / daysPerWeek);
        const remainingDays = totalDays % daysPerWeek;
    
        return (fullWeeks * daysPerWeek + remainingDays) * hoursPerDay;
      };
    
      // Helper function to determine the applicable date range for a task
      const getTaskDateRange = async (task: Task): Promise<{ start: Date; end: Date }> => {
        if (task.sprintId) {
          const sprint = await sprintModel.findById(task.sprintId);
          if (sprint) return { start: sprint.startDate, end: sprint.endDate };
        } else if (task.backlogId) {
          return { start: projectStartDate, end: projectEndDate };
        }
        // Default to project dates if no specific sprint or backlog applies
        return { start: projectStartDate, end: projectEndDate };
      };
    
      // Helper function to calculate the cost of a task
      const getTaskPrice = async (task: Task): Promise<number> => {
        let taskSum = 0;
    
        for (const executorId of task.executors) {
          const participant: Participant | undefined = participants.find(
            (p) => p.participant.equals(executorId)
          );
    
          if (participant?.salary) {
            const { start, end } = await getTaskDateRange(task);
            const workingHours = calculateWorkingHours(start, end);
            taskSum += participant.salary * workingHours;
          }
        }
    
        return taskSum;
      };
    
      const tasks = await getAllProjectTasks();
      let totalSum = 0;
    
      // Accumulate the total cost for all tasks
      for (const task of tasks) {
        totalSum += await getTaskPrice(task);
      }
    
      return totalSum;
    }

    async editProject(projectId: string, newProject: ProjectCredentials) {
      await ProjectModel.findByIdAndUpdate(projectId, newProject);
    }
}