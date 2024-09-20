import {
  AxiosRequestConfig,
  GetAutotaskApplicationsParams,
  GetAutotaskApplicationsResponse,
} from '@/types/api'
import { createQueryParams } from '@/lib/utils.ts'
import api from '@/data/requests/axios-instance.ts'

export type GetAutotaskApplicationsConfig =
  AxiosRequestConfig<GetAutotaskApplicationsParams>
export const getAutotaskApplications = ({
  params,
  config,
}: GetAutotaskApplicationsConfig) => {
  const url = `/auto-task/applications${createQueryParams(params as Record<string, unknown>)}`
  return api.get<GetAutotaskApplicationsResponse>(url, config)
}
