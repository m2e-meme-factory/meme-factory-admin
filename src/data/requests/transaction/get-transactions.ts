import { AxiosRequestConfig, SearchParams } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { TransactionInterface } from '@/pages/transactions/data/schema.ts'
import { createQueryParams } from '@/lib/utils.ts'

export type GetTransactionsConfig = AxiosRequestConfig<SearchParams>

export const getTransactions = ({ params, config }: GetTransactionsConfig) => {
  const url = `/transactions${createQueryParams(params)}`
  return api.get<TransactionInterface[]>(url, config)
}
