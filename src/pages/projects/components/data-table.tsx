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
import { DataTablePagination } from '@/components/custom/data-table/data-table-pagination.tsx'
import { DataTableToolbar } from '../components/data-table-toolbar'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast.ts'
import { useState } from 'react'
import { getProjects } from '@/data/requests/project/get-projects.ts'
import { ProjectStatus } from '@/pages/projects/data/schema.ts'

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
    data: transactionData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects', pagination, sorting, columnFilters],
    queryFn: () => {
      const categoryFilter = columnFilters.find(
        (column) => column.id === 'category'
      )
      const statusFilter = columnFilters.find(
        (column) => column.id === 'status'
      )
      const tagsFilter = columnFilters.find((column) => column.id === 'tags')
      const titleFilter = columnFilters.find((column) => column.id === 'title')

      return getProjects({
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          sortBy: sorting.map((s) => s.id),
          sortOrder: sorting.map((s) => (s.desc ? 'desc' : 'asc')),
          status:
            statusFilter && typeof statusFilter.value === 'string'
              ? (statusFilter.value as ProjectStatus)
              : undefined,
          tags:
            tagsFilter && typeof tagsFilter.value === 'string'
              ? tagsFilter.value
              : undefined,
          category:
            categoryFilter && typeof categoryFilter.value === 'string'
              ? categoryFilter.value
              : undefined,
          title:
            titleFilter && typeof titleFilter.value === 'string'
              ? titleFilter.value
              : undefined,
        },
      })
    },
    select: (data) => data,
  })

  const table = useReactTable({
    data: (transactionData?.data.projects as TData[]) ?? fallbackData,
    columns,
    manualSorting: true,
    manualFiltering: true,
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
