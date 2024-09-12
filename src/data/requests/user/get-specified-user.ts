import { AxiosRequestConfig, GetUserParams } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { UserInterface } from '@/pages/users/data/schema.ts'

export type GetSpecifiedUserConfig = AxiosRequestConfig<GetUserParams>
export const getUser = ({ params, config }: GetSpecifiedUserConfig) =>
  api.get<UserInterface>(`/users/${params.id}`, config)
