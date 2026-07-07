'use client'

import { Badge } from '@/components/ui/badge'
import { SERVICES } from '@/constants/services'
import { Button } from '../ui/button'
import { Trash2, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ClientRowProps {
	id: string
	name: string
	index: number
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
	index,
	name,
	services,
	type,
	note,
	fetchClients,
}: ClientRowProps) {
	const [confirmOpen, setConfirmOpen] = useState(false)

	const handleDelete = async () => {
		await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/clients/${id}`, {
			method: 'DELETE',
		})
		fetchClients()
		toast.success('Клиент удалён')
	}

	return (
		<>
			<li className='bg-card border-border flex items-center gap-2 overflow-hidden rounded-xl border p-4 transition-colors duration-150'>
				<Link
					href={'/add?id=' + id}
					className='flex min-w-0 flex-1 items-center gap-2'
				>
					<div className='bg-primary/20 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs'>
						<span>{index}</span>
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

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon' className='text-muted-foreground shrink-0'>
							<MoreVertical size={16} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem
							className='text-destructive focus:text-destructive'
							onClick={() => setConfirmOpen(true)}
						>
							<Trash2 size={14} className='mr-2' />
							Удалить
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</li>

			<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Удалить клиента?</AlertDialogTitle>
						<AlertDialogDescription>
							Это действие нельзя отменить.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Отмена</AlertDialogCancel>
						<AlertDialogAction
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
							onClick={handleDelete}
						>
							Удалить
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
