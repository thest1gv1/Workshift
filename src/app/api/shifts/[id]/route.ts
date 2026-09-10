import { eq, sql } from 'drizzle-orm'
import db from '@/lib/db'
import { clients, shifts } from '@/lib/db/schema'
import { serializeClient } from '@/lib/db/client'

export async function PATCH(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params
	await db
		.update(shifts)
		.set({ ended_at: sql`now()`, is_active: false })
		.where(eq(shifts.id, Number(id)))
	return Response.json({ success: true })
}

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params
	await db.transaction(async tx => {
		await tx.delete(clients).where(eq(clients.shift_id, Number(id)))
		await tx.delete(shifts).where(eq(shifts.id, Number(id)))
	})
	return Response.json({ success: true })
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params
	const [shift] = await db
		.select()
		.from(shifts)
		.where(eq(shifts.id, Number(id)))
	const result = await db
		.select()
		.from(clients)
		.where(eq(clients.shift_id, Number(id)))
	return Response.json({
		shift: shift ?? null,
		clients: result.map(serializeClient),
	})
}
