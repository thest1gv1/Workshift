'use client'

import { useStore } from '@nanostores/react'
import { settingsStore } from '@/store/settingsStore'
import { useEffect, useState } from 'react'
import { ClientInterface } from '@/types/client'
import { shiftStore, shiftLoadedStore } from '@/store/shiftStore'
import ShiftStart from '@/components/shift/ShiftStart'
import ActiveShift from '@/components/shift/ActiveShift'
import { Loader2 } from 'lucide-react'

export default function Home() {
	const settings = useStore(settingsStore)
	const activeShift = useStore(shiftStore)
	const isLoaded = useStore(shiftLoadedStore)

	const [isStarting, setIsStarting] = useState(false)
	const [isEnding, setIsEnding] = useState(false)
	const [clientsLoading, setClientsLoading] = useState(true)
	const [clients, setClients] = useState<ClientInterface[]>([])

	const startShift = async () => {
		setIsStarting(true)
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BASE_PATH}/api/shifts`,
				{
					method: 'POST',
				},
			)
			const shift = await res.json()
			shiftStore.set(shift)
		} finally {
			setIsStarting(false)
		}
	}

	const endShift = async () => {
		setIsEnding(true)
		try {
			await fetch(
				`${process.env.NEXT_PUBLIC_BASE_PATH}/api/shifts/${activeShift!.id}`,
				{
					method: 'PATCH',
				},
			)
			shiftStore.set(null)
			setClients([])
		} finally {
			setIsEnding(false)
		}
	}

	const fetchClients = (shiftId: number) => {
		setClientsLoading(true)
		fetch(
			`${process.env.NEXT_PUBLIC_BASE_PATH}/api/clients?shift_id=${shiftId}`,
		)
			.then(res => res.json())
			.then(data => setClients(data))
			.finally(() => setClientsLoading(false))
	}

	useEffect(() => {
		if (shiftLoadedStore.get()) {
			const currentShift = shiftStore.get()
			if (currentShift) queueMicrotask(() => fetchClients(currentShift.id))
			return
		}

		fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/shifts/active`)
			.then(res => res.json())
			.then(shift => {
				shiftStore.set(shift)
				if (shift) fetchClients(shift.id)
			})
			.finally(() => shiftLoadedStore.set(true))
	}, [])

	return (
		<>
			{!isLoaded ? (
				<div className='flex min-h-[70vh] items-center justify-center'>
					<Loader2 className='text-muted-foreground animate-spin' size={32} />
				</div>
			) : activeShift === null ? (
				<ShiftStart
					name={settings.name}
					onStart={startShift}
					isStarting={isStarting}
				/>
			) : (
				<ActiveShift
					clients={clients}
					clientsLoading={clientsLoading}
					settings={settings}
					onFetchClients={() => fetchClients(activeShift.id)}
					onEndShift={endShift}
					isEnding={isEnding}
				/>
			)}
		</>
	)
}
