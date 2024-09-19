import { AutotaskDto, AxiosRequestConfig, CreateAutoTaskDto } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'

export type CreateAutotaskConfig = AxiosRequestConfig<CreateAutoTaskDto>
export const createAutotask = ({ params, config }: CreateAutotaskConfig) =>
  api.post<AutotaskDto>('/auto-task', params, config)
