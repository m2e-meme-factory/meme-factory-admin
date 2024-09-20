import { Layout } from '@/components/custom/layout.tsx'
import { Search } from '@/components/search.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { Breadcrumb, BreadcrumbItem } from '@/components/custom/breadcrumb.tsx'
import { Link } from 'react-router-dom'
import { IconChevronRight } from '@tabler/icons-react'

export default function Projects() {
  const items = [
    { title: 'Home', href: '/' },
    { title: 'Progresses', href: '/progresses' },
  ].map(({ href, title }) => (
    <BreadcrumbItem key={title}>
      {href ? (
        <Link className='text-muted-foreground hover:text-foreground' to={href}>
          {title}
        </Link>
      ) : (
        <span className='text-muted-foreground'>{title}</span>
      )}
    </BreadcrumbItem>
  ))

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-5'>
          <Breadcrumb separator={<IconChevronRight size={18} />}>
            {items}
          </Breadcrumb>
        </div>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Welcome back!</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of projects!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable fallbackData={[]} columns={columns} />
        </div>
      </Layout.Body>
    </Layout>
  )
}
