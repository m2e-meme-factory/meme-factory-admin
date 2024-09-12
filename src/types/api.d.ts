export type AxiosRequestConfig<Params = undefined> = Params extends undefined
  ? { config?: import('axios').AxiosRequestConfig }
  : { params: Params; config?: import('axios').AxiosRequestConfig }

// [POST] auth/login/access-token
export interface RefreshAccessTokenDto {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

// [POST] auth/login
export interface SignInDto {
  email: string
  password: string
}

export interface SignInResponse {
  userAdmin: UserAdmin
  accessToken: string
  refreshToken: string
}

interface UserAdmin {
  id: number
  email: string
  isAdmin: boolean
}
