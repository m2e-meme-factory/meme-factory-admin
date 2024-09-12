import axios from 'axios'
import { refreshAccessToken } from '@/data/requests/auth/refresh-access-token.ts'

const BASE_URL = 'http://45.142.122.126:3952/'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const response = await refreshAccessToken({
            params: { refreshToken: refreshToken },
          })
          const newAccessToken = response.data.accessToken
          localStorage.setItem('accessToken', newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return axios(originalRequest)
        } catch (error) {
          //todo: re-authenticate the user by again login and update both the access and refresh tokens.
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
