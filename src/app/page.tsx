'use client'

import { Copy, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ClientRow from '@/components/shift/ClientRow'
import ShiftCard from '@/components/shift/ShiftCard'
import Link from 'next/link'
import { useStore } from '@nanostores/react'
import { settingsStore } from '@/store/settingsStore'
import { clientsStore } from '@/store/shiftStore'
import { generateReport } from '@/lib/report'
import { toast } from 'sonner'

export default function Home() {
	const clients = useStore(clientsStore)
	const settings = useStore(settingsStore)

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

			<ShiftCard plan={settings.plan} />

			<div className='grid gap-3'>
				<h2>Клиенты</h2>
				<ul className='grid gap-2'>
					{clients.map(client => (
						<ClientRow
							key={client.id}
							id={client.id}
							name={client.name}
							services={client.services}
							type={client.type}
						/>
					))}
				</ul>
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
