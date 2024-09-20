import { AxiosRequestConfig, UserIdParam } from '@/types/api'
import { UserInterface } from '@/pages/users/data/schema.ts'
import api from '@/data/requests/axios-instance.ts'

export type BanUserConfig = AxiosRequestConfig<UserIdParam>
export const banUser = ({ params, config }: BanUserConfig) =>
  api.put<UserInterface>(`/users/${params.id}/ban`, config)
