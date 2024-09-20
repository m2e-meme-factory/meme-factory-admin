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
import { useToast } from '@/components/ui/use-toast.ts'
import { useState } from 'react'
import { Spinner } from '@/components/custom/spinner.tsx'
import { getProgresses } from '@/data/requests/project-progress/get-progresses.ts'
import { ProjectStatus } from '@/pages/project-progresses/data/schema.ts'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  fallbackData: TData[]
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

  const {
    data: progresses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['progresses', pagination, sorting, columnFilters],
    queryFn: () => {
      const userFilter = columnFilters.find((column) => column.id === 'userId')
      const projectFilter = columnFilters.find(
        (column) => column.id === 'projectId'
      )
      const statusFilter = columnFilters.find(
        (column) => column.id === 'status'
      )

      return getProgresses({
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          sortBy: sorting.map((s) => s.id),
          sortOrder: sorting.map((s) => (s.desc ? 'desc' : 'asc')),
          status:
            statusFilter && typeof statusFilter.value === 'string'
              ? (statusFilter.value as ProjectStatus)
              : undefined,
          userId: userFilter ? Number(userFilter.value) : undefined,
          projectId: projectFilter ? Number(projectFilter.value) : undefined,
        },
      })
    },
    select: (data) => data,
  })

  const { toast } = useToast()
  const totalItems = progresses?.data?.total ?? 0

  const table = useReactTable({
    data: (progresses?.data.progressProjects as TData[]) ?? fallbackData,
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
