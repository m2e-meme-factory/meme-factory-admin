import { AxiosRequestConfig, DeleteProjectProgressParam } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'

export type DeleteProgressConfig =
  AxiosRequestConfig<DeleteProjectProgressParam>
export const deleteProgress = ({ params, config }: DeleteProgressConfig) =>
  api.delete<void>(`/progress-projects/${params.id}`, config)
