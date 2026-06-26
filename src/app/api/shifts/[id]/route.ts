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

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	const result = await pool.query('SELECT * FROM shifts LEFT JOIN clients ON clients.shift_id = shifts.id WHERE shifts.id = $1', [id])

	return Response.json({
		shift:result.rows[0],
		clients:result.rows
	})
}
