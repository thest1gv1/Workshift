'use client'

import { SERVICES } from '@/constants/services'
import { ClientInterface } from '@/types/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import StatsListSkeleton from '@/components/shift/StatsListSkeleton'

function toMonthKey(date: Date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function formatMonthLabel(key: string) {
	const [year, month] = key.split('-')
	const date = new Date(Number(year), Number(month) - 1)
	return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
}

export default function StatsPage() {
	const [clients, setClients] = useState<ClientInterface[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [month, setMonth] = useState(toMonthKey(new Date()))
	const [asc, setAsc] = useState(false)

	useEffect(() => {
		setIsLoading(true)
		fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/clients?month=${month}`)
			.then(res => res.json())
			.then(data => setClients(data))
			.finally(() => setIsLoading(false))
	}, [month])

	const prevMonth = () => {
		const [y, m] = month.split('-').map(Number)
		const d = new Date(y, m - 2)
		setMonth(toMonthKey(d))
	}

	const nextMonth = () => {
		const [y, m] = month.split('-').map(Number)
		const d = new Date(y, m)
		setMonth(toMonthKey(d))
	}

	const countService = (id: string) =>
		clients.filter(c => c.services.includes(id)).length

	return (
		<div className='grid gap-5'>
			<h1>Статистика</h1>

			<div className='flex items-center justify-between gap-2'>
				<Button variant='ghost' size='icon' onClick={prevMonth}>
					<ChevronLeft />
				</Button>
				<span className='text-sm font-medium capitalize'>
					{formatMonthLabel(month)}
				</span>
				<Button variant='ghost' size='icon' onClick={nextMonth}>
					<ChevronRight />
				</Button>
			</div>

			<div className='grid gap-2'>
				<div className='flex items-center justify-between'>
					<span className='text-muted-foreground text-xs tracking-wider uppercase'>
						Услуги
					</span>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => setAsc(v => !v)}
						className='text-muted-foreground gap-1 text-xs'
					>
						<ArrowUpDown size={12} />
						{asc ? 'По возрастанию' : 'По убыванию'}
					</Button>
				</div>
				{isLoading ? (
					<StatsListSkeleton />
				) : clients.length === 0 ? (
					<p className='text-muted-foreground py-8 text-center text-sm'>
						Нет данных за этот месяц
					</p>
				) : (
					<ul className='grid gap-2'>
						{SERVICES.filter(service => countService(service.id) > 0)
							.sort((a, b) =>
								asc
									? countService(a.id) - countService(b.id)
									: countService(b.id) - countService(a.id),
							)
							.map(service => (
								<li
									className='bg-card flex items-center justify-between rounded-lg p-3'
									key={service.id}
								>
									<span className='text-muted-foreground'>{service.label}</span>
									<span className='font-semibold'>
										{countService(service.id)}
									</span>
								</li>
							))}
					</ul>
				)}
			</div>
		</div>
	)
}
