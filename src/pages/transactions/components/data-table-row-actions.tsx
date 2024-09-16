import { Transaction, transactionSchema } from '../data/schema'
import { Button } from '@/components/custom/button'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { DeleteDialog } from '@/pages/transactions/components/delete-dialog.tsx'
import { EditDialog } from '@/pages/transactions/components/edit-dialog.tsx'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const transaction: Transaction = transactionSchema.parse(row.original)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditDialog
        transaction={transaction}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
      <DeleteDialog
        transactionId={transaction.id}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      />
    </>
  )
}
