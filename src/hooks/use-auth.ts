import { useContext } from 'react'
import { AuthContext, AuthContextType } from '@/lib/auth-context.tsx'

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
