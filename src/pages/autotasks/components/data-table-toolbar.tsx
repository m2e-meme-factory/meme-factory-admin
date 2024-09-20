import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/custom/data-table/data-table-faceted-filter'
import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options'
import { useState, useCallback, useMemo, ChangeEvent } from 'react'
import { BOOLEAN_OPTIONS } from '@/pages/users/data/boolean-options.ts'
import { DataTableRangeFilter } from '@/components/custom/data-table/data-table-range-filter.tsx'

function debounce<T extends (...args: string[]) => void>(
  func: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const [titleFilterInput, setTitleFilterInput] = useState<string>(
    (table.getColumn('title')?.getFilterValue() as string) ?? ''
  )

  const debouncedSetFilter = useMemo(
    () =>
      debounce((value: string) => {
        table.getColumn('title')?.setFilterValue(value)
      }, 500),
    [table]
  )

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setTitleFilterInput(value)
      debouncedSetFilter(value)
    },
    [debouncedSetFilter]
  )

  return (
    <div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
      <div className='flex flex-col space-y-4 md:flex-row md:items-center md:space-x-2 md:space-y-0'>
        <div className='flex flex-wrap gap-2'>
          <Input
            placeholder='Filter autotasks...'
            value={titleFilterInput}
            onChange={handleInputChange}
            className='h-8 w-[250px] lg:w-[300px]'
          />
          {table.getColumn('isIntegrated') && (
            <DataTableFacetedFilter
              column={table.getColumn('isIntegrated')}
              title='Integrated'
              options={BOOLEAN_OPTIONS}
            />
          )}
          {table.getColumn('reward') && (
            <DataTableRangeFilter
              column={table.getColumn('reward')}
              title='Price Range'
            />
          )}
        </div>
      </div>
      {isFiltered && (
        <Button
          variant='ghost'
          onClick={() => {
            table.resetColumnFilters()
            setTitleFilterInput('')
          }}
          className='mr-3 h-8 px-2 lg:px-3'
        >
          Reset
          <Cross2Icon className='ml-2 h-4 w-4' />
        </Button>
      )}
      <DataTableViewOptions table={table} />
    </div>
  )
}
