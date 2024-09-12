import { AxiosRequestConfig, DeleteUserParams } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { UserInterface } from '@/pages/users/data/schema.ts'

export type DeleteUserConfig = AxiosRequestConfig<DeleteUserParams>
export const deleteUser = ({ params, config }: DeleteUserConfig) =>
  api.delete<UserInterface>(`/users/${params.id}`, config)
