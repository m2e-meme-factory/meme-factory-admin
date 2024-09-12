import { AxiosRequestConfig, CreateUserDto } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { UserInterface } from '@/pages/users/data/schema.ts'

export type CreateUserConfig = AxiosRequestConfig<CreateUserDto>

export const createUser = ({ params, config }: CreateUserConfig) =>
  api.post<UserInterface>('/users', params, config)
