import { AxiosRequestConfig, SignInDto, SignInResponse } from '@/types/api'
import api from '@/data/requests/axios-instance.ts'

export type LoginConfig = AxiosRequestConfig<SignInDto>

export const login = ({ params, config }: LoginConfig) =>
  api.post<SignInResponse>(`/auth/login`, params, config)
