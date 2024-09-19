import {
  AxiosRequestConfig,
  GetProjectProgressesResponse,
  ProjectProgressSearchParams,
} from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { createQueryParams } from '@/lib/utils.ts'

export type GetProgressesConfig =
  AxiosRequestConfig<ProjectProgressSearchParams>
export const getProgresses = ({ params, config }: GetProgressesConfig) => {
  const url = `/progress-projects${createQueryParams(params as Record<string, unknown>)}`
  return api.get<GetProjectProgressesResponse>(url, config)
}
