import { AxiosRequestConfig, CreateTransactionDto } from '@/types/api'
import { TransactionInterface } from '@/pages/transactions/data/schema.ts'
import api from '@/data/requests/axios-instance.ts'

export type CreateTransactionConfig = AxiosRequestConfig<CreateTransactionDto>
export const createTransaction = ({
  params,
  config,
}: CreateTransactionConfig) =>
  api.post<TransactionInterface>('/transactions', params, config)
