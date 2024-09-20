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
import { Label } from '@/components/ui/label'

interface DataTableRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
}

export function DataTableRangeFilter<TData, TValue>({
  column,
  title,
}: DataTableRangeFilterProps<TData, TValue>) {
  const [from, setFrom] = React.useState<string>('')
  const [to, setTo] = React.useState<string>('')

  const filterValue = column?.getFilterValue() as
    | { from?: number; to?: number }
    | undefined

  const applyFilter = () => {
    const rangeFilter = {
      from: from ? Number(from) : undefined,
      to: to ? Number(to) : undefined,
    }
    column?.setFilterValue(rangeFilter)
  }

  React.useEffect(() => {
    if (filterValue) {
      setFrom(filterValue.from?.toString() || '')
      setTo(filterValue.to?.toString() || '')
    } else {
      setFrom('')
      setTo('')
    }
  }, [filterValue])

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (value === '' || !isNaN(Number(value))) {
        setter(value)
      }
    }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          {title}
          {filterValue && (filterValue.from || filterValue.to) && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal'
              >
                {filterValue.from ?? '*'} - {filterValue.to ?? '*'}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0' align='start'>
        <div className='space-y-4 p-4'>
          <div className='space-y-2'>
            <Label htmlFor='from'>From</Label>
            <Input
              id='from'
              placeholder={`Min ${title}`}
              value={from}
              onChange={handleInputChange(setFrom)}
              className='h-8'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='to'>To</Label>
            <Input
              id='to'
              placeholder={`Max ${title}`}
              value={to}
              onChange={handleInputChange(setTo)}
              className='h-8'
            />
          </div>
          <div className='flex justify-between'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                setFrom('')
                setTo('')
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
