import { AxiosRequestConfig, PatchAutotaskParams } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'

export type EditAutoTaskConfig = AxiosRequestConfig<PatchAutotaskParams>
export const editAutotask = ({ params, config }: EditAutoTaskConfig) =>
  api.patch<void>(
    `/auto-task/${params.id}/update`,
    params.patchAutotaskDto,
    config
  )
