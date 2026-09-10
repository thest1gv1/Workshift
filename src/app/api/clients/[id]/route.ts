import { eq } from 'drizzle-orm'
import db from '@/lib/db'
import { clients } from '@/lib/db/schema'
import {
	clientValues,
	serializeClient,
	type ClientInput,
} from '@/lib/db/client'

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params
	await db.delete(clients).where(eq(clients.id, Number(id)))
	return Response.json({ success: true })
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params
	const input: ClientInput = await req.json()
	const values = clientValues(input)
	const [client] = await db
		.update(clients)
		.set({
			name: values.name,
			type: values.type,
			services: values.services,
			amounts: values.amounts,
			note: values.note,
			transfer_date: values.transfer_date,
			transfer_slot: values.transfer_slot,
		})
		.where(eq(clients.id, Number(id)))
		.returning()
	if (!client)
		return Response.json({ error: 'Client not found' }, { status: 404 })
	return Response.json(serializeClient(client))
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params
	const [client] = await db
		.select()
		.from(clients)
		.where(eq(clients.id, Number(id)))
	if (!client)
		return Response.json({ error: 'Client not found' }, { status: 404 })
	return Response.json(serializeClient(client))
}
