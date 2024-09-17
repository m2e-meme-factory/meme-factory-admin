import {
  AxiosRequestConfig,
  GetProjectsResponse,
  GetProjectsSearchParams,
} from '@/types/api'
import { createQueryParams } from '@/lib/utils.ts'
import api from '@/data/requests/axios-instance.ts'

export type GetProjectsConfig = AxiosRequestConfig<GetProjectsSearchParams>
export const getProjects = ({ params, config }: GetProjectsConfig) => {
  const url = `/projects${createQueryParams(params as Record<string, unknown>)}`
  return api.get<GetProjectsResponse>(url, config)
}
