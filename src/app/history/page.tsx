'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	ChevronLeft,
	ChevronRight,
	Loader2,
	Trash2,
	MoreVertical,
} from 'lucide-react'
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
type Shift = {
	id: number
	started_at: string
	ended_at: string | null
	is_active: boolean
}

export default function HistoryPage() {
	const [shifts, setShifts] = useState<Shift[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [deleteId, setDeleteId] = useState<number | null>(null)

	const fetchShifts = () => {
		fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/shifts`)
			.then(res => res.json())
			.then(data =>
				setShifts(
					[...data].sort(
						(a: Shift, b: Shift) => Number(b.is_active) - Number(a.is_active),
					),
				),
			)
			.finally(() => setIsLoading(false))
	}

	useEffect(() => {
		fetchShifts()
	}, [])

	const deleteShift = async (id: number) => {
		await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/shifts/${id}`, {
			method: 'DELETE',
		})
		setDeleteId(null)
		fetchShifts()
	}

	return (
		<div className='grid gap-5'>
			<div className='flex items-center gap-2'>
				<Link href='/'>
					<Button variant='ghost' size='icon'>
						<ChevronLeft />
					</Button>
				</Link>
				<h1>История смен</h1>
			</div>

			{isLoading ? (
				<div className='flex justify-center py-8'>
					<Loader2 className='text-muted-foreground animate-spin' size={24} />
				</div>
			) : shifts.length === 0 ? (
				<p className='text-muted-foreground py-8 text-center text-sm'>
					Смен пока нет
				</p>
			) : (
				<ul className='grid gap-2'>
					{shifts.map(shift => (
						<li
							key={shift.id}
							className='border-border flex items-center justify-between rounded-xl border'
						>
							<Link
								href={`/history/${shift.id}`}
								className='flex flex-1 items-center justify-between p-4'
							>
								<div className='grid gap-0.5'>
									<span className='text-sm font-medium'>
										{new Date(shift.started_at).toLocaleDateString('ru-RU', {
											day: 'numeric',
											month: 'long',
											year: 'numeric',
										})}
									</span>
									<span className='text-muted-foreground text-xs'>
										{shift.is_active
											? 'Активная смена'
											: shift.ended_at
												? `Завершена в ${new Date(shift.ended_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
												: ''}
									</span>
								</div>
								<ChevronRight className='text-muted-foreground' size={16} />
							</Link>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant='ghost'
										size='icon'
										className='text-muted-foreground mr-1 shrink-0'
									>
										<MoreVertical size={16} />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem
										className='text-destructive focus:text-destructive'
										onClick={() => setDeleteId(shift.id)}
									>
										<Trash2 size={14} className='mr-2' />
										Удалить
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</li>
					))}
				</ul>
			)}

			<AlertDialog
				open={deleteId !== null}
				onOpenChange={open => !open && setDeleteId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Удалить смену?</AlertDialogTitle>
						<AlertDialogDescription>
							Все клиенты этой смены будут удалены. Это действие нельзя
							отменить.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Отмена</AlertDialogCancel>
						<AlertDialogAction
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
							onClick={() => deleteId && deleteShift(deleteId)}
						>
							Удалить
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
