import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/custom/data-table/data-table-faceted-filter'
import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options'
import { PROJECT_STATUSES_OPTIONS } from '@/pages/projects/data/schema'
import { CATEGORIES } from '@/pages/projects/data/categories'
import { TAGS } from '@/pages/projects/data/tags'
import { useState, useCallback, useMemo, ChangeEvent } from 'react'

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
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter projects...'
          value={titleFilterInput}
          onChange={handleInputChange}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={PROJECT_STATUSES_OPTIONS}
            />
          )}
          {table.getColumn('tags') && (
            <DataTableFacetedFilter
              column={table.getColumn('tags')}
              title='Tags'
              options={TAGS}
            />
          )}
          {table.getColumn('category') && (
            <DataTableFacetedFilter
              column={table.getColumn('category')}
              title='Category'
              options={CATEGORIES}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              setTitleFilterInput('')
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
