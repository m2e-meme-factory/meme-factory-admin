import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SearchParams } from '@/types/api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const createQueryParams = (params?: SearchParams): string => {
  const queryParams = new URLSearchParams()

  if (params) {
    if (params.search) queryParams.append('search', params.search)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.sortBy) queryParams.append('sortBy', params.sortBy.join(','))
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)
  }

  return queryParams.toString() ? `?${queryParams.toString()}` : ''
}
