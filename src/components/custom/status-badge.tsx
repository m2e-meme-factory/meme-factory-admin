import { Badge } from '@/components/ui/badge.tsx'

export const StatusBadge = ({ status }: { status: string }) => {
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' =
    'default'

  switch (status.toLowerCase()) {
    case 'pending':
      badgeVariant = 'default'
      break
    case 'accepted':
      badgeVariant = 'secondary'
      break
    case 'rejected':
      badgeVariant = 'destructive'
      break
    default:
      badgeVariant = 'outline'
  }

  return <Badge variant={badgeVariant}>{status}</Badge>
}
