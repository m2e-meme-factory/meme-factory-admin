import { z } from 'zod'
import { Transaction } from '@/pages/transactions/data/schema.ts'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { Button } from '@/components/custom/button.tsx'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editTransaction } from '@/data/requests/transaction/edit-transaction.ts'
import { useToast } from '@/components/ui/use-toast.ts'
import { PatchTransactionDto } from '@/types/api'

const editTransactionSchema = z
  .object({
    projectId: z.string().regex(/^$|^[1-9][0-9]*$/, {
      message: 'Project ID must be empty or a number starting from 1',
    }),
    taskId: z.string().regex(/^$|^[1-9][0-9]*$/, {
      message: 'Task ID must be empty or a number starting from 1',
    }),
    fromUserId: z.string().regex(/^$|^[1-9][0-9]*$/, {
      message: 'FromUser ID must be empty or a number starting from 1',
    }),
    toUserId: z.string().regex(/^[1-9][0-9]*$/, {
      message: 'To User ID must be a number starting from 1',
    }),
    amount: z.string().regex(/^[1-9][0-9]*$/, {
      message: 'Amount must be a number starting from 1',
    }),
    type: z.enum(['SYSTEM', 'WITHDRAWAL', 'DEPOSIT', 'PAYMENT']),
  })
  .refine((data) => data.fromUserId !== data.toUserId, {
    message: 'From User ID and To User ID must be different',
    path: ['toUserId'],
  })

type EditTransactionSchema = z.infer<typeof editTransactionSchema>

export function EditDialog({
  transaction,
  isOpen,
  onClose,
}: {
  transaction: Transaction
  isOpen: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { mutate } = useMutation({
    mutationFn: editTransaction,
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Transaction updated',
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

  const handleClose = () => {
    resetToDefaultValues()
    onClose()
  }

  const form = useForm<EditTransactionSchema>({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      projectId: transaction.projectId?.toString() ?? '',
      taskId: transaction.taskId?.toString() ?? '',
      fromUserId: transaction.fromUserId?.toString() ?? '',
      toUserId: transaction.toUserId.toString(),
      amount: transaction.amount.toString(),
      type: transaction.type ?? 'SYSTEM',
    },
  })

  const resetToDefaultValues = () => {
    form.reset({
      projectId: transaction.projectId?.toString() ?? '',
      taskId: transaction.taskId?.toString() ?? '',
      fromUserId: transaction.fromUserId?.toString() ?? '',
      toUserId: transaction.toUserId.toString(),
      amount: transaction.amount.toString(),
      type: transaction.type ?? 'SYSTEM',
    })
  }

  const onSubmit = (values: EditTransactionSchema) => {
    const checkedData = editTransactionSchema.safeParse(values)
    if (checkedData.success) {
      const data = checkedData.data
      const parsedData: PatchTransactionDto = {
        ...data,
        projectId: data.projectId !== '' ? Number(data.projectId) : undefined,
        toUserId: Number(data.toUserId),
        fromUserId:
          data.fromUserId !== '' ? Number(data.fromUserId) : undefined,
        amount: Number(data.amount),
        taskId: data.taskId !== '' ? Number(data.taskId) : undefined,
      }
      console.log('Editing the transaction:', parsedData)
      mutate({
        params: { id: transaction.id, patchTransactionDto: parsedData },
      })
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
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Make changes to the transaction here. Click save when you're done.
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
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='SYSTEM'>SYSTEM</SelectItem>
                      <SelectItem value='WITHDRAWAL'>WITHDRAWAL</SelectItem>
                      <SelectItem value='DEPOSIT'>DEPOSIT</SelectItem>
                      <SelectItem value='PAYMENT'>PAYMENT</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
