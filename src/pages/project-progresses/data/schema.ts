import { Event } from '@/pages/events/data/schema.ts'

export interface ProjectProgressInterface {
  id: number
  userId: number
  projectId: number
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
  updatedAt?: Date
  events: Event[]
}
