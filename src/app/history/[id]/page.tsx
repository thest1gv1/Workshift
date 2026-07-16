'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Loader2, LogOut } from 'lucide-react'
import { ClientInterface } from '@/types/client'
import ShiftClientsSection from '@/components/shift/ShiftClientsSection'
import { Skeleton } from '@/components/ui/skeleton'
import { useStore } from '@nanostores/react'
import { settingsStore } from '@/store/settingsStore'

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
	const [clients, setClients] = useState<ClientInterface[]>([])
	const [isEnding, setIsEnding] = useState(false)

	const fetchData = useCallback(() => {
		fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/shifts/${id}`)
			.then(res => res.json())
			.then(data => {
				setShift(data.shift)
				setClients(data.clients)
			})
	}, [id])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const endShift = async () => {
		setIsEnding(true)
		try {
			await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/shifts/${id}`, {
				method: 'PATCH',
			})
			router.push('/history')
		} finally {
			setIsEnding(false)
		}
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
					{shift ? (
						new Date(shift.started_at).toLocaleDateString('ru-RU', {
							day: 'numeric',
							month: 'long',
						})
					) : (
						<Skeleton className='h-6 w-24' />
					)}
				</h1>
			</div>

			<ShiftClientsSection
				clients={clients}
				settings={settings}
				addHref={`/add?shift_id=${id}`}
				onFetchClients={fetchData}
				endShiftSlot={
					<Button
						size='lg'
						variant='destructive'
						className='w-full'
						onClick={endShift}
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
