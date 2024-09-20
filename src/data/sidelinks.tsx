import {
  IconChecklist,
  IconLayoutDashboard,
  IconUsers,
  IconTransactionBitcoin,
  IconTrendingUp,
  IconBox,
  IconLogin,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Autotasks',
    label: '',
    href: '/autotasks',
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'Projects',
    label: '',
    href: '/projects',
    icon: <IconBox size={18} />,
  },
  {
    title: 'Transactions',
    label: '',
    href: '/transactions',
    icon: <IconTransactionBitcoin size={18} />,
  },
  {
    title: 'Progresses',
    label: '',
    href: '/progresses',
    icon: <IconTrendingUp size={18} />,
  },
  {
    title: 'Users',
    label: '',
    href: '/users',
    icon: <IconUsers size={18} />,
  },
  {
    title: 'Sign In',
    label: '',
    href: '/sign-in',
    icon: <IconLogin size={18} />,
  },
]
