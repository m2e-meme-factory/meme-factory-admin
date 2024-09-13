import { AxiosRequestConfig, DeleteTransactionParam } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'

export type DeleteTransactionConfig = AxiosRequestConfig<DeleteTransactionParam>
export const deleteTransaction = ({
  params,
  config,
}: DeleteTransactionConfig) =>
  api.delete<void>(`/transactions/${params.id}`, config)
