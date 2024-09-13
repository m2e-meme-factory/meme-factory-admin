import { UserInterface } from '@/pages/users/data/schema.ts'
import { Project } from '@/pages/projects/data/schema.ts'

export type AxiosRequestConfig<Params = undefined> = Params extends undefined
  ? { config?: import('axios').AxiosRequestConfig }
  : { params: Params; config?: import('axios').AxiosRequestConfig }

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
  isVerified: string
  refCode: string
  role: string
  balance: number
}

// Searching params for [GET] /some-entity requests
export interface SearchParams {
  search?: string
  page?: number
  limit?: number
  sortBy?: string[]
  sortOrder?: 'asc' | 'desc'
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

// [DELETE] /users/{id}
export interface DeleteUserParams {
  id: number
}

// [POST] /transactions
export interface CreateTransactionDto {
  projectId: number
  taskId: number
  fromUserId: number
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
  data: Project
  total: number
  page: number
  pageSize: number
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
