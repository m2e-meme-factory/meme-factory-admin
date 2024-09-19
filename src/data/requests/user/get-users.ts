import {
  AxiosRequestConfig,
  GetUsersResponse,
  UsersSearchParams,
} from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { createQueryParams } from '@/lib/utils.ts'

export type GetUsersConfig = AxiosRequestConfig<UsersSearchParams>

export const getUsers = ({ params, config }: GetUsersConfig) => {
  const url = `/users${createQueryParams(params as Record<string, unknown>)}`
  return api.get<GetUsersResponse>(url, config)
}
