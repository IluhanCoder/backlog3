import { RequirementTemp } from "../requirements/requirement-types"
import { TaskResponse } from "../task/task-types"
import User, { UserResponse } from "../user/user-types"

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
    participant: string,
    rights: Rights,
    salary?: number
}

export interface ParticipantResponse {
    participant: UserResponse,
    rights: Rights,
    salary: number
}

export interface ProjectCredentials {
    name: string,
    requirements: RequirementTemp[] | undefined,
    parameters: Parameters,
    type: string,
    startDate: Date,
    endDate: Date,
    hoursPerDay: number,
    daysPerWeek: number
}

export interface EditProjectCredentials {
    name: string,
    daysPerWeek: number,
    hoursPerDay: number,
    startDate: Date,
    endDate: Date,
}

export interface Parameters {
    integration: boolean,
    support: boolean,
    fixation: boolean
}

export interface ProjectResponse {
    _id: string,
    name: string,
    created: Date,
    lastModified: Date,
    owner: UserResponse,
    tasks: TaskResponse[],
    participants: ParticipantResponse[],
    parameters: Parameters,
    startDate: Date,
    endDate: Date,
    type: string
}

export interface ExtendedProjectResponse extends ProjectResponse {
    invited: UserResponse[]
}

interface Project {
    _id: string,
    name: string,
    created: Date,
    lastModified: Date,
    owner: string,
    participants: Participant[],
    parameters: Parameters,
    startDate: Date,
    endDate: Date,
    type: string
}

export const typeOptions = ["kanban", "scrum", "waterfall"];

export default Project;