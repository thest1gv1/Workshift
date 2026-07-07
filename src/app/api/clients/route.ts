import pool from '@/lib/db'

export async function POST(req: Request) {
	const {
		name,
		services,
		amounts,
		type,
		note,
		transferDate,
		transferSlot,
		shift_id,
	} = await req.json()

	const result = await pool.query(
		'INSERT INTO clients (name, services, amounts, type, note, transfer_date, transfer_slot, shift_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
		[
			name,
			services,
			amounts,
			type,
			note,
			transferDate ?? null,
			transferSlot ?? null,
			shift_id ?? null,
		],
	)

	return Response.json(result.rows[0])
}

export async function GET(req: Request) {

	const { searchParams } = new URL(req.url)
	const shiftId = searchParams.get('shift_id')

	const month = searchParams.get('month')

	if (shiftId) {
		const result = await pool.query('SELECT * FROM clients WHERE shift_id = $1', [shiftId])
		return Response.json(result.rows.map(r => ({ ...r, transferDate: r.transfer_date, transferSlot: r.transfer_slot })))
	}

	if (month) {
		const result = await pool.query(
			`SELECT clients.* FROM clients
			 JOIN shifts ON shifts.id = clients.shift_id
			 WHERE TO_CHAR(shifts.started_at AT TIME ZONE 'Europe/Moscow', 'YYYY-MM') = $1`,
			[month],
		)
		return Response.json(result.rows.map(r => ({ ...r, transferDate: r.transfer_date, transferSlot: r.transfer_slot })))
	}

	return Response.json([])
}
