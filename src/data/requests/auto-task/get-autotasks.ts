import {
  AutotaskSearchParams,
  AxiosRequestConfig,
  GetAutotaskResponse,
} from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { createQueryParams } from '@/lib/utils.ts'

export type GetAutotasksConfig = AxiosRequestConfig<AutotaskSearchParams>
export const getAutotask = ({ params, config }: GetAutotasksConfig) => {
  const url = `/auto-task?${createQueryParams(params as Record<string, unknown>)}`
  return api.get<GetAutotaskResponse>(url, config)
}
