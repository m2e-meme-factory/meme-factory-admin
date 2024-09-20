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
import { banUser } from '@/data/requests/user/ban-user.ts'

export function BanDialog({
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

  const banMutation = useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'User banned',
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

  const handleBan = () => {
    banMutation.mutate({ params: { id: userId } })
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
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleBan}>
            Ban
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
