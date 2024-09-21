import { createContext, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/data/requests/auth/auth-login.ts'
import { SignInDto } from '@/types/api'

export interface AuthContextType {
  token: string
  loginAction: (data: SignInDto) => void
  logOut: () => void
  email: string | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('accessToken')
  )
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem('email')
  )
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log('Successfully logged in: ', data)
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      localStorage.setItem('email', data.data.userAdmin.email)
      setEmail(data.data.userAdmin.email)
      setToken(data.data.accessToken)
      navigate('/dashboard')
    },
    onError: (error) => {
      console.error('Error logging in: ', error)
    },
    retry: 3,
  })

  const loginAction = (data: SignInDto) => {
    loginMutation.mutate({ params: data })
  }

  const logOut = () => {
    setToken(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('email')
    navigate('/sign-in')
  }

  return (
    <AuthContext.Provider
      value={{ token: token || '', loginAction, logOut, email }}
    >
      {children}
    </AuthContext.Provider>
  )
}
