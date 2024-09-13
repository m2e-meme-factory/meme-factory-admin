import { UserRole } from '@/pages/users/data/schema.ts'

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

export interface EventDetails {
  transactionId?: number
  amount?: number
  taskId?: number
  approvedEventId?: number
  eventId?: number
}

export interface Event {
  id: number
  progressProjectId: string
  projectId: number
  userId: number
  role: UserRole
  message: string
  eventType: EventType
  description?: string
  createdAt: Date
  details?: EventDetails
}
