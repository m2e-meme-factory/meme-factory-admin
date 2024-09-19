import { z } from 'zod'

export interface AutotaskInterface {
  id: number
  title: string
  description: string
  reward: string
  url?: string
  isIntegrated: boolean
  createdAt: string
}

export const AutotaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  reward: z.string(),
  url: z.string().optional().nullable(),
  isIntegrated: z.boolean(),
  createdAt: z.string(),
})

export type Autotask = z.infer<typeof AutotaskSchema>
