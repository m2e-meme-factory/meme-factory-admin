import { User } from '@/pages/users/data/schema.ts'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { DataTableColumnHeader } from '@/components/custom/data-table/data-table-column-header.tsx'
import { DataTableRowActions } from '@/pages/users/components/data-table-row-actions.tsx'

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Id' />
    ),
    cell: ({ row }) => <div className='w-[20px]'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'telegramId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='TelegramId' />
    ),
    cell: ({ row }) => (
      <div className='w-[90px]'>{row.getValue('telegramId')}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Username' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('username')}
          </span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => <div className='w-[60px]'>{row.getValue('role')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'isBaned',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Banned' />
    ),
    cell: ({ row }) => (
      <div className='flex w-[50px] justify-center'>
        {row.getValue('isBaned') ? '✅' : '❌'}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'isVerified',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Verified' />
    ),
    cell: ({ row }) => (
      <div className='flex w-[50px] justify-center'>
        {row.getValue('isVerified') ? '✅' : '❌'}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'refCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='RefCode' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>{row.getValue('refCode')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
