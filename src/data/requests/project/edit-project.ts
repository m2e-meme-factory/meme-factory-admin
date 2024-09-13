import { AxiosRequestConfig, PatchProjectParams } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'

export type EditProjectConfig = AxiosRequestConfig<PatchProjectParams>
export const editProject = ({ params, config }: EditProjectConfig) =>
  api.patch<void>(`/projects/${params.id}`, params.patchProjectDto, config)
