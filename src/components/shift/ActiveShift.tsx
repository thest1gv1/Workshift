import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'
import ShiftClientsSection from '@/components/shift/ShiftClientsSection'
import { Settings } from '@/store/settingsStore'
import { ClientInterface } from '@/types/client'

interface ActiveShiftProps {
	settings: Settings
	clients: ClientInterface[]
	clientsLoading: boolean
	onFetchClients: () => void
	onEndShift: () => void
	isEnding: boolean
}

export default function ActiveShift({
	clients,
	clientsLoading,
	settings,
	onFetchClients,
	onEndShift,
	isEnding,
}: ActiveShiftProps) {
	return (
		<div className='grid gap-5'>
			<div className='flex justify-between gap-2'>
				<div className='grid gap-0.5'>
					<p className='text-muted-foreground text-xs uppercase'>Добрый день</p>
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

			<ShiftClientsSection
				clients={clients}
				clientsLoading={clientsLoading}
				settings={settings}
				addHref='/add'
				onFetchClients={onFetchClients}
				endShiftSlot={
					<Button
						size='lg'
						variant='destructive'
						className='w-full'
						onClick={onEndShift}
						disabled={isEnding}
					>
						{isEnding ? <Loader2 className='animate-spin' /> : <LogOut />}
						Завершить смену
					</Button>
				}
			/>
		</div>
	)
}
