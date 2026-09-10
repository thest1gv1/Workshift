'use client'

import { useStore } from '@nanostores/react'
import { settingsStore } from '@/store/settingsStore'
import { useEffect, useState } from 'react'
import { shiftStore, shiftLoadedStore } from '@/store/shiftStore'
import ShiftStart from '@/components/shift/ShiftStart'
import ActiveShift from '@/components/shift/ActiveShift'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
	clientsStore,
	loadCurrentShift,
	hasCurrentClients,
	resetShiftClients,
} from '@/store/clientsStore'

export default function Home() {
	const settings = useStore(settingsStore)
	const activeShift = useStore(shiftStore)
	const isLoaded = useStore(shiftLoadedStore)

	const [isStarting, setIsStarting] = useState(false)
	const [isEnding, setIsEnding] = useState(false)
	const clients = useStore(clientsStore)
	const [ready, setReady] = useState(hasCurrentClients)
	const [loadError, setLoadError] = useState(false)
	const [attempt, setAttempt] = useState(0)

	const startShift = async () => {
		setIsStarting(true)
		try {
			const res = await fetch('/api/shifts', {
				method: 'POST',
			})
			if (!res.ok) throw new Error('Failed to start shift')
			const shift = await res.json()
			resetShiftClients(shift.id)
			shiftStore.set(shift)
			shiftLoadedStore.set(true)
		} catch {
			toast.error('Не удалось начать смену. Попробуйте ещё раз.')
		} finally {
			setIsStarting(false)
		}
	}

	const endShift = async () => {
		if (!activeShift || isEnding) return
		setIsEnding(true)
		try {
			const res = await fetch(`/api/shifts/${activeShift.id}`, {
				method: 'PATCH',
			})
			if (!res.ok) throw new Error('Failed to end shift')
			shiftStore.set(null)
			resetShiftClients()
		} catch {
			toast.error('Не удалось завершить смену. Попробуйте ещё раз.')
		} finally {
			setIsEnding(false)
		}
	}

	useEffect(() => {
		let cancelled = false
		loadCurrentShift()
			.then(() => {
				if (!cancelled) setReady(true)
			})
			.catch(() => {
				if (!cancelled) setLoadError(true)
			})
		return () => {
			cancelled = true
		}
	}, [attempt])

	if (loadError)
		return (
			<div className='grid gap-4'>
				<p role='alert'>Не удалось загрузить смену. Проверьте подключение.</p>
				<Button
					onClick={() => {
						setLoadError(false)
						setAttempt(value => value + 1)
					}}
				>
					Повторить
				</Button>
			</div>
		)

	return (
		<>
			{!isLoaded || !ready ? (
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
					clientsLoading={false}
					settings={settings}
					onEndShift={endShift}
					isEnding={isEnding}
				/>
			)}
		</>
	)
}
