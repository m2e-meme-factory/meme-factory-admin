import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SearchParams } from '@/types/api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const createQueryParams = (params?: SearchParams): string => {
  const queryParams = new URLSearchParams()

  if (params) {
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())

    if (params.sortBy && params.sortBy.length > 0) {
      params.sortBy.forEach((value) => queryParams.append('sortBy', value))
    }

    if (params.sortOrder && params.sortOrder.length > 0) {
      params.sortOrder.forEach((value) =>
        queryParams.append('sortOrder', value)
      )
    }
  }

  return queryParams.toString() ? `?${queryParams.toString()}` : ''
}
