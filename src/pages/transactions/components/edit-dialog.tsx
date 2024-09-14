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

const editTransactionSchema = z
  .object({
    projectId: z
      .number()
      .int()
      .positive('Project ID must be a positive number'),
    taskId: z.number().int().positive('Task ID must be a positive number'),
    fromUserId: z
      .number()
      .int()
      .positive('From User ID must be a positive number'),
    toUserId: z.number().int().positive('To User ID must be a positive number'),
    amount: z.number().positive('Amount must be a positive number'),
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
  const form = useForm<EditTransactionSchema>({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      projectId: transaction.projectId ?? undefined,
      taskId: transaction.taskId ?? undefined,
      fromUserId: transaction.fromUserId ?? undefined,
      toUserId: transaction.toUserId,
      amount: transaction.amount,
      type: transaction.type ?? 'SYSTEM',
    },
  })

  const onSubmit = (data: EditTransactionSchema) => {
    const parsedData = {
      ...data,
      projectId: Number(data.projectId),
      taskId: Number(data.taskId),
      fromUserId: Number(data.fromUserId),
      toUserId: Number(data.toUserId),
      amount: Number(data.amount),
    }

    try {
      editTransactionSchema.parse(parsedData)
      console.log('Submitting edited transaction:', parsedData)
      onClose()
    } catch (err) {
      console.error('Validation failed:', err)
    }
  }

  const resetToDefaultValues = () => {
    form.reset({
      projectId: transaction.projectId ?? undefined,
      taskId: transaction.taskId ?? undefined,
      fromUserId: transaction.fromUserId ?? undefined,
      toUserId: transaction.toUserId,
      amount: transaction.amount,
      type: transaction.type ?? 'SYSTEM',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                      onChange={(e) =>
                        !isNaN(Number(e.target.value)) &&
                        field.onChange(Number(e.target.value))
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
                        !isNaN(Number(e.target.value)) &&
                        field.onChange(Number(e.target.value))
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
                        !isNaN(Number(e.target.value)) &&
                        field.onChange(Number(e.target.value))
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
                      onChange={(e) =>
                        !isNaN(Number(e.target.value)) &&
                        field.onChange(Number(e.target.value))
                      }
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
                      onChange={(e) =>
                        !isNaN(Number(e.target.value)) &&
                        field.onChange(Number(e.target.value))
                      }
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
