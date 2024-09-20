import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { userSchema } from '@/pages/users/data/schema.ts'
import { UnbanDialog } from '@/pages/users/components/dialogs/unban-dialog.tsx'
import { BanDialog } from '@/pages/users/components/dialogs/ban-dialog.tsx'
import { useState } from 'react'
import { ChangeRoleDialog } from '@/pages/users/components/dialogs/change-role-dialog.tsx'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const user = userSchema.parse(row.original)
  const [isBanVisible, setBanVisible] = useState(false)
  const [isUnbanVisible, setUnbanVisible] = useState(false)
  const [isRoleDialogVisible, setRoleDialogVisible] = useState(false)
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
          <DropdownMenuItem>View profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBanVisible(true)}>
            Ban user {user.telegramId}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUnbanVisible(true)}>
            Unban user {user.telegramId}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRoleDialogVisible(true)}>
            Change role
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UnbanDialog
        isOpen={isUnbanVisible}
        onClose={() => setUnbanVisible(false)}
        userId={user.id}
      />
      <BanDialog
        isOpen={isBanVisible}
        onClose={() => setBanVisible(false)}
        userId={user.id}
      />
      <ChangeRoleDialog
        isOpen={isRoleDialogVisible}
        onClose={() => setRoleDialogVisible(false)}
        userId={user.id}
        role={user.role}
      ></ChangeRoleDialog>
    </>
  )
}
