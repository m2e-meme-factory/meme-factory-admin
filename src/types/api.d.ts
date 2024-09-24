import { UserInterface, UserRole } from '@/pages/users/data/schema.ts'
import {
  ProjectInterface,
  ProjectStatus,
} from '@/pages/projects/data/schema.ts'
import { TransactionInterface } from '@/pages/transactions/data/schema.ts'
import { ProjectProgressInterface } from '@/pages/project-progresses/data/schema.ts'
import { AutotaskInterface } from '@/pages/autotasks/data/schema.ts'

export type AxiosRequestConfig<Params = undefined> = Params extends undefined
  ? { config?: import('axios').AxiosRequestConfig }
  : { params: Params; config?: import('axios').AxiosRequestConfig }

export type SortingDirection = 'asc' | 'desc'

// [POST] auth/login/access-token
export interface RefreshAccessTokenDto {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

// [POST] auth/login
export interface SignInDto {
  email: string
  password: string
}

export interface SignInResponse {
  userAdmin: UserAdmin
  accessToken: string
  refreshToken: string
}

interface UserAdmin {
  id: number
  email: string
  isAdmin: boolean
}

// [POST] /users
export interface CreateUserDto {
  telegramId: string
  username: string
  isBaned: boolean
  isVerified: boolean
  refCode: string
  role: string
  balance: number
}

// Searching params for [GET] /some-entity requests
export interface PaginationSettings {
  page?: number
  limit?: number
}

export interface SearchParams extends PaginationSettings {
  sortBy?: string[]
  sortOrder?: SortingDirection[]
}

// [GET] /users

export interface UsersSearchParams extends SearchParams {
  search?: string
  isBanned?: boolean
  isVerified?: boolean
  refCode?: string
  role?: UserRole
}

export interface GetUsersResponse {
  data: UserInterface[]
  total: number
}

// [GET] /users/{id}
export interface GetUserParams {
  id: number
}

// [PATCH] /users/{id}
export interface PatchUserParams {
  id: number
  patchUserDto: PatchUserDto
}

export interface PatchUserDto {
  telegramId?: string
  username?: string
  isBaned?: boolean
  isVerified?: string
  refCode?: string
  role?: string
  balance?: number
}

// [PUT] /users/{id}/ban(unban)
export interface UserIdParam {
  id: number
}

// [PUT] /users/{id}/role
export interface ChangeRoleParams {
  id: number
  role: string
}

// [GET] /transactions
export interface GetTransactionsParams extends SearchParams {
  projectId?: number
  taskId?: number
  fromUserId?: number
  toUserId?: number
  type?: string
}

export interface GetTransactionsResponse {
  total: number
  transactions: TransactionInterface[]
}

// [POST] /transactions
export interface CreateTransactionDto {
  projectId?: number
  taskId?: number
  fromUserId?: number
  toUserId: number
  amount: number
}

// [GET] /transactions/{id}
export interface GetTransactionParam {
  id: number
}

// [PATCH] /transactions/{id}
export interface PatchTransactionParams {
  id: number
  patchTransactionDto: PatchTransactionDto
}

export interface PatchTransactionDto {
  projectId?: number
  taskId?: number
  fromUserId?: number
  toUserId?: number
  amount?: number
}

// [DELETE] /transactions/{id}
export interface DeleteTransactionParam {
  id: number
}

// [POST] /progress-projects
export interface CreateProjectProgressDto {
  userId: number
  projectId: number
}

// [GET] /progress-projects
export interface ProjectProgressSearchParams extends SearchParams {
  userId?: number
  projectId?: number
  status?: 'pending' | 'accepted' | 'rejected'
}

export interface GetProjectProgressesResponse {
  total: number
  progressProjects: ProjectProgressInterface[]
}

// [GET] /progress-projects/{id}
export interface GetProjectProgressParam {
  id: number
}

// [PATCH] /progress-projects/{id}
export interface PatchProjectProgressDto {
  userId?: number
  projectId?: number
  status?: 'pending' | 'accepted' | 'rejected'
}

export interface PatchProjectProgressParams {
  id: number
  patchProgressProjectDto: PatchProjectProgressDto
}

// [DELETE] /progress-projects/{id}
export interface DeleteProjectProgressParam {
  id: number
}

// [CREATE] /projects
export interface CreateTaskDto {
  id?: number
  title: string
  description: string
  price: number
}

export interface CreateProjectDto {
  authorId: number
  title: string
  description: string
  bannerUrl: string
  files: string[]
  tags: string[]
  category: string
  subtasks: CreateTaskDto[]
}

// [GET] /projects
export interface GetProjectsResponse {
  projects: ProjectInterface[]
  total: number
}

export interface GetProjectsSearchParams extends SearchParams {
  authorId?: number
  title?: string
  description?: string
  tags?: string
  category?: string
  status?: ProjectStatus
}

// [GET] /project/{id}
export interface GetProjectParam {
  id: number
}

// [PATCH] /project/{id}
export interface PatchProjectParams {
  id: number
  patchProjectDto: PatchProjectDto
}

export interface PatchProjectDto {
  title: string
  description: string
  bannerUrl: string
  files: string[]
  tags: string[]
  category: string
  subtasks: CreateTaskDto[]
  deletedTasks: number[]
}

// [DELETE] /project/{id}
export interface DeleteProjectParam {
  id: number
}

// [POST] /auto-task
export interface CreateAutoTaskDto {
  title: string
  description: string
  reward: number
  url: string
  isIntegrated: boolean
}

// [GET] /auto-task/applications
export interface GetAutotaskApplicationsParams extends PaginationSettings {
  userId?: number
  taskId?: number
}

export interface GetAutotaskApplicationsResponse {
  applications: AutotaskApplicationDto[]
  total: number
}

export interface AutotaskApplicationDto {
  id: number
  userId: number
  taskId: number
  isConfirmed: boolean
  createdAt: Date
  task: AutotaskDto
  user: UserInterface
}

// [PUT] /auto-task/{id}/update
export interface PatchAutotaskParams {
  id: number
  patchAutotaskDto: PatchAutotaskDto
}

export interface PatchAutotaskDto {
  title: string
  description: string
  reward: number
  url: string
  isIntegrated: boolean
}

// [GET] /auto-task
export interface AutotaskSearchParams extends SearchParams {
  title?: string
  description?: string
  rewardFrom?: number
  rewardTo?: number
  url?: string
  isIntegrated?: boolean
}

export interface GetAutotaskResponse {
  total: number
  tasks: AutotaskInterface[]
}
