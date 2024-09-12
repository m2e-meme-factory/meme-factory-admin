import { z } from 'zod'

export enum UserRole {
  CREATOR = 'creator',
  ADVERTISER = 'advertiser',
}

const UserRoleSchema = z.enum([UserRole.CREATOR, UserRole.ADVERTISER])

export interface UserInterface {
  id: string
  telegramId: string
  username: string
  role: UserRole
  isBaned: boolean
  isVerified: boolean
  createdAt: string
  inviterRefCode?: string
  refCode?: string
  balance: string
}

const userSchema = z.object({
  id: z.string(),
  telegramId: z.string(),
  username: z.string(),
  role: UserRoleSchema,
  isBaned: z.boolean(),
  isVerified: z.boolean(),
  createdAt: z.string(),
  inviterRefCode: z.string().optional(),
  refCode: z.string().optional(),
  balance: z.string(),
})

export type User = z.infer<typeof userSchema>
