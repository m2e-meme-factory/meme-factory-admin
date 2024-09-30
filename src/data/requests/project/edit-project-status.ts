import { AxiosRequestConfig, EditProjectStatusParams } from '@/types/api'
import { ProjectInterface } from '@/pages/projects/data/schema.ts'
import api from '@/data/requests/axios-instance.ts'

export type EditProjectStatusConfig =
  AxiosRequestConfig<EditProjectStatusParams>
export const editProjectStatus = ({
  params,
  config,
}: EditProjectStatusConfig) =>
  api.put<ProjectInterface>(
    `/projects/${params.projectId}/status`,
    params.payload,
    config
  )
