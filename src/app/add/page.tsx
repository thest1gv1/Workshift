'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SERVICES } from '@/constants/services'
import { ClientType } from '@/store/shiftStore'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import { toast } from 'sonner'

function AddForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const id = searchParams.get('id')

	const [name, setName] = useState('')
	const [type, setType] = useState<ClientType>('issued')
	const [selectedServices, setSelectedServices] = useState<string[]>([])
	const [amounts, setAmounts] = useState<Record<string, number>>({})
	const [note, setNote] = useState('')

	

	const paidServices = SERVICES.filter(
		s => selectedServices.includes(s.id) && s.hasAmount,
	)

	const toggleService = (id: string) => {
		setSelectedServices(prev =>
			prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id],
		)
	}

	const handleSave = async () => {
		if (!name.trim()) return

		const data = { name, type, services: selectedServices, amounts, note }

		if (id) {
			await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/clients/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
		} else {
			await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/clients`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
		}

		toast.success(id ? 'Клиент обновлен' : 'Клиент добавлен')

		router.push('/')
	}

	useEffect(() => {
		if (!id) return

		fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/clients/${id}`)
			.then(res => res.json())
			.then(client => {
				setName(client.name)
				setType(client.type)
				setSelectedServices(client.services)
				setAmounts(client.amounts)
				setNote(client.note)
			})
	}, [id])

	return (
		<div className='grid gap-5'>
			<h1>Новый клиент</h1>
			<div className='grid gap-2'>
				<label
					htmlFor='name'
					className='text-muted-foreground text-xs tracking-wider uppercase'
				>
					фио клиента
				</label>
				<Input
					id='name'
					value={name}
					placeholder='Иванов И.И.'
					onChange={e => setName(e.target.value)}
				/>
			</div>

			<div className='grid gap-2'>
				<span className='text-muted-foreground text-xs tracking-wider uppercase'>
					Тип
				</span>

				<div className='text-muted-foreground grid grid-cols-3 gap-2'>
					<Button
						className={
							type === 'issued'
								? 'bg-primary/20! text-primary! border-primary/50!'
								: ''
						}
						size='lg'
						variant='outline'
						onClick={() => setType('issued')}
					>
						Выдано
					</Button>
					<Button
						className={
							type === 'transfer'
								? 'bg-amber/20! text-amber! border-amber/50!'
								: ''
						}
						size='lg'
						variant='outline'
						onClick={() => setType('transfer')}
					>
						Перенос
					</Button>
					<Button
						className={
							type === 'rejected'
								? 'bg-destructive/20! text-destructive! border-destructive/50!'
								: ''
						}
						size='lg'
						variant='outline'
						onClick={() => setType('rejected')}
					>
						Отказ
					</Button>
				</div>
			</div>

			<div className='grid gap-2'>
				<span className='text-muted-foreground text-xs tracking-wider uppercase'>
					Услуги
				</span>
				<div className='flex flex-wrap gap-2'>
					{SERVICES.map(service => (
						<span
							className={cn(
								'cursor-pointer rounded-full border px-3 py-1 text-xs',
								selectedServices.includes(service.id)
									? 'bg-primary/20 text-primary border-primary/50'
									: 'text-muted-foreground border-border',
							)}
							key={service.id}
							onClick={() => toggleService(service.id)}
						>
							{service.label}
						</span>
					))}
				</div>
			</div>

			<div className='grid gap-2'>
				<span className='text-muted-foreground text-xs tracking-wider uppercase'>
					Примечания
				</span>
				<div>
					<textarea
						className='bg-input/30 border-border text-foreground placeholder:text-muted-foreground focus:border-ring h-20 w-full resize-none rounded-lg border p-3 text-sm outline-none'
						value={note}
						placeholder='Проблемы, нет доступа к лк, арест...'
						onChange={e => setNote(e.target.value)}
					/>
				</div>
			</div>

			{paidServices.length > 0 && (
				<div className='grid gap-2'>
					<span className='text-muted-foreground text-xs tracking-wider uppercase'>
						Суммы по услугам
					</span>
					<div className='bg-card rounded-2xl p-4'>
						<ul className='grid gap-2'>
							{paidServices.map(service => (
								<li
									className='flex items-center justify-between gap-4'
									key={service.id}
								>
									<div className='flex items-center justify-between gap-2'>
										<span className='bg-primary h-2 w-2 rounded-full' />
										<span className='w-20'>{service.label}</span>
									</div>

									<Input
										className='flex-1'
										value={amounts[service.id] || ''}
										placeholder='0'
										onChange={e =>
											setAmounts(prev => ({
												...prev,
												[service.id]: Number(e.target.value),
											}))
										}
										type='number'
									/>
									<span className='text-muted-foreground'>₽</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}

			<Button size='lg' onClick={handleSave}>
				Сохранить клиента
			</Button>
		</div>
	)
}
export default function AddPage() {
	return (
		<Suspense>
			<AddForm />
		</Suspense>
	)
}
