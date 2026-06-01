import { Badge } from '@/components/ui/badge'
import { SERVICES } from '@/constants/services'
import { Button } from '../ui/button'
import { deleteClient } from '@/store/shiftStore'
import { Trash2 } from 'lucide-react'

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
		<li className='bg-card border-border active:bg-secondary/80 flex items-center gap-2 rounded-xl border p-4 transition-colors duration-150'>
			<div className='bg-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-lg text-xs'>
				<span>{name[0].toUpperCase()}</span>
			</div>
			<div>
				<p className='text-sm'>{name}</p>
				<p className='text-muted-foreground text-xs'>
					{services
						.map(id => SERVICES.find(s => s.id === id)?.label ?? id)
						.join(', ')}
				</p>
			</div>
			<div className='ml-auto'>
				<Badge variant={badgeVariant[type]}>{badgeLabel[type]}</Badge>
			</div>
			<Button variant='ghost' size='icon' onClick={() => deleteClient(id)}>
				<Trash2 className='text-muted-foreground h-4 w-4' />
			</Button>
		</li>
	)
}
