import { Badge } from '@/components/ui/badge'
import { SERVICES } from '@/constants/services'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface ClientRowProps {
	id: string
	name: string
	services: string[]
	type: 'issued' | 'transfer' | 'rejected'
	note?: string
	fetchClients: () => void
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
	note,
	fetchClients,
}: ClientRowProps) {
	const handleDelete = async () => {
		await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/clients/${id}`, {
			method: 'DELETE',
		})
		fetchClients()
		toast.success('Клиент удалён')
	}

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
					<p className='flex items-center gap-1.5 text-sm'>
						{name}
						{note?.trim() && <span className='bg-amber h-2 w-2 shrink-0 rounded-full' />}
					</p>
					<p className='text-muted-foreground truncate text-xs'>
						{services
							.map(id => SERVICES.find(s => s.id === id)?.label ?? id)
							.join(', ')}
					</p>
				</div>
				<Badge variant={badgeVariant[type]}>{badgeLabel[type]}</Badge>
			</Link>
			<Button variant='ghost' size='icon' onClick={handleDelete}>
				<Trash2 className='text-muted-foreground h-4 w-4' />
			</Button>
		</li>
	)
}
