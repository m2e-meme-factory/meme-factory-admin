import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import { DataTableViewOptions } from '../../../components/custom/data-table/data-table-view-options.tsx'

import { txTypes } from '../data/data'
import { DataTableFacetedFilter } from '@/components/custom/data-table/data-table-faceted-filter.tsx'
import { DataTableInputFilter } from '@/components/custom/data-table/data-table-input-filter.tsx'
import { CreateDialog } from '@/pages/transactions/components/dialogs/create-dialog.tsx'
import { useState } from 'react'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [isCreateOpen, setCreateOpen] = useState<boolean>(false)

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <div className='flex gap-x-2'>
          {table.getColumn('type') && (
            <DataTableFacetedFilter
              column={table.getColumn('type')}
              title='Type'
              options={txTypes}
            />
          )}
          {table.getColumn('projectId') && (
            <DataTableInputFilter
              column={table.getColumn('projectId')}
              title='Project'
            />
          )}
          {table.getColumn('taskId') && (
            <DataTableInputFilter
              column={table.getColumn('taskId')}
              title='Task'
            />
          )}
          {table.getColumn('fromUserId') && (
            <DataTableInputFilter
              column={table.getColumn('fromUserId')}
              title='From'
            />
          )}
          {table.getColumn('toUserId') && (
            <DataTableInputFilter
              column={table.getColumn('toUserId')}
              title='To'
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <Button
        variant='outline'
        size='sm'
        className='ml-auto mr-3 hidden h-8 lg:flex'
        onClick={() => setCreateOpen(true)}
      >
        <PlusIcon className='mr-2 h-4 w-4' />
        Create
      </Button>
      <CreateDialog
        onClose={() => setCreateOpen(false)}
        isOpen={isCreateOpen}
      />
      <DataTableViewOptions table={table} />
    </div>
  )
}
