'use client'

import StatBox from '@/components/shift/StatBox'
import { SERVICES } from '@/constants/services'
import { Client } from '@/types/client'

import { useEffect, useState } from 'react'

export default function StatsPage() {
	const [clients, setСlients] = useState<Client[]>([])

	const fetchClients = () => {
		fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/clients`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then(res => res.json())
			.then(data => setСlients(data))
	}

	useEffect(() => {
		fetchClients()
	}, [])

	const issued = clients.filter(c => c.type === 'issued').length

	const countService = (id: string) =>
		clients.filter(c => c.services.includes(id)).length

	return (
		<div className='grid gap-5'>
			<h1>Статистика</h1>
			<div className='grid grid-cols-2 gap-2'>
				<StatBox value={issued} label='Выдано' />
				<StatBox value={clients.length} label='Клиентопоток' />
			</div>

			<div className='grid gap-2'>
				<span className='text-muted-foreground text-xs tracking-wider uppercase'>
					Услуги
				</span>
				<div>
					{clients.length === 0 ? (
						<p className='text-muted-foreground py-8 text-center text-sm'>
							Нет данных за текущую смену
						</p>
					) : (
						<ul className='grid gap-2'>
							{SERVICES.filter(service => countService(service.id) > 0)
								.sort((a, b) => countService(b.id) - countService(a.id))
								.map(service => (
									<li
										className='bg-card flex items-center justify-between rounded-lg p-3'
										key={service.id}
									>
										<span className='text-muted-foreground'>
											{service.label}
										</span>
										<span className='text-primary font-semibold'>
											{countService(service.id)}
										</span>
									</li>
								))}
						</ul>
					)}
				</div>
			</div>
		</div>
	)
}
