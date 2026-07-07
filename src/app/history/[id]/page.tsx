'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Copy, Plus } from 'lucide-react'
import { Client } from '@/types/client'
import ClientRow from '@/components/shift/ClientRow'
import ShiftCard from '@/components/shift/ShiftCard'
import { useStore } from '@nanostores/react'
import { settingsStore } from '@/store/settingsStore'
import { generateReport } from '@/lib/report'
import { toast } from 'sonner'

type Shift = {
	id: number
	started_at: string
	ended_at: string | null
	is_active: boolean
}

export default function ShiftDetailPage() {
	const { id } = useParams<{ id: string }>()
	const router = useRouter()
	const settings = useStore(settingsStore)
	const [shift, setShift] = useState<Shift | null>(null)
	const [clients, setClients] = useState<Client[]>([])

	const fetchData = () => {
		fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/shifts/${id}`)
			.then(res => res.json())
			.then(data => {
				setShift(data.shift)
				setClients(data.clients)
			})
	}

	useEffect(() => {
		fetchData()
	}, [id])

	const endShift = async () => {
		await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/shifts/${id}`, {
			method: 'PATCH',
		})
		router.push('/history')
	}

	return (
		<div className='grid gap-5'>
			<div className='flex items-center gap-2'>
				<Link href='/history'>
					<Button variant='ghost' size='icon'>
						<ChevronLeft />
					</Button>
				</Link>
				<h1 className='text-lg'>
					{shift
						? new Date(shift.started_at).toLocaleDateString('ru-RU', {
								day: 'numeric',
								month: 'long',
							})
						: '...'}
				</h1>
			</div>

			<ShiftCard clients={clients} plan={settings.plan} />

			<div className='grid gap-3'>
				<h2>Клиенты</h2>
				{clients.length === 0 ? (
					<p className='text-muted-foreground py-8 text-center text-sm'>
						Клиентов нет
					</p>
				) : (
					<ul className='grid gap-2'>
						{clients.map((client, i) => (
							<ClientRow
								key={String(client.id)}
								id={client.id}
								index={i + 1}
								name={client.name}
								services={client.services}
								type={client.type}
								note={client.note}
								fetchClients={fetchData}
							/>
						))}
					</ul>
				)}
			</div>

			<div className='grid gap-2'>
				<Link href={`/add?shift_id=${id}`}>
					<Button size='lg' className='w-full'>
						<Plus />
						Добавить клиента
					</Button>
				</Link>
				<Button
					size='lg'
					variant='outline'
					onClick={() => {
						const textarea = document.createElement('textarea')
						textarea.value = generateReport(clients, settings)
						document.body.appendChild(textarea)
						textarea.select()
						document.execCommand('copy')
						document.body.removeChild(textarea)
						toast.success('Отчёт скопирован')
					}}
				>
					<Copy /> Скопировать отчет
				</Button>
				<Button size='lg' variant='destructive' className='w-full' onClick={endShift}>
					Завершить смену
				</Button>
			</div>
		</div>
	)
}
