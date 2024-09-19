import { z } from 'zod'

export enum UserRole {
  CREATOR = 'creator',
  ADVERTISER = 'advertiser',
}

export interface UserInfo {
  id: number
  name: string | null
  email: string | null
  phoneNumber: string | null
  tonWalletAddress: string | null
  userId: number
}

export const UserInfoSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  tonWalletAddress: z.string().nullable(),
  userId: z.number(),
})

export interface MetaTag {
  id: number
  userId: number
}

export const MetaTagSchema = z.object({
  id: z.number(),
  userId: z.number(),
})

export interface UserInterface {
  id: number
  telegramId: string
  username: string | null
  role: UserRole
  isBaned: boolean
  isVerified: boolean
  createdAt: string
  inviterRefCode?: string
  refCode?: string
  balance: string
  wasOpened: boolean
  isSended: boolean
  userInfo: UserInfo
  MetaTag: MetaTag[]
}

export const userSchema = z.object({
  id: z.number(),
  telegramId: z.string(),
  username: z.string().nullable(),
  role: z.nativeEnum(UserRole),
  isBaned: z.boolean(),
  isVerified: z.boolean(),
  createdAt: z.string(),
  inviterRefCode: z.string().optional().nullable(),
  refCode: z.string().optional().nullable(),
  balance: z.string(),
  wasOpened: z.boolean(),
  isSended: z.boolean(),
  userInfo: UserInfoSchema,
  MetaTag: z.array(MetaTagSchema),
})

export type User = z.infer<typeof userSchema>
