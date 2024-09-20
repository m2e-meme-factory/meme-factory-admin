import { AxiosRequestConfig, ChangeRoleParams } from '@/types/api'
import { UserInterface } from '@/pages/users/data/schema.ts'
import api from '@/data/requests/axios-instance.ts'

export type ChangeUserRole = AxiosRequestConfig<ChangeRoleParams>
export const changeUserRole = ({ params, config }: ChangeUserRole) =>
  api.put<UserInterface>(
    `/users/${params.id}/role`,
    { role: params.role },
    config
  )
