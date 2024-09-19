import { ColumnDef } from '@tanstack/react-table'
import { Autotask } from '@/pages/autotasks/data/schema.ts'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { DataTableColumnHeader } from '@/components/custom/data-table/data-table-column-header.tsx'
import { DataTableRowActions } from '@/pages/autotasks/components/data-table-row-actions.tsx'

export const columns: ColumnDef<Autotask>[] = [
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
    cell: ({ row }) => <div className='w-[40px]'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('title')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'reward',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reward' />
    ),
    cell: ({ row }) => <div className='w-[40px]'>{row.getValue('reward')}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'isIntegrated',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Integrated' />
    ),
    cell: ({ row }) => (
      <div className='flex w-[50px] justify-center'>
        {row.getValue('isIntegrated') ? '✅' : '❌'}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='CreatedAt' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>{row.getValue('createdAt')}</div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
