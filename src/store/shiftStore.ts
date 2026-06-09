import { atom } from 'nanostores'


export type ClientType = 'issued' | 'transfer' | 'rejected'

export interface Client {
	id: string
	name: string
	services: string[]
	amounts?: Record<string, number>
	type: ClientType
	note?: string
}

export const clientsStore = atom<Client[]>([])

// export function addClient(client: Omit<Client, 'id'>) {
// 	clientsStore.set([
// 		...clientsStore.get(),
// 		{ ...client, id: crypto.randomUUID() },
// 	])
// }

export function updateClient(id: string, data: Omit<Client, 'id'>) {
	clientsStore.set(
		clientsStore.get().map(c => (c.id === id ? { ...c, ...data } : c)),
	)
}

// export function deleteClient(id: string) {
// 	clientsStore.set(clientsStore.get().filter(c => c.id !== id))
// }
