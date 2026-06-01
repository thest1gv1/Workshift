'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SERVICES } from '@/constants/services'
import { addClient, ClientType } from '@/store/shiftStore'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddPage() {
	const router = useRouter()

	const [name, setName] = useState('')
	const [type, setType] = useState<ClientType>('issued')
	const [selectedServices, setSelectedServices] = useState<string[]>([])
	const [note, setNote] = useState('')

	console.log(selectedServices)

	const toggleService = (id: string) => {
		setSelectedServices(prev =>
			prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id],
		)
	}

	const handleSave = () => {
		if (!name.trim()) return

		addClient({
			name,
			type,
			services: selectedServices,
			note,
		})

		router.push('/')
	}

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

			<Button size='lg' onClick={handleSave}>
				Сохранить клиента
			</Button>
		</div>
	)
}
