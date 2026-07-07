'use client'

import { Copy, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ClientRow from '@/components/shift/ClientRow'
import ShiftCard from '@/components/shift/ShiftCard'
import Link from 'next/link'
import { useStore } from '@nanostores/react'
import { settingsStore } from '@/store/settingsStore'
import { generateReport } from '@/lib/report'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Client } from '@/types/client'
import { shiftStore } from '@/store/shiftStore'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Home() {
	const settings = useStore(settingsStore)
	const activeShift = useStore(shiftStore)
	const [clients, setClients] = useState<Client[]>([])

	//временно решение потому что серв на http
	const copyReport = (text: string) => {
		const textarea = document.createElement('textarea')
		textarea.value = text
		document.body.appendChild(textarea)
		textarea.select()
		document.execCommand('copy')
		document.body.removeChild(textarea)
	}

	const startShift = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/shifts`, {
			method: 'POST',
		})
		const shift = await res.json()
		shiftStore.set(shift)
	}

	const endShift = async () => {
		await fetch(
			`${process.env.NEXT_PUBLIC_BASE_PATH}/api/shifts/${activeShift!.id}`,
			{
				method: 'PATCH',
			},
		)
		shiftStore.set(null)
		setClients([])
	}

	const fetchClients = (shiftId: number) => {
		fetch(
			`${process.env.NEXT_PUBLIC_BASE_PATH}/api/clients?shift_id=${shiftId}`,
		)
			.then(res => res.json())
			.then(data => setClients(data))
	}

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/shifts/active`)
			.then(res => res.json())
			.then(shift => {
				shiftStore.set(shift)
				if (shift) fetchClients(shift.id)
			})
	}, [])

	return (
		<>
			{activeShift === null ? (
				<div className='flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center pt-24'>
					<div className='grid gap-1'>
						<h1 className='text-2xl font-semibold'>Добрый день</h1>
						<p className='text-muted-foreground text-sm'>{settings.name || 'Сотрудник'}</p>
					</div>
					<Button size='lg' onClick={startShift} className='w-full max-w-xs'>
						Начать смену
					</Button>
				</div>
			) : (
				<div className='grid gap-5'>
					<div className='flex justify-between gap-2'>
						<div className='grid gap-0.5'>
							<p className='text-muted-foreground text-xs uppercase'>
								Добрый день
							</p>
							<h1 className='text-lg'>{settings.name || 'Сотрудник'}</h1>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className='text-primary-foreground from-primary to-accent2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-linear-to-br text-xs font-semibold'>
									{settings.name
										.split(' ')
										.slice(0, 2)
										.map(w => w[0])
										.join('')
										.toUpperCase() || 'АВ'}
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								<DropdownMenuItem asChild>
									<Link href='/history'>История смен</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<ShiftCard clients={clients} plan={settings.plan} />

					<div className='grid gap-3'>
						<h2>Клиенты</h2>

						{clients.length === 0 ? (
							<p className='text-muted-foreground py-8 text-center text-sm'>
								Клиентов нет — нажмите «Добавить клиента»
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
										fetchClients={() => fetchClients(activeShift!.id)}
									/>
								))}
							</ul>
						)}
					</div>

					<div className='grid gap-2'>
						<Link href='/add'>
							<Button size='lg' className='w-full'>
								<Plus />
								Добавить клиента
							</Button>
						</Link>

						<Button
							size='lg'
							variant='outline'
							onClick={() => {
								// await navigator.clipboard.writeText(
								// 	generateReport(clients, settings),
								// )
								// toast.success('Отчёт скопирован')

								copyReport(generateReport(clients, settings))
								toast.success('Отчёт скопирован')
							}}
						>
							{' '}
							<Copy /> Скопировать отчет
						</Button>
						<Button size='lg' variant='destructive' className='w-full' onClick={endShift}>
								Завершить смену
							</Button>
					</div>
				</div>
			)}
		</>
	)
}
