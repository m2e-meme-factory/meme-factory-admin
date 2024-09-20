import { AxiosRequestConfig, UserIdParam } from '@/types/api'
import { UserInterface } from '@/pages/users/data/schema.ts'
import api from '@/data/requests/axios-instance.ts'

export type UnbanUserConfig = AxiosRequestConfig<UserIdParam>
export const unbanUser = ({ params, config }: UnbanUserConfig) =>
  api.put<UserInterface>(`/users/${params.id}/unban/`, config)
