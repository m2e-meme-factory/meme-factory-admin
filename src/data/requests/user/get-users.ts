import {
  AxiosRequestConfig,
  GetUsersParams,
  GetUsersResponse,
} from '@/types/api'
import api from '@/data/requests/axios-instance.ts'

export type GetUsersConfig = AxiosRequestConfig<GetUsersParams>

export const getUsers = ({ params, config }: GetUsersConfig) => {
  const queryParams = new URLSearchParams()

  if (params) {
    if (params.search) queryParams.append('search', params.search)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.sortBy) queryParams.append('sortBy', params.sortBy.join(','))
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)
  }

  const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

  return api.get<GetUsersResponse>(url, config)
}
