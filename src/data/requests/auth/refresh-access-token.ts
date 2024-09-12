import {
  AxiosRequestConfig,
  RefreshAccessTokenDto,
  RefreshTokenResponse,
} from '@/types/api'
import api from '@/data/requests/axios-instance.ts'

export type RefreshAccessTokenConfig = AxiosRequestConfig<RefreshAccessTokenDto>

export const refreshAccessToken = ({
  params,
  config,
}: RefreshAccessTokenConfig) =>
  api.post<RefreshTokenResponse>('/auth/login/access-token', params, config)
