import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import { Button } from '@/components/custom/button.tsx'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast.ts'
import { Label } from '@/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { useState } from 'react'
import { changeUserRole } from '@/data/requests/user/change-user-role.ts'

export function ChangeRoleDialog({
  isOpen,
  onClose,
  userId,
  role,
}: {
  isOpen: boolean
  onClose: () => void
  userId: number
  role: string
}) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [roleOption, setRole] = useState<string>(role)

  const { mutate } = useMutation({
    mutationFn: changeUserRole,
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Role has been changed successfully',
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleDelete = () => {
    mutate({ params: { id: userId, role: roleOption } })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to ban this user?
          </DialogDescription>
        </DialogHeader>
        <div className='py-2'>
          <Label htmlFor='role' className='mb-2 block text-sm font-medium'>
            Role
          </Label>
          <Select onValueChange={setRole} value={roleOption}>
            <SelectTrigger id='role' className='w-full'>
              <SelectValue placeholder='Select a role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='creator'>Creator</SelectItem>
              <SelectItem value='advertiser'>Advertiser</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={role === roleOption}
          >
            Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
