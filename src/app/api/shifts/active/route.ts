import pool from '@/lib/db'

export async function GET() {
	const result = await pool.query(
		'SELECT * FROM shifts WHERE is_active = true LIMIT 1',
	)
	return Response.json(result.rows[0] ?? null)
}
