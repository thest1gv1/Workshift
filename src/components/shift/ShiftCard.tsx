'use client'

import StatBox from '@/components/shift/StatBox'
import { clientsStore } from '@/store/shiftStore'
import { useStore } from '@nanostores/react'

interface ShiftCardProps {
	plan: number
}

export default function ShiftCard({ plan }: ShiftCardProps) {
	const clients = useStore(clientsStore)
	const issued = clients.filter(c => c.type === 'issued').length
	const transfers = clients.filter(c => c.type === 'transfer').length
	const progress =
		plan > 0 ? Math.min(100, Math.round((issued / plan) * 100)) : 0

	const now = new Date() 
	const days = [
		'Воскресенье',
		'Понедельник',
		'Вторник',
		'Среда',
		'Четверг',
		'Пятница',
		'Суббота',
	]
	const months = [
		'января',
		'февраля',
		'марта',
		'апреля',
		'мая',
		'июня',
		'июля',
		'августа',
		'сентября',
		'октября',
		'ноября',
		'декабря',
	]
	const date = `${days[now.getDay()]},  ${now.getDate()} ${months[now.getMonth()]}`

	return (
		<div className='bg-card border-border grid gap-4 rounded-2xl border p-5'>
			<div className='grid gap-0.5'>
				<p className='text-muted-foreground text-xs uppercase'>Текущая смена</p>
				<h2>{date}</h2>
			</div>

			<div className='grid grid-cols-3 gap-2'>
				<StatBox value={issued} label='Выдано' />
				<StatBox value={transfers} label='Переносы' />
				<StatBox value={clients.length} label='Клиенты' />
			</div>

			<div className='grid gap-2'>
				<div className='text-muted-foreground flex justify-between text-xs'>
					<span>План выполнен</span>
					<span>
						{issued} / {plan}
					</span>
				</div>
				<div className='bg-secondary h-1 rounded-full'>
					<div
						className='from-primary to-accent2 h-full rounded-full bg-linear-to-r transition-all duration-300'
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
		</div>
	)
}
