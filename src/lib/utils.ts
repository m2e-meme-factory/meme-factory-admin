import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const createQueryParams = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams()

  Object.keys(params).forEach((key) => {
    const value = params[key]

    if (Array.isArray(value)) {
      value.forEach((val) => searchParams.append(key, val))
    } else if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })

  return searchParams.toString() ? `?${searchParams.toString()}` : ''
}

export function extractFileNameAndExtension(input: string) {
  const uuidLength = 36

  if (!input || input.trim().length === 0) {
    return null
  }

  let fileNameWithExt = input
  if (input.length > uuidLength && input[uuidLength] === '_') {
    fileNameWithExt = input.slice(uuidLength + 1) // Убираем UUID и '_'
  }

  const lastDotIndex = fileNameWithExt.lastIndexOf('.')
  if (lastDotIndex === -1) {
    return null
  }

  const filename = fileNameWithExt.slice(0, lastDotIndex)
  const extension = fileNameWithExt.slice(lastDotIndex + 1)

  return {
    filename,
    extension,
  }
}
