import { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

import { Transaction } from '../data/schema'

export const columns: ColumnDef<Transaction>[] = [
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
    accessorKey: 'projectId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ProjectId' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>{row.getValue('projectId')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'taskId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='TaskId' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('taskId')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'fromUserId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='From' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>{row.getValue('fromUserId')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'toUserId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='To' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>{row.getValue('toUserId')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('amount')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='CreatedAt' />
    ),
    cell: ({ row }) => (
      <div className='w-[120px]'>{row.getValue('createdAt')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tx Type' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('type')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
