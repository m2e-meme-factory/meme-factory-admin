import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/custom/data-table/data-table-faceted-filter'
import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options'
import { useState, useCallback, useMemo, ChangeEvent } from 'react'
import { USER_ROLE_OPTIONS } from '@/pages/users/data/user-roles'
import { BOOLEAN_OPTIONS } from '@/pages/users/data/boolean-options'
import { CreateDialog } from '@/pages/users/components/dialogs/create-dialog.tsx'

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
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [titleFilterInput, setTitleFilterInput] = useState<string>(
    (table.getColumn('username')?.getFilterValue() as string) ?? ''
  )

  const debouncedSetFilter = useMemo(
    () =>
      debounce((value: string) => {
        table.getColumn('username')?.setFilterValue(value)
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

  const refCodeOptions = useMemo(() => {
    const refCodeColumn = table.getColumn('refCode')
    if (!refCodeColumn) return []

    const uniqueValues = Array.from(
      refCodeColumn.getFacetedUniqueValues().keys()
    )
    return uniqueValues
      .filter((value): value is string => value != null && value !== '')
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({
        label: value,
        value: value,
      }))
  }, [table])

  return (
    <div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
      <div className='flex flex-col space-y-4 md:flex-row md:items-center md:space-x-2 md:space-y-0'>
        <div className='flex flex-wrap gap-2'>
          <Input
            placeholder='Filter users...'
            value={titleFilterInput}
            onChange={handleInputChange}
            className='h-8 w-[250px] lg:w-[300px]'
          />
          {table.getColumn('isBaned') && (
            <DataTableFacetedFilter
              column={table.getColumn('isBaned')}
              title='Banned'
              options={BOOLEAN_OPTIONS}
            />
          )}
          {table.getColumn('isVerified') && (
            <DataTableFacetedFilter
              column={table.getColumn('isVerified')}
              title='Verified'
              options={BOOLEAN_OPTIONS}
            />
          )}
          {table.getColumn('role') && (
            <DataTableFacetedFilter
              column={table.getColumn('role')}
              title='Role'
              options={USER_ROLE_OPTIONS}
            />
          )}
          {table.getColumn('refCode') && (
            <DataTableFacetedFilter
              column={table.getColumn('refCode')}
              title='RefCode'
              options={refCodeOptions}
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
      <div className='flex flex-row'>
        <Button
          variant='outline'
          size='sm'
          className='ml-auto mr-3 hidden h-8 lg:flex'
          onClick={() => setCreateModalVisible(true)}
        >
          <PlusIcon className='mr-2 h-4 w-4' />
          Create
        </Button>
        <CreateDialog
          onClose={() => setCreateModalVisible(false)}
          isOpen={createModalVisible}
        />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
