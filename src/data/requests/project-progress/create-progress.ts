import { AxiosRequestConfig, CreateProjectProgressDto } from '@/types/api'
import { ProjectProgressInterface } from '@/pages/project-progresses/data/schema.ts'
import api from '@/data/requests/axios-instance.ts'

export type CreateProgressConfig = AxiosRequestConfig<CreateProjectProgressDto>
export const createProgress = ({ params, config }: CreateProgressConfig) =>
  api.post<ProjectProgressInterface>('/progress-projects', params, config)
