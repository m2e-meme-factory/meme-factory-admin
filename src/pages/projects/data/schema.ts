import { z } from 'zod'

export const PROJECT_STATUSES_OPTIONS = [
  {
    label: 'Draft',
    value: 'draft',
  },
  {
    label: 'Moderation',
    value: 'moderation',
  },
  {
    label: 'Published',
    value: 'published',
  },
  {
    label: 'Rejected',
    value: 'not_accepted',
  },
  {
    label: 'Closed',
    value: 'closed',
  },
]

export enum ProjectStatus {
  DRAFT = 'draft',
  MODERATION = 'moderation',
  PUBLISHED = 'published',
  NOT_ACCEPTED = 'not_accepted',
  CLOSED = 'closed',
}

export interface ProjectTask {
  projectId: number
  taskId: number
  task: ProjectTaskData
}

export interface ProjectTaskData {
  id: number
  title: string
  description: string
  price: string
}

export interface ProjectInterface {
  id: number
  title: string
  description: string
  bannerUrl: string
  files: string[]
  category: string
  tags: string[]
  tasks?: ProjectTask[]
  authorId: number
  status: ProjectStatus
}

export const ProjectTaskDataSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.string(),
})

export const ProjectTaskSchema = z.object({
  projectId: z.number(),
  taskId: z.number(),
  task: ProjectTaskDataSchema,
})

export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  bannerUrl: z.string(),
  files: z.array(z.string()),
  category: z.string(),
  tags: z.array(z.string()),
  tasks: z.array(ProjectTaskSchema).optional(),
  authorId: z.number(),
  status: z.enum([
    'draft',
    'moderation',
    'published',
    'not_accepted',
    'closed',
  ]),
})

export type Project = z.infer<typeof ProjectSchema>
