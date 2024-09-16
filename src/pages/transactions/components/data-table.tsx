import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '../components/data-table-pagination'
import { DataTableToolbar } from '../components/data-table-toolbar'
import { useQuery } from '@tanstack/react-query'
import { getTransactions } from '@/data/requests/transaction/get-transactions'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast.ts'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  fallbackData: TData[]
}

const Spinner = () => (
  <div className='mt-10 flex h-24 items-center justify-center'>
    <Loader2 className='h-8 w-8 animate-spin text-primary' />
  </div>
)

export function DataTable<TData, TValue>({
  columns,
  fallbackData,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  })

  const { toast } = useToast()

  const {
    data: transactionData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['txData', pagination, sorting, columnFilters],
    queryFn: () => {
      const projectIdFilter = columnFilters.find(
        (column) => column.id === 'projectId'
      )
      const taskIdFilter = columnFilters.find(
        (column) => column.id === 'taskId'
      )
      const fromUserIdFilter = columnFilters.find(
        (column) => column.id === 'fromUserId'
      )
      const toUserIdFilter = columnFilters.find(
        (column) => column.id === 'toUserId'
      )
      const txTypeFilter = columnFilters.find((column) => column.id === 'type')

      return getTransactions({
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          sortBy: sorting.map((s) => s.id),
          sortOrder: sorting.map((s) => (s.desc ? 'desc' : 'asc')),
          projectId: projectIdFilter
            ? Number(projectIdFilter.value)
            : undefined,
          taskId: taskIdFilter ? Number(taskIdFilter.value) : undefined,
          fromUserId: fromUserIdFilter
            ? Number(fromUserIdFilter.value)
            : undefined,
          toUserId: toUserIdFilter ? Number(toUserIdFilter.value) : undefined,
          type:
            txTypeFilter && typeof txTypeFilter.value === 'string'
              ? txTypeFilter.value
              : undefined,
        },
      })
    },
    select: (data) => data,
  })

  const table = useReactTable({
    data: (transactionData?.data.transactions as TData[]) ?? fallbackData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  console.log(transactionData?.data.transactions as TData[], 'data')
  console.log('Filters:', columnFilters)
  console.log('Table Data:', table.getRowModel().rows)

  if (isLoading) return <Spinner />
  if (error) {
    toast({
      variant: 'destructive',
      title: 'Uh oh! Something went wrong.',
    })
  }

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
