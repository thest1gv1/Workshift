'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Copy, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import ShiftCard from '@/components/shift/ShiftCard'
import ClientRow from '@/components/shift/ClientRow'
import { copyReport, generateReport } from '@/lib/report'
import { ClientInterface } from '@/types/client'
import { Settings } from '@/store/settingsStore'

interface ShiftClientsSectionProps {
	clients: ClientInterface[]
	clientsLoading?: boolean
	settings: Settings
	addHref: string
	onFetchClients: () => void
	endShiftSlot?: React.ReactNode
}

export default function ShiftClientsSection({
	clients,
	clientsLoading = false,
	settings,
	addHref,
	onFetchClients,
	endShiftSlot,
}: ShiftClientsSectionProps) {
	return (
		<>
			<ShiftCard clients={clients} plan={settings.plan} />

			<div className='grid gap-3'>
				<h2>Клиенты</h2>

				{clientsLoading ? (
					<div className='flex justify-center py-8'>
						<Loader2 className='text-muted-foreground animate-spin' size={24} />
					</div>
				) : clients.length === 0 ? (
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
								fetchClients={onFetchClients}
							/>
						))}
					</ul>
				)}
			</div>

			{/* высота-распорка под фиксированную панель кнопок ниже */}
			<div className='h-44' />

			<div className='bg-background fixed inset-x-0 bottom-16 z-10'>
				<div className='border-border mx-auto grid w-full max-w-2xl gap-2 border-t px-4 pt-3 pb-4'>
					<Link href={addHref}>
						<Button size='lg' className='w-full'>
							<Plus />
							Добавить клиента
						</Button>
					</Link>

					<Button
						size='lg'
						variant='outline'
						onClick={() => {
							copyReport(generateReport(clients, settings))
							toast.success('Отчёт скопирован')
						}}
					>
						<Copy /> Скопировать отчет
					</Button>

					{endShiftSlot}
				</div>
			</div>
		</>
	)
}
