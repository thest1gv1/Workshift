import { eq, getTableColumns, sql } from 'drizzle-orm'
import db from '@/lib/db'
import { clients, shifts } from '@/lib/db/schema'
import {
	clientValues,
	serializeClient,
	type ClientInput,
} from '@/lib/db/client'

export async function POST(req: Request) {
	const input: ClientInput = await req.json()
	const [client] = await db
		.insert(clients)
		.values(clientValues(input))
		.returning()
	return Response.json(serializeClient(client))
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)
	const shiftId = searchParams.get('shift_id')
	const month = searchParams.get('month')

	if (shiftId) {
		const result = await db
			.select()
			.from(clients)
			.where(eq(clients.shift_id, Number(shiftId)))
		return Response.json(result.map(serializeClient))
	}

	if (month) {
		const result = await db
			.select(getTableColumns(clients))
			.from(clients)
			.innerJoin(shifts, eq(shifts.id, clients.shift_id))
			// Preserve the existing Moscow calendar month used by statistics.
			.where(
				eq(
					sql<string>`to_char(${shifts.started_at} AT TIME ZONE 'Europe/Moscow', 'YYYY-MM')`,
					month,
				),
			)
		return Response.json(result.map(serializeClient))
	}

	return Response.json([])
}
