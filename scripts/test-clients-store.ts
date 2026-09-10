import assert from 'node:assert/strict'
import {
	clientsStore,
	hasCurrentClients,
	loadCurrentShift,
	removeClientFromStore,
	resetShiftClients,
	saveClientToStore,
	type SavedClient,
} from '../src/store/clientsStore'
import { shiftLoadedStore, shiftStore } from '../src/store/shiftStore'

async function main() {
	const originalFetch = globalThis.fetch
	const client: SavedClient = {
		id: '1',
		name: 'Иванов А.А.',
		services: ['dk'],
		type: 'issued',
		shift_id: 7,
	}
	let requests = 0
	globalThis.fetch = async input => {
		requests++
		return Response.json(
			String(input).endsWith('/active')
				? {
						id: 7,
						started_at: '2026-09-09T09:00:00Z',
						ended_at: null,
						is_active: true,
					}
				: [client],
		)
	}
	try {
		await Promise.all([loadCurrentShift(), loadCurrentShift()])
		assert.equal(
			requests,
			2,
			'Concurrent mounts should share the initial requests',
		)
		assert.ok(hasCurrentClients())
		await loadCurrentShift()
		assert.equal(requests, 2, 'Returning to Home must not fetch again')
		saveClientToStore({ ...client, name: 'Петров П.П.' })
		assert.equal(clientsStore.get()[0].name, 'Петров П.П.')
		saveClientToStore({ ...client, id: '2' })
		assert.equal(clientsStore.get().length, 2)
		saveClientToStore({ ...client, id: '3', shift_id: 99 })
		assert.equal(
			clientsStore.get().length,
			2,
			'Historical clients must not enter the current shift',
		)
		removeClientFromStore('1')
		await loadCurrentShift()
		assert.equal(requests, 2, 'Mutations should not require another list GET')
		assert.deepEqual(
			clientsStore.get().map(item => item.id),
			['2'],
		)
		shiftStore.set(null)
		resetShiftClients()
		assert.equal(clientsStore.get().length, 0)
		shiftLoadedStore.set(false)
		globalThis.fetch = async () => new Response(null, { status: 500 })
		await assert.rejects(loadCurrentShift)
		assert.equal(
			shiftLoadedStore.get(),
			false,
			'A failed request must remain retryable',
		)
		globalThis.fetch = async () => Response.json(null)
		await loadCurrentShift()
		assert.ok(hasCurrentClients())
		console.log(
			'PASS: deduplicated loads, navigation cache, mutations, shift isolation, reset and retry',
		)
	} finally {
		globalThis.fetch = originalFetch
	}
}

main().catch(error => {
	console.error(error)
	process.exitCode = 1
})
