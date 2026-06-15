import pool from '@/lib/db'

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	await pool.query('DELETE FROM clients WHERE id = $1', [id])

	return Response.json({ success: true })
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	const { name, services, amounts, type, note, transferDate, transferSlot } = await req.json()

	await pool.query(
		'UPDATE clients SET name=$1, type=$2, services=$3, amounts=$4, note=$5, transfer_date=$6, transfer_slot=$7 WHERE id=$8',
		[name, type, services, amounts, note, transferDate ?? null, transferSlot ?? null, id],
	)

	return Response.json({ success: true })
}

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id])
	const r = result.rows[0]

	return Response.json({
		...r,
		transferDate: r.transfer_date,
		transferSlot: r.transfer_slot,
	})
}
