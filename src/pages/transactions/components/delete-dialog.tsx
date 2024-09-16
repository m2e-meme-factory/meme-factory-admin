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
import { deleteTransaction } from '@/data/requests/transaction/delete-transaction.ts'
import { useToast } from '@/components/ui/use-toast.ts'

export function DeleteDialog({
  isOpen,
  onClose,
  transactionId,
}: {
  isOpen: boolean
  onClose: () => void
  transactionId: number
}) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Transaction deleted',
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['txData'] })
    },
  })

  const handleDelete = () => {
    mutate({
      params: {
        id: transactionId,
      },
    })
    console.log('Deleting transaction')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
