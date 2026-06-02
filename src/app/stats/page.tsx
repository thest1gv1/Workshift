'use client'

import StatBox from '@/components/shift/StatBox'
import { SERVICES } from '@/constants/services'
import { clientsStore } from '@/store/shiftStore'
import { useStore } from '@nanostores/react'

export default function StatsPage() {
	const clients = useStore(clientsStore)
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
					<ul className='grid gap-2'>
						{SERVICES.filter(service => countService(service.id) > 0)
							.sort((a, b) => countService(b.id) - countService(a.id))
							.map(service => (
								<li
									className='bg-card flex items-center justify-between rounded-lg p-3'
									key={service.id}
								>
									<span className='text-muted-foreground'>{service.label}</span>
									<span className='text-primary font-semibold'>
										{countService(service.id)}
									</span>
								</li>
							))}
					</ul>
				</div>
			</div>
		</div>
	)
}
