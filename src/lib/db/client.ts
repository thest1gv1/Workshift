import type { ClientRow, NewClient } from './schema'

export type ClientInput = Omit<
	NewClient,
	'id' | 'transfer_date' | 'transfer_slot'
> & {
	transferDate?: string | null
	transferSlot?: string | null
}

export function clientValues(input: ClientInput): NewClient {
	return {
		name: input.name,
		type: input.type,
		services: input.services ?? [],
		amounts: input.amounts ?? {},
		note: input.note ?? '',
		transfer_date: input.transferDate ?? null,
		transfer_slot: input.transferSlot ?? null,
		shift_id: input.shift_id ?? null,
	}
}

export function serializeClient(client: ClientRow) {
	return {
		...client,
		transferDate: client.transfer_date,
		transferSlot: client.transfer_slot,
	}
}
