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
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { useToast } from '@/components/ui/use-toast.ts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTransaction } from '@/data/requests/transaction/create-transaction.ts'

const createTransactionSchema = z
  .object({
    projectId: z
      .number()
      .int()
      .positive('Project ID must be a positive number')
      .optional(),
    taskId: z
      .number()
      .int()
      .positive('Task ID must be a positive number')
      .optional(),
    fromUserId: z
      .number()
      .int()
      .positive('From User ID must be a positive number')
      .optional(),
    toUserId: z.number().int().positive('To User ID must be a positive number'),
    amount: z.number().positive('Amount must be a positive number'),
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

  const form = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      projectId: undefined,
      taskId: undefined,
      fromUserId: undefined,
      toUserId: undefined,
      amount: undefined,
    },
  })

  const onSubmit = (data: CreateTransactionSchema) => {
    const parsedData = {
      ...data,
      projectId:
        data.projectId === undefined ? undefined : Number(data.projectId),
      taskId: data.taskId === undefined ? undefined : Number(data.taskId),
      fromUserId:
        data.fromUserId === undefined ? undefined : Number(data.fromUserId),
      toUserId: Number(data.toUserId),
      amount: Number(data.amount),
    }

    try {
      createTransactionSchema.parse(parsedData)
      console.log('Submitting new transaction:', parsedData)
      mutate({ params: parsedData })
      onClose()
    } catch (err) {
      console.error('Validation failed:', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
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
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
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
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>Create Transaction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
