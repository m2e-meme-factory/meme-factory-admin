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
  getFacetedUniqueValues,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/custom/data-table/data-table-pagination.tsx'
import { DataTableToolbar } from '../components/data-table-toolbar'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast.ts'
import { useState } from 'react'
import { getAutotask } from '@/data/requests/auto-task/get-autotasks.ts'
import { Spinner } from '@/components/custom/spinner.tsx'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  fallbackData: TData[]
}

interface RewardValue {
  from?: number
  to?: number
}

export function DataTable<TData, TValue>({
  columns,
  fallbackData,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  })

  const { toast } = useToast()

  const {
    data: autotaskData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users', pagination, sorting, columnFilters],
    queryFn: () => {
      const rewardFilter = columnFilters.find(
        (column) => column.id === 'reward'
      )
      const rewardFilterValue = rewardFilter?.value as RewardValue
      const integratedFilter = columnFilters.find(
        (column) => column.id === 'isIntegrated'
      )
      const titleFilter = columnFilters.find((column) => column.id === 'title')

      return getAutotask({
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          sortBy: sorting.map((s) => s.id),
          sortOrder: sorting.map((s) => (s.desc ? 'desc' : 'asc')),
          isIntegrated:
            integratedFilter && typeof integratedFilter.value === 'boolean'
              ? integratedFilter.value
              : undefined,
          title:
            titleFilter && typeof titleFilter.value === 'string'
              ? titleFilter.value
              : undefined,
          rewardFrom:
            rewardFilterValue && typeof rewardFilterValue.from === 'number'
              ? Number(rewardFilterValue.from)
              : undefined,
          rewardTo:
            rewardFilterValue && typeof rewardFilterValue.to === 'number'
              ? Number(rewardFilterValue.to)
              : undefined,
        },
      })
    },
    select: (data) => data,
  })

  console.log(columnFilters)

  const totalItems = autotaskData?.data?.total ?? 0

  const table = useReactTable({
    data: (autotaskData?.data.tasks as TData[]) ?? fallbackData,
    columns,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pagination.pageSize),
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
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

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
