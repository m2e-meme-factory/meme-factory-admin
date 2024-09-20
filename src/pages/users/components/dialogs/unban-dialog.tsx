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
import { unbanUser } from '@/data/requests/user/unban-user.ts'

export function UnbanDialog({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean
  onClose: () => void
  userId: number
}) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const unbanMutation = useMutation({
    mutationFn: unbanUser,
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'User unbanned',
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

  const handleUnban = () => {
    unbanMutation.mutate({ params: { id: userId } })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to unban this user?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='secondary' onClick={handleUnban}>
            Unban
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
