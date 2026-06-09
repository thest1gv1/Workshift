import pool from '@/lib/db'

export async function POST(req: Request) {
	const { name, services, amounts, type, note } = await req.json()

	const result = await pool.query(
		'INSERT INTO clients (name, services, amounts, type, note) VALUES ($1, $2, $3, $4,$5) RETURNING *',
		[name, services, amounts, type, note],
	)

	return Response.json(result.rows[0])
}

export async function GET() {
  const result = await pool.query('SELECT * FROM clients')
  return Response.json(result.rows)
}