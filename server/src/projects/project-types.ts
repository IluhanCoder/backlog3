import mongoose from "mongoose";
import User, { UserResponse } from "../user/user-type";
import TaskResponse from "../tasks/task-types";
import { RequirementTemp } from "../requirements/requirement-types";

export interface Rights {
    create: boolean,
    edit: boolean,
    delete: boolean,
    check: boolean,
    editParticipants: boolean,
    addParticipants: boolean,
    editProjectData: boolean
}

export interface Participant {
    participant: mongoose.Types.ObjectId,
    rights: Rights,
    salary: number
}

export interface ParticipantResponse {
    participant: UserResponse,
    right: Rights,
    salary: number
}

export interface ProjectCredentials {
    name: string,
    owner: string,
    parameters: Parameters,
    daysPerWeek: number,
    hoursPerDay: number,
    startDate: Date,
    endDate: Date,
    type: string,
    requirements: RequirementTemp[]
}

export interface ProjectResponse {
    name: string,
    created: Date,
    lastModified: Date,
    owner: UserResponse,
    tasks: TaskResponse[],
    participants: ParticipantResponse[],
    daysPerWeek: number,
    hoursPerDay: number,
    startDate: Date,
    endDate: Date,
    type: string
}

export interface ExtendedProjectResponse extends ProjectResponse {
    invited?: UserResponse[]
}

export interface Parameters {
    integration: boolean,
    support: boolean,
    fixation: boolean
}

interface Project {
    _id?: mongoose.Types.ObjectId,
    name: string,
    created: Date,
    lastModified: Date,
    owner: mongoose.Types.ObjectId,
    participants: Participant[],
    parameters: Parameters,
    daysPerWeek: number,
    hoursPerDay: number,
    startDate: Date,
    endDate: Date,
    type: String
}

export default Project;