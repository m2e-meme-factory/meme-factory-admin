import {
  AxiosRequestConfig,
  GetTransactionsParams,
  GetTransactionsResponse,
} from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { createQueryParams } from '@/lib/utils.ts'

export type GetTransactionsConfig = AxiosRequestConfig<GetTransactionsParams>

export const getTransactions = ({ params, config }: GetTransactionsConfig) => {
  const url = `/transactions${createQueryParams(params as Record<string, unknown>)}`
  return api.get<GetTransactionsResponse>(url, config)
}
