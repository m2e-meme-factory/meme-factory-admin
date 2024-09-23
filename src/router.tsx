import { createBrowserRouter, Outlet } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import { ProtectedRoute } from '@/components/custom/protected-route.tsx'
import { AuthProvider } from '@/lib/auth-context.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: '/',
        lazy: async () => {
          const AppShell = await import('./components/app-shell')
          return { Component: AppShell.default }
        },
        errorElement: <GeneralError />,
        children: [
          {
            path: '/sign-in',
            lazy: async () => ({
              Component: (await import('./pages/auth/sign-in.tsx')).default,
            }),
          },
          {
            element: <ProtectedRoute />,
            children: [
              {
                path: 'dashboard',
                lazy: async () => ({
                  Component: (await import('@/pages/dashboard')).default,
                }),
              },
              {
                path: 'autotasks',
                lazy: async () => ({
                  Component: (await import('@/pages/autotasks')).default,
                }),
              },
              {
                index: true,
                lazy: async () => ({
                  Component: (await import('./pages/dashboard')).default,
                }),
              },
              {
                path: 'transactions',
                lazy: async () => ({
                  Component: (await import('@/pages/transactions')).default,
                }),
              },
              {
                path: 'projects',
                lazy: async () => ({
                  Component: (await import('@/pages/projects')).default,
                }),
              },
              {
                path: 'projects/:id',
                lazy: async () => ({
                  Component: (await import('@/pages/project-details')).default,
                }),
              },
              {
                path: 'progresses',
                lazy: async () => ({
                  Component: (await import('@/pages/project-progresses'))
                    .default,
                }),
              },
              {
                path: 'users',
                lazy: async () => ({
                  Component: (await import('@/pages/users')).default,
                }),
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', Component: NotFoundError },
])

export default router
