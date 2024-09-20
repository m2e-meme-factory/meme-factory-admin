import { useAuth } from '@/hooks/use-auth.ts'
import { Outlet } from 'react-router-dom'
import UnauthorisedError from '@/pages/errors/unauthorised-error.tsx'

export function ProtectedRoute() {
  const user = useAuth()

  if (!user.token) {
    return <UnauthorisedError />
  }
  return <Outlet />
}
