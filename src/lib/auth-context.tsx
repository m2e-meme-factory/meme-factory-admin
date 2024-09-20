import { createContext, useState, ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/data/requests/auth/auth-login.ts'
import { UserInterface } from '@/pages/users/data/schema.ts'
import { getUser } from '@/data/requests/user/get-specified-user.ts'
import { SignInDto } from '@/types/api'

export interface AuthContextType {
  token: string
  user: UserInterface | null
  loginAction: (data: SignInDto) => void
  logOut: () => void
  email: string | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInterface | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('accessToken')
  )
  const [email, setEmail] = useState<string | null>(null)
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log('Successfully logged in: ', data)
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      setEmail(data.data.userAdmin.email)
      setUserId(data.data.userAdmin.id)
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
    setUserId(null)
    setUser(null)
    setToken(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/login')
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (token && userId) {
        try {
          const response = await getUser({ params: { id: userId } })
          if (response.data) {
            setUser(response.data)
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error)
        }
      }
    }

    fetchUserData()
  }, [token, userId])

  return (
    <AuthContext.Provider
      value={{ token: token || '', user, loginAction, logOut, email }}
    >
      {children}
    </AuthContext.Provider>
  )
}
