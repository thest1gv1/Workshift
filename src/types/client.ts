export type ClientType = 'issued' | 'transfer' | 'rejected'

export interface Client {
	id: string
	name: string
	services: string[]
	amounts?: Record<string, number>
	type: ClientType
	note?: string
	transferDate?: string
	transferSlot?: string
}