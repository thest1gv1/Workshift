import pool from '@/lib/db'

export async function POST(req: Request) {
	const { name, services, amounts, type, note, transferDate, transferSlot } = await req.json()

	const result = await pool.query(
		'INSERT INTO clients (name, services, amounts, type, note, transfer_date, transfer_slot) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
		[name, services, amounts, type, note, transferDate ?? null, transferSlot ?? null],
	)

	return Response.json(result.rows[0])
}

export async function GET() {
  const result = await pool.query('SELECT * FROM clients')
  return Response.json(result.rows.map(r => ({
    ...r,
    transferDate: r.transfer_date,
    transferSlot: r.transfer_slot,
  })))
}