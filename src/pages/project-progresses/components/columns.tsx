import { ColumnDef } from '@tanstack/react-table'
import { Progress } from '@/pages/project-progresses/data/schema.ts'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { DataTableColumnHeader } from '@/components/custom/data-table/data-table-column-header.tsx'
import { StatusBadge } from '@/components/custom/status-badge.tsx'
import { DataTableRowActions } from '@/pages/project-progresses/components/data-table-row-actions.tsx'

export const columns: ColumnDef<Progress>[] = [
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
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => <div className='w-[40px]'>{row.getValue('userId')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'projectId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project' />
    ),
    cell: ({ row }) => (
      <div className='w-[40px]'>{row.getValue('projectId')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return <StatusBadge status={status} />
    },
    enableSorting: true,
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
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
