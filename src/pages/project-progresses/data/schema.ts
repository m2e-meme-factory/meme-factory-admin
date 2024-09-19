import { UserRole } from '@/pages/users/data/schema.ts'
import { z } from 'zod'

enum EventType {
  APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED',
  APPLICATION_APPROVED = 'APPLICATION_APPROVED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  TASK_SUBMIT = 'TASK_SUBMIT',
  TASK_REJECTED = 'TASK_REJECTED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  DISPUTE_OPENED = 'DISPUTE_OPENED',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
  USER_MESSAGE = 'USER_MESSAGE',
}

export enum ProjectStatus {
  ACCEPTED = 'accepted',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export interface EventDetails {
  transactionId?: number
  amount?: number
  taskId?: number
  approvedEventId?: number
  eventId?: number
}

export const ProgressEventDetailsDataSchema = z.object({
  transactionId: z.number().optional(),
  amount: z.number().optional(),
  taskId: z.number().optional(),
  approvedEventId: z.number().optional(),
  eventId: z.number().optional(),
})

export interface Event {
  id: number
  progressProjectId: number
  projectId: number
  userId: number
  role: UserRole
  message: string
  eventType: EventType
  description?: string
  createdAt: Date
  details?: EventDetails
}

export const ProgressEventDataSchema = z.object({
  id: z.number(),
  progressProjectId: z.number(),
  projectId: z.number(),
  userId: z.number(),
  role: z.nativeEnum(UserRole),
  message: z.string(),
  eventType: z.nativeEnum(EventType),
  description: z.string().optional(),
  createdAt: z.string(),
  details: ProgressEventDetailsDataSchema.optional().nullable(),
})

export interface ProjectProgressInterface {
  id: number
  userId: number
  projectId: number
  status: ProjectStatus
  createdAt: Date
  updatedAt?: Date
  events: Event[]
}

export const ProgressProjectDataSchema = z.object({
  id: z.number(),
  userId: z.number(),
  projectId: z.number(),
  status: z.nativeEnum(ProjectStatus),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  events: z.array(ProgressEventDataSchema),
})

export type Progress = z.infer<typeof ProgressProjectDataSchema>
