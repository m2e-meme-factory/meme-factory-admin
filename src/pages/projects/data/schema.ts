export enum ProjectStatus {
  DRAFT = 'draft',
  MODERATION = 'moderation',
  PUBLISHED = 'published',
  NOT_ACCEPTED = 'not_accepted',
  CLOSED = 'closed',
}

export interface Task {
  id: string
  title: string
  description: string
  price: number
}

export interface Project {
  id: string
  title: string
  description: string
  bannerUrl: string
  files: string[]
  category: string
  tags: string[]
  tasks: Task[]
  authorId: string
  status: ProjectStatus
}
