import * as React from 'react'
import { Column } from '@tanstack/react-table'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/custom/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'

interface DataTableInputFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
}

export function DataTableInputFilter<TData, TValue>({
  column,
  title,
}: DataTableInputFilterProps<TData, TValue>) {
  const [value, setValue] = React.useState<string>('')

  const filterValue = column?.getFilterValue() as string

  const applyFilter = () => {
    column?.setFilterValue(value || undefined)
  }

  React.useEffect(() => {
    setValue(filterValue || '')
  }, [filterValue])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          {title}
          {filterValue && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal'
              >
                {filterValue}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <div className='space-y-2 p-2'>
          <Input
            placeholder={`Filter ${title}...`}
            value={value}
            onChange={(e) =>
              setValue(!isNaN(Number(e.target.value)) ? e.target.value : '')
            }
            className='h-8'
          />
          <div className='flex justify-between'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                setValue('')
                column?.setFilterValue(undefined)
              }}
              className='text-xs'
            >
              Clear
            </Button>
            <Button size='sm' onClick={applyFilter} className='text-xs'>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
