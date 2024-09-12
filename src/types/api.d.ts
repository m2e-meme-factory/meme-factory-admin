import { UserInterface } from '@/pages/users/data/schema.ts'

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

// [GET] /users
export interface GetUsersParams {
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
