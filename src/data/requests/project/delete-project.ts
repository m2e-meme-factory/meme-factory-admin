import { AxiosRequestConfig, DeleteProjectParam } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'

export type DeleteProjectConfig = AxiosRequestConfig<DeleteProjectParam>
export const deleteProject = ({ params, config }: DeleteProjectConfig) =>
  api.delete<void>(`/projects/${params.id}`, config)
