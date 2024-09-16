import { AxiosRequestConfig, PatchTransactionParams } from '@/types/api'
import { TransactionInterface } from '@/pages/transactions/data/schema.ts'
import api from '@/data/requests/axios-instance.ts'

export type EditTransactionConfig = AxiosRequestConfig<PatchTransactionParams>
export const editTransaction = ({ params, config }: EditTransactionConfig) =>
  api.patch<TransactionInterface>(
    `/transactions/${params.id}`,
    params.patchTransactionDto,
    config
  )
