import { atom } from 'nanostores'
import type { ClientInterface } from '@/types/client'
import { shiftLoadedStore, shiftStore } from './shiftStore'

export type SavedClient = ClientInterface & { shift_id: number | null }
export const clientsStore = atom<SavedClient[]>([])
let loadedShiftId: number | null = null
let revision = 0
let loading: Promise<void> | null = null

export function resetShiftClients(shiftId: number | null = null) {
	revision++
	loadedShiftId = shiftId
	clientsStore.set([])
}

export async function loadCurrentShift() {
	if (loading) return loading
	loading = (async () => {
		const version = revision
		if (!shiftLoadedStore.get()) {
			const response = await fetch('/api/shifts/active')
			if (!response.ok) throw new Error('Не удалось загрузить смену')
			const shift = await response.json()
			if (version !== revision) return
			shiftStore.set(shift)
			shiftLoadedStore.set(true)
		}
		const shift = shiftStore.get()
		if (!shift || loadedShiftId === shift.id) return
		const response = await fetch(`/api/clients?shift_id=${shift.id}`)
		if (!response.ok) throw new Error('Не удалось загрузить клиентов')
		const clients: SavedClient[] = await response.json()
		if (version !== revision || shiftStore.get()?.id !== shift.id) return
		clientsStore.set(clients)
		loadedShiftId = shift.id
	})()
	try {
		await loading
	} finally {
		loading = null
	}
}

export function hasCurrentClients() {
	return (
		shiftLoadedStore.get() &&
		(!shiftStore.get() || loadedShiftId === shiftStore.get()?.id)
	)
}

export function saveClientToStore(client: SavedClient) {
	if (
		client.shift_id !== loadedShiftId ||
		client.shift_id !== shiftStore.get()?.id
	)
		return
	const clients = clientsStore.get()
	const exists = clients.some(item => String(item.id) === String(client.id))
	clientsStore.set(
		exists
			? clients.map(item =>
					String(item.id) === String(client.id) ? client : item,
				)
			: [...clients, client],
	)
}

export function removeClientFromStore(id: string) {
	clientsStore.set(
		clientsStore.get().filter(client => String(client.id) !== String(id)),
	)
}
