import {
  AxiosRequestConfig,
  GetProjectsResponse,
  SearchParams,
} from '@/types/api'
import { createQueryParams } from '@/lib/utils.ts'
import api from '@/data/requests/axios-instance.ts'

export type GetProjectsConfig = AxiosRequestConfig<SearchParams>
export const getProjects = ({ params, config }: GetProjectsConfig) => {
  const url = `/projects${createQueryParams(params)}`
  return api.get<GetProjectsResponse>(url, config)
}
