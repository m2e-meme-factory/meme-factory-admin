import { AxiosRequestConfig, GetProjectParam } from '@/types/api'
import { Project } from '@/pages/projects/data/schema.ts'
import api from '@/data/requests/axios-instance.ts'

export type GetProjectConfig = AxiosRequestConfig<GetProjectParam>
export const getProject = ({ params, config }: GetProjectConfig) =>
  api.get<Project>(`/projects/${params.id}`, config)
