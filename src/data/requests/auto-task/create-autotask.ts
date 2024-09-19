import { AxiosRequestConfig, CreateAutoTaskDto } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { Autotask } from '@/pages/autotasks/data/schema.ts'

export type CreateAutotaskConfig = AxiosRequestConfig<CreateAutoTaskDto>
export const createAutotask = ({ params, config }: CreateAutotaskConfig) =>
  api.post<Autotask>('/auto-task', params, config)
