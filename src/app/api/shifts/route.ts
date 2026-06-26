import pool from '@/lib/db'

export async function POST() {
	const result = await pool.query(
		'INSERT INTO shifts DEFAULT VALUES RETURNING *',
	)
	return Response.json(result.rows[0])
}

export async function GET() {
	const result = await pool.query('SELECT * FROM shifts')
	return Response.json(result.rows)
}
