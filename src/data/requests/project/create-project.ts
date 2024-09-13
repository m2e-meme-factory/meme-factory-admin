import { AxiosRequestConfig, CreateProjectDto } from '@/types/api'
import { Project } from '@/pages/projects/data/schema.ts'
import api from '@/data/requests/axios-instance.ts'

export type CreateProjectConfig = AxiosRequestConfig<CreateProjectDto>
export const createProject = ({ params, config }: CreateProjectConfig) =>
  api.post<Project>('/projects', params, config)
