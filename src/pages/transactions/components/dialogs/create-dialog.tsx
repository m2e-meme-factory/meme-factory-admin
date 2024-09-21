import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/custom/button.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTransaction } from '@/data/requests/transaction/create-transaction.ts'
import { CreateTransactionDto } from '@/types/api'

const createTransactionSchema = z
  .object({
    projectId: z.string().regex(/^$|^[1-9][0-9]*$/, {
      message: 'Project ID must be empty or a number starting from 1',
    }),
    taskId: z.string().regex(/^$|^[1-9][0-9]*$/, {
      message: 'Task ID must be empty or a number starting from 1',
    }),
    fromUserId: z.string().regex(/^$|^[1-9][0-9]*$/, {
      message: 'From User ID must be empty or a number starting from 1',
    }),
    toUserId: z.string().regex(/^[1-9][0-9]*$/, {
      message: 'To User ID must be a number starting from 1',
    }),
    amount: z.string().regex(/^[1-9][0-9]*$/, {
      message: 'Amount must be a number starting from 1',
    }),
  })
  .refine((data) => data.fromUserId !== data.toUserId, {
    message: 'From User ID and To User ID must be different',
    path: ['toUserId'],
  })

type CreateTransactionSchema = z.infer<typeof createTransactionSchema>

export function CreateDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Transaction created',
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

  const resetToDefaultValues = () => {
    form.reset({
      projectId: '',
      taskId: '',
      fromUserId: '',
      toUserId: '',
      amount: '',
    })
  }

  const handleClose = () => {
    resetToDefaultValues()
    onClose()
  }

  const form = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      projectId: '',
      taskId: '',
      fromUserId: '',
      toUserId: '',
      amount: '',
    },
  })

  const onSubmit = (values: CreateTransactionSchema) => {
    const checkedData = createTransactionSchema.safeParse(values)
    if (checkedData.success) {
      const data = checkedData.data
      const parsedData: CreateTransactionDto = {
        projectId: data.projectId !== '' ? Number(data.projectId) : undefined,
        toUserId: Number(data.toUserId),
        fromUserId:
          data.fromUserId !== '' ? Number(data.fromUserId) : undefined,
        amount: Number(data.amount),
        taskId: data.taskId !== '' ? Number(data.taskId) : undefined,
      }
      console.log('Submitting new transaction:', parsedData)
      mutate({ params: parsedData })
      onClose()
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Transaction data is invalid',
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Transaction</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new transaction. Click create when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='projectId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project ID</FormLabel>
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
              name='taskId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task ID</FormLabel>
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
              name='fromUserId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From User ID</FormLabel>
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
              name='toUserId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To User ID</FormLabel>
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
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
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
              <Button type='submit'>Create Transaction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
