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

export default function Home() {
	// const clients = useStore(clientsStore)
	const settings = useStore(settingsStore)
const [clients, setClients] = useState<Client[]>([])

	const fetchClients = () => {
		fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/clients`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then(res => res.json())
			.then(data => setClients(data))
	}

	useEffect(() => {
		
			
			fetchClients()
		
	}, [])

return (
		<div className='grid gap-5'>
			<div className='flex justify-between gap-2'>
				<div className='grid gap-0.5'>
					<p className='text-muted-foreground text-xs uppercase'>Добрый день</p>
					<h1 className='text-lg'>{settings.name || 'Сотрудник'}</h1>
				</div>
				<div className='text-primary-foreground from-primary to-accent2 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br text-xs font-semibold'>
					АВ
				</div>
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
						{clients.map(client => (
							<ClientRow
								key={String(client.id)}
								id={client.id}
								name={client.name}
								services={client.services}
								type={client.type}
								fetchClients={fetchClients}
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
					onClick={async () => {
						await navigator.clipboard.writeText(
							generateReport(clients, settings),
						)
						toast.success('Отчёт скопирован')
					}}
				>
					{' '}
					<Copy /> Скопировать отчет
				</Button>
			</div>
		</div>
	)
}
