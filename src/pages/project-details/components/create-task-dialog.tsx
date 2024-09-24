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
import { Textarea } from '@/components/ui/textarea.tsx'
import { ProjectTaskData } from '@/pages/projects/data/schema.ts'

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title must be at least 1 character long'),
  description: z
    .string()
    .min(1, 'Description must be at least 1 character long'),
  price: z.string().regex(/^[1-9][0-9]*$/, {
    message: 'Price must be a number',
  }),
})

type CreateTaskSchema = z.infer<typeof createTaskSchema>

interface CreateTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  createTask: (task: ProjectTaskData) => void
}

export function CreateTaskDialog({
  isOpen,
  onClose,
  createTask,
}: CreateTaskDialogProps) {
  const { toast } = useToast()

  const getRandomNegativeNumber = (): number =>
    Math.floor(Math.random() * (1000 - 1 + 1)) * -1

  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
    },
  })

  const onSubmit = (values: CreateTaskSchema) => {
    const checkedData = createTaskSchema.safeParse(values)
    if (checkedData.success) {
      const data = checkedData.data
      createTask({ id: getRandomNegativeNumber(), ...data } as ProjectTaskData)
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Transaction data is invalid',
      })
    }
  }

  const resetToDefaultValues = () => {
    form.reset({
      title: '',
      description: '',
      price: '',
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
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new task. Click create when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
              <Button type='submit'>Create Task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
