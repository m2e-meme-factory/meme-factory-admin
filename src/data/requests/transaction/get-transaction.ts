import { AxiosRequestConfig, GetTransactionParam } from '@/types/api'
import { TransactionInterface } from '@/pages/transactions/data/schema.ts'
import api from '@/data/requests/axios-instance.ts'

export type GetTransactionConfig = AxiosRequestConfig<GetTransactionParam>
export const getTransaction = ({ params, config }: GetTransactionConfig) =>
  api.get<TransactionInterface>(`/transactions/${params.id}`, config)
