import { z } from 'zod'

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'SYSTEM' | 'PAYMENT'
const TransactionTypeSchema = z.enum([
  'DEPOSIT',
  'WITHDRAWAL',
  'SYSTEM',
  'PAYMENT',
])

export interface TransactionInterface {
  id: number
  projectId: number | null
  taskId: number | null
  fromUserId: number | null
  toUserId: number
  amount: number
  createdAt: string
  type: TransactionType
}

export const transactionSchema = z.object({
  id: z.number(),
  projectId: z.number().nullable(),
  taskId: z.number().nullable(),
  fromUserId: z.number().nullable(),
  toUserId: z.number(),
  amount: z.number(),
  createdAt: z.string(),
  type: TransactionTypeSchema,
})

export type Transaction = z.infer<typeof transactionSchema>
