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

	const { name, services, amounts, type, note } = await req.json()

	await pool.query(
		'UPDATE clients SET name=$1, type=$2, services=$3, amounts=$4, note=$5 WHERE id=$6',
		[name, type, services, amounts, note, id],
	)

	return Response.json({ success: true })
}

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id])

	return Response.json(result.rows[0])
}
