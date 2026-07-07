import pool from '@/lib/db'

export async function PATCH(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	await pool.query(
		'UPDATE shifts SET ended_at = NOW(), is_active = false WHERE id = $1',
		[id],
	)

	return Response.json({ success: true })
}

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params
	await pool.query('DELETE FROM clients WHERE shift_id = $1', [id])
	await pool.query('DELETE FROM shifts WHERE id = $1', [id])
	return Response.json({ success: true })
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	const shiftResult = await pool.query('SELECT * FROM shifts WHERE id = $1', [id])
	const clientsResult = await pool.query('SELECT * FROM clients WHERE shift_id = $1', [id])

	return Response.json({
		shift: shiftResult.rows[0] ?? null,
		clients: clientsResult.rows.map(r => ({
			...r,
			transferDate: r.transfer_date,
			transferSlot: r.transfer_slot,
		})),
	})
}
