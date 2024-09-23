import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/custom/button.tsx'
import { ProjectTaskData } from '@/pages/projects/data/schema.ts'
import { Textarea } from '@/components/ui/textarea.tsx'

const editTaskSchema = z.object({
  id: z.string().regex(/^$|^[1-9][0-9]*$/),
  title: z.string().min(1, 'Title must be at least 1 character1 long'),
  description: z
    .string()
    .min(1, 'Description must be at least 1 character1 long'),
  price: z.string().regex(/^$[1-9][0-9]*$/, {
    message: 'Price must be a number starting from 1',
  }),
})

type EditTaskSchema = z.infer<typeof editTaskSchema>

interface EditTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  task: ProjectTaskData
  editTask: (task: ProjectTaskData) => void
}

export function EditTaskDialog({
  isOpen,
  onClose,
  task,
  editTask,
}: EditTaskDialogProps) {
  const { toast } = useToast()

  const form = useForm<EditTaskSchema>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      id: task.id.toString(),
      title: task.title,
      description: task.description,
      price: task.price,
    },
  })

  const onSubmit = (values: EditTaskSchema) => {
    const checkedData = editTaskSchema.safeParse(values)
    if (checkedData.success) {
      const { id, ...otherData } = checkedData.data
      editTask({ id: Number(id), ...otherData })
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Transaction data is invalid',
      })
    }
  }

  const resetToDefaultValues = () => {
    form.reset({
      id: task.id.toString(),
      title: task.title,
      description: task.description,
      price: task.price,
    })
  }

  const handleClose = () => {
    resetToDefaultValues()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit the Task</DialogTitle>
          <DialogDescription>
            Fill in the details to edit the task. Click edit when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      type='text'
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className='h-32'
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant='ghost'
                type='button'
                onClick={resetToDefaultValues}
              >
                Reset to default
              </Button>
              <Button type='submit'>Edit Task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
