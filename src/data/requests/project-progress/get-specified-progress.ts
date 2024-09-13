import { AxiosRequestConfig, GetProjectProgressParam } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { ProjectProgressInterface } from '@/pages/project-progresses/data/schema.ts'

export type GetSpecifiedProgressConfig =
  AxiosRequestConfig<GetProjectProgressParam>
export const getSpecifiedProgress = ({
  params,
  config,
}: GetSpecifiedProgressConfig) =>
  api.get<ProjectProgressInterface>(`/progress-projects/${params.id}`, config)
