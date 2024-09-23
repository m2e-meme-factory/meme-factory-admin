import { ProjectTaskData } from '@/pages/projects/data/schema.ts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import { Button } from '@/components/custom/button.tsx'

interface DeleteTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  task: ProjectTaskData
  deleteTask: (task: ProjectTaskData) => void
}

export function DeleteTaskDialog({
  isOpen,
  onClose,
  task,
  deleteTask,
}: DeleteTaskDialogProps) {
  const handleDelete = () => {
    deleteTask(task)
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
