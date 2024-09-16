import { AxiosRequestConfig, SearchParams } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'
import { createQueryParams } from '@/lib/utils.ts'
import { ProjectProgressInterface } from '@/pages/project-progresses/data/schema.ts'

export type GetProgressesConfig = AxiosRequestConfig<SearchParams>
export const getProgresses = ({ params, config }: GetProgressesConfig) => {
  const url = `/progress-projects${createQueryParams(params as Record<string, unknown>)}`
  return api.get<ProjectProgressInterface[]>(url, config)
}
