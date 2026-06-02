import { Badge } from '@/components/ui/badge'
import { SERVICES } from '@/constants/services'
import { Button } from '../ui/button'
import { deleteClient } from '@/store/shiftStore'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface ClientRowProps {
	id: string
	name: string
	services: string[]
	type: 'issued' | 'transfer' | 'rejected'
}

const badgeVariant: Record<
	ClientRowProps['type'],
	'default' | 'secondary' | 'destructive'
> = {
	issued: 'default',
	transfer: 'secondary',
	rejected: 'destructive',
}

const badgeLabel = {
	issued: 'Выдано',
	transfer: 'Перенос',
	rejected: 'Отказ',
}

export default function ClientRow({
	id,
	name,
	services,
	type,
}: ClientRowProps) {
	return (
		<li className='bg-card border-border active:bg-secondary/80 flex items-center gap-2 overflow-hidden rounded-xl border p-4 transition-colors duration-150'>
			<Link
				href={'/add?id=' + id}
				className='flex min-w-0 flex-1 items-center gap-2'
			>
				<div className='bg-primary/20 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs'>
					<span>{name[0].toUpperCase()}</span>
				</div>
				<div className='min-w-0 flex-1 overflow-hidden'>
					<p className='text-sm'>{name}</p>
					<p className='text-muted-foreground truncate text-xs'>
						{services
							.map(id => SERVICES.find(s => s.id === id)?.label ?? id)
							.join(', ')}
					</p>
				</div>
				<Badge variant={badgeVariant[type]}>{badgeLabel[type]}</Badge>
			</Link>
			<Button
				variant='ghost'
				size='icon'
				onClick={() => {
					deleteClient(id)
					toast.success('Клиент удалён')
				}}
			>
				<Trash2 className='text-muted-foreground h-4 w-4' />
			</Button>
		</li>
	)
}
