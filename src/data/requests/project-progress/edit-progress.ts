import { AxiosRequestConfig, PatchProjectProgressParams } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { ProjectProgressInterface } from '@/pages/project-progresses/data/schema.ts'

export type EditProjectProgress = AxiosRequestConfig<PatchProjectProgressParams>
export const editProgress = ({ params, config }: EditProjectProgress) =>
  api.patch<ProjectProgressInterface>(
    `/progress-projects/${params.id}`,
    params.patchProgressProjectDto,
    config
  )
