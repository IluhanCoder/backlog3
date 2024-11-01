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
const project_model_1 = __importDefault(require("./project-model"));
const invite_service_1 = __importDefault(require("../invites/invite-service"));
const backlog_model_1 = __importDefault(require("../backlog/backlog-model"));
const requirement_service_1 = __importDefault(require("../requirements/requirement-service"));
const task_model_1 = __importDefault(require("../tasks/task-model"));
const sprint_model_1 = __importDefault(require("../sprints/sprint-model"));
const phase_model_1 = __importDefault(require("../phase/phase-model"));
const date_fns_1 = require("date-fns");
const backlog_service_1 = __importDefault(require("../backlog/backlog-service"));
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
];
exports.default = new class ProjectService {
    determineProjectType(parameters) {
        const { integration, support, fixation } = parameters;
        if (integration && support && !fixation) {
            return "scrum"; // High customer integration and adaptability to changes
        }
        else if (!integration && !support && fixation) {
            return "waterfall"; // Fixed tasks with minimal flexibility and low customer involvement
        }
        else if (!fixation && support) {
            return "kanban"; // Flexibility without fixed task structure
        }
        else {
            // Default type or additional logic if needed
            return "kanban"; // Default choice if no clear match
        }
    }
    createProject(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentDate = new Date();
                const newProject = Object.assign(Object.assign({}, credentials), { owner: new mongoose_1.default.Types.ObjectId(credentials.owner), created: currentDate, lastModified: currentDate, participants: [] });
                if (credentials.type === "auto") {
                    newProject.type = this.determineProjectType(credentials.parameters);
                }
                const result = yield project_model_1.default.create(newProject);
                const newRequirements = credentials.requirements.map((requirement) => { return Object.assign(Object.assign({}, requirement), { projectId: result._id }); });
                yield requirement_service_1.default.newRequirements(newRequirements);
                if (newProject.type === "scrum") {
                    credentials.requirements.map((requirement) => {
                        backlog_service_1.default.createBacklog(result._id.toString(), requirement.title);
                    });
                }
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getProjectById(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = (yield project_model_1.default.aggregate([
                    {
                        $match: {
                            _id: new mongoose_1.default.Types.ObjectId(projectId)
                        }
                    },
                    ...fullLookUp
                ]))[0];
                result.invited = yield invite_service_1.default.getInvited(projectId);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserProjects(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield project_model_1.default.aggregate([
                    {
                        $match: {
                            $or: [
                                { owner: new mongoose_1.default.Types.ObjectId(userId) },
                                { 'participants.participant': new mongoose_1.default.Types.ObjectId(userId) },
                            ],
                        },
                    },
                    ...fullLookUp
                ]);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteParitcipant(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield project_model_1.default.findByIdAndUpdate(projectId, { $pull: { participants: { participant: new mongoose_1.default.Types.ObjectId(userId) } } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getParicipants(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield project_model_1.default.aggregate([
                    {
                        $match: {
                            _id: new mongoose_1.default.Types.ObjectId(projectId)
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
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserRights(userId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield project_model_1.default.findById(projectId);
                const userParticipating = project.participants.find((participant) => (new mongoose_1.default.Types.ObjectId(userId)).equals(participant.participant));
                if (userParticipating)
                    return userParticipating.rights;
                else
                    return null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRights(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rights = yield project_model_1.default.aggregate([
                    {
                        $match: {
                            _id: new mongoose_1.default.Types.ObjectId(projectId) // Replace "your_project_id" with the actual project ID
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
            }
            catch (error) {
                throw error;
            }
        });
    }
    setRights(projectId, newParticipants) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const convertedNewParticipants = newParticipants.map((participant) => { return { participant: new mongoose_1.default.Types.ObjectId(participant.participant), rights: participant.rights }; });
                yield project_model_1.default.findByIdAndUpdate(projectId, { participants: convertedNewParticipants });
            }
            catch (error) {
                throw error;
            }
        });
    }
    //todo: check change owner
    changeOwner(projectId, newOwnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield project_model_1.default.findById(projectId);
                const convertedNewOwnerId = new mongoose_1.default.Types.ObjectId(newOwnerId);
                const convertedOldOwnerId = project.owner;
                const newOwner = project.participants.find((participant) => participant.participant.equals(convertedNewOwnerId));
                yield project_model_1.default.findByIdAndUpdate(projectId, { owner: convertedNewOwnerId, $pull: { participants: newOwner } });
                const newParticipant = { participant: convertedOldOwnerId, salary: 0, rights: {
                        create: true,
                        edit: true,
                        delete: true,
                        check: true,
                        editParticipants: true,
                        addParticipants: true,
                        editProjectData: true
                    } };
                yield project_model_1.default.findByIdAndUpdate(projectId, { $push: { participants: newParticipant } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOwnerId(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield project_model_1.default.findById(projectId)).owner;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield backlog_model_1.default.deleteMany({ projectId: new mongoose_1.default.Types.ObjectId(projectId) });
                yield requirement_service_1.default.deleteProjectRequirements(projectId);
                yield project_model_1.default.findByIdAndDelete(projectId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTypeByProjectId(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.getProjectById(projectId);
            return project.type;
        });
    }
    calculatePrice(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedProjectId = new mongoose_1.default.Types.ObjectId(projectId);
            // Fetch the project along with participants and new fields
            const project = yield project_model_1.default.findById(projectId).lean();
            const { participants, daysPerWeek, hoursPerDay, startDate: projectStartDate, endDate: projectEndDate } = project;
            // Helper function to fetch all project tasks
            const getAllProjectTasks = () => __awaiter(this, void 0, void 0, function* () {
                const generalTasks = yield task_model_1.default.find({ projectId: convertedProjectId });
                const backlogs = yield backlog_model_1.default.find({ projectId: convertedProjectId });
                const sprintTasks = [];
                const phaseTasks = [];
                // Gather tasks for sprints linked to backlogs
                for (const backlog of backlogs) {
                    const sprints = yield sprint_model_1.default.find({ backlogId: backlog._id });
                    for (const sprint of sprints) {
                        const tasksForSprint = yield task_model_1.default.find({ sprintId: sprint._id });
                        sprintTasks.push(...tasksForSprint);
                    }
                }
                // Gather tasks associated with project phases
                const phases = yield phase_model_1.default.find({ projectId: convertedProjectId });
                for (const phase of phases) {
                    const tasksForPhase = yield task_model_1.default.find({ phaseId: phase._id });
                    phaseTasks.push(...tasksForPhase);
                }
                return [...generalTasks, ...sprintTasks, ...phaseTasks];
            });
            // Calculate working hours between two dates using project settings
            const calculateWorkingHours = (startDate, endDate) => {
                const totalDays = (0, date_fns_1.differenceInBusinessDays)(endDate, startDate);
                const fullWeeks = Math.floor(totalDays / daysPerWeek);
                const remainingDays = totalDays % daysPerWeek;
                return (fullWeeks * daysPerWeek + remainingDays) * hoursPerDay;
            };
            // Helper function to determine the applicable date range for a task
            const getTaskDateRange = (task) => __awaiter(this, void 0, void 0, function* () {
                if (task.sprintId) {
                    const sprint = yield sprint_model_1.default.findById(task.sprintId);
                    if (sprint)
                        return { start: sprint.startDate, end: sprint.endDate };
                }
                else if (task.backlogId) {
                    return { start: projectStartDate, end: projectEndDate };
                }
                // Default to project dates if no specific sprint or backlog applies
                return { start: projectStartDate, end: projectEndDate };
            });
            // Helper function to calculate the cost of a task
            const getTaskPrice = (task) => __awaiter(this, void 0, void 0, function* () {
                let taskSum = 0;
                for (const executorId of task.executors) {
                    const participant = participants.find((p) => p.participant.equals(executorId));
                    if (participant === null || participant === void 0 ? void 0 : participant.salary) {
                        const { start, end } = yield getTaskDateRange(task);
                        const workingHours = calculateWorkingHours(start, end);
                        taskSum += participant.salary * workingHours;
                    }
                }
                return taskSum;
            });
            const tasks = yield getAllProjectTasks();
            let totalSum = 0;
            // Accumulate the total cost for all tasks
            for (const task of tasks) {
                totalSum += yield getTaskPrice(task);
            }
            return totalSum;
        });
    }
    editProject(projectId, newProject) {
        return __awaiter(this, void 0, void 0, function* () {
            yield project_model_1.default.findByIdAndUpdate(projectId, newProject);
        });
    }
};
//# sourceMappingURL=project-service.js.map