import { atom } from 'nanostores'

export type ClientType = 'issued' | 'transfer' | 'rejected'

export interface Client {
	id: string
	name: string
	services: string[]
	type: ClientType
	note?: string
}

export const clientsStore = atom<Client[]>([])

export function addClient(client: Omit<Client, 'id'>) {
	clientsStore.set([
		...clientsStore.get(),
		{ ...client, id: crypto.randomUUID() },
	])
}

export function deleteClient(id: string){
    clientsStore.set(
      clientsStore.get().filter(c => c.id !== id)
    ) 
}
