import { AxiosRequestConfig, PatchUserParams } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { UserInterface } from '@/pages/users/data/schema.ts'

export type EditUserConfig = AxiosRequestConfig<PatchUserParams>
export const editUser = ({ params, config }: EditUserConfig) =>
  api.patch<UserInterface>(`/users/${params.id}`, params.patchUserDto, config)
