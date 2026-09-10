import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { eq } from 'drizzle-orm'
import { clients, shifts } from '../src/lib/db/schema'

// Never use the application's DATABASE_URL for integration tests.
const baseUrl = new URL(
	process.env.TEST_DATABASE_URL ??
		'postgresql://workshift:workshift_local@localhost:5433/workshift',
)
if (!['localhost', '127.0.0.1', '[::1]'].includes(baseUrl.hostname)) {
	throw new Error(
		'Database integration tests require a local PostgreSQL server.',
	)
}
const admin = new Pool({
	connectionString: baseUrl.toString(),
	connectionTimeoutMillis: 5000,
})
const migrationsFolder = resolve('migrations/drizzle')

async function withTestDatabase(
	run: (url: string, pool: Pool) => Promise<void>,
) {
	const name = `workshift_test_${randomUUID().replaceAll('-', '')}`
	await admin.query(`CREATE DATABASE "${name}"`)
	const url = new URL(baseUrl)
	url.pathname = `/${name}`
	const pool = new Pool({ connectionString: url.toString() })
	try {
		await run(url.toString(), pool)
	} finally {
		await pool.end()
		// Only the unique database created by this invocation is removed.
		await admin.query(`DROP DATABASE "${name}"`)
	}
}

const request = (method = 'GET', body?: unknown, query = '') =>
	new Request(`http://localhost/api/test${query}`, {
		method,
		...(body === undefined
			? {}
			: {
					body: JSON.stringify(body),
					headers: { 'Content-Type': 'application/json' },
				}),
	})
const params = (id: number) => ({ params: Promise.resolve({ id: String(id) }) })

async function main() {
	await withTestDatabase(async (url, pool) => {
		const testDb = drizzle(pool)
		await migrate(testDb, { migrationsFolder })
		await migrate(testDb, { migrationsFolder })
		const journal = await pool.query(
			'SELECT count(*)::int AS count FROM drizzle.__drizzle_migrations',
		)
		assert.equal(journal.rows[0].count, 1)
		process.env.DATABASE_URL = url
		const appDb = await import('../src/lib/db')
		try {
			const clientRoutes = await import('../src/app/api/clients/route')
			const clientRoute = await import('../src/app/api/clients/[id]/route')
			const shiftRoutes = await import('../src/app/api/shifts/route')
			const shiftRoute = await import('../src/app/api/shifts/[id]/route')
			const activeRoute = await import('../src/app/api/shifts/active/route')
			assert.equal(await (await activeRoute.GET()).json(), null)
			const shift = await (await shiftRoutes.POST()).json()
			assert.equal(typeof shift.id, 'number')
			assert.equal(shift.is_active, true)
			assert.ok(Number.isFinite(Date.parse(shift.started_at)))
			assert.equal((await (await activeRoute.GET()).json()).id, shift.id)
			assert.equal((await (await shiftRoutes.GET()).json()).length, 1)
			const input = {
				name: '123456',
				type: 'transfer',
				services: ['card'],
				amounts: { card: 120.5 },
				note: 'test',
				transferDate: '2026-02-03',
				transferSlot: '09:00–11:00',
				shift_id: shift.id,
			}
			const client = await (
				await clientRoutes.POST(request('POST', input))
			).json()
			assert.equal(typeof client.id, 'number')
			assert.equal(client.shift_id, shift.id)
			const loaded = await (
				await clientRoute.GET(request(), params(client.id))
			).json()
			assert.equal(loaded.transferDate, input.transferDate)
			assert.deepEqual(loaded.amounts, input.amounts)
			assert.deepEqual(loaded.services, input.services)
			const filtered = await (
				await clientRoutes.GET(
					request('GET', undefined, `?shift_id=${shift.id}`),
				)
			).json()
			assert.equal(filtered.length, 1)
			assert.equal(filtered[0].transferSlot, input.transferSlot)
			// 21:00 UTC is midnight on the next day in Moscow.
			await testDb
				.update(shifts)
				.set({ started_at: new Date('2026-01-31T21:00:00Z') })
				.where(eq(shifts.id, shift.id))
			assert.equal(
				(
					await (
						await clientRoutes.GET(request('GET', undefined, '?month=2026-02'))
					).json()
				).length,
				1,
			)
			assert.equal(
				(
					await (
						await clientRoutes.GET(request('GET', undefined, '?month=2026-01'))
					).json()
				).length,
				0,
			)
			await clientRoute.PUT(
				request('PUT', {
					...input,
					amounts: { card: 999 },
					transferDate: null,
					transferSlot: null,
					shift_id: null,
				}),
				params(client.id),
			)
			const edited = await (
				await clientRoute.GET(request(), params(client.id))
			).json()
			assert.deepEqual(edited.amounts, { card: 999 })
			assert.equal(edited.transferDate, null)
			assert.equal(
				edited.shift_id,
				shift.id,
				'Editing a client must not change its shift',
			)
			await shiftRoute.PATCH(request('PATCH'), params(shift.id))
			assert.equal(await (await activeRoute.GET()).json(), null)
			const detail = await (
				await shiftRoute.GET(request(), params(shift.id))
			).json()
			assert.equal(detail.shift.is_active, false)
			assert.ok(Number.isFinite(Date.parse(detail.shift.ended_at)))
			assert.equal(detail.clients.length, 1)
			// Force the second delete to fail and check the first delete rolls back.
			await pool.query(
				`CREATE FUNCTION reject_shift_delete() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test rollback'; END $$`,
			)
			await pool.query(
				'CREATE TRIGGER reject_shift_delete BEFORE DELETE ON shifts FOR EACH ROW EXECUTE FUNCTION reject_shift_delete()',
			)
			await assert.rejects(() =>
				shiftRoute.DELETE(request('DELETE'), params(shift.id)),
			)
			assert.equal((await testDb.select().from(clients)).length, 1)
			await pool.query('DROP TRIGGER reject_shift_delete ON shifts')
			await shiftRoute.DELETE(request('DELETE'), params(shift.id))
			assert.equal((await testDb.select().from(clients)).length, 0)
			assert.equal((await testDb.select().from(shifts)).length, 0)
			assert.equal(
				(await clientRoute.GET(request(), params(client.id))).status,
				404,
			)
			const standalone = await (
				await clientRoutes.POST(
					request('POST', { name: '654321', type: 'issued' }),
				)
			).json()
			assert.deepEqual(standalone.services, [])
			assert.deepEqual(standalone.amounts, {})
			assert.equal(standalone.note, '')
			assert.equal(standalone.shift_id, null)
			await clientRoute.DELETE(request('DELETE'), params(standalone.id))
			assert.equal((await testDb.select().from(clients)).length, 0)
			console.log(
				'PASS: fresh/repeated migrations, API CRUD, dates, JSON, statistics and transaction rollback',
			)
		} finally {
			await appDb.pool.end()
		}
	})

	await withTestDatabase(async (_url, pool) => {
		for (const file of [
			'001_create_clients.sql',
			'002_add_transfer_fields.sql',
			'003_create_shifts.sql',
			'004_add_shift_id_to_clients.sql',
		]) {
			await pool.query(await readFile(resolve('migrations', file), 'utf8'))
		}
		const testDb = drizzle(pool)
		const [shift] = await testDb.insert(shifts).values({}).returning()
		const [before] = await testDb
			.insert(clients)
			.values({
				name: 'legacy',
				type: 'issued',
				amounts: { card: 42 },
				shift_id: shift.id,
			})
			.returning()
		await migrate(testDb, { migrationsFolder })
		await migrate(testDb, { migrationsFolder })
		const [after] = await testDb.select().from(clients)
		assert.deepEqual(after, before)
		await testDb.delete(shifts).where(eq(shifts.id, shift.id))
		assert.equal((await testDb.select().from(clients))[0].shift_id, null)
		console.log(
			'PASS: legacy migration adoption preserves rows and ON DELETE SET NULL',
		)
	})
}

main()
	.catch(error => {
		console.error(error)
		process.exitCode = 1
	})
	.finally(() => admin.end())
