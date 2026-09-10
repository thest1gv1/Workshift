import { eq } from 'drizzle-orm'
import db from '@/lib/db'
import { shifts } from '@/lib/db/schema'

export async function GET() {
	const [shift] = await db
		.select()
		.from(shifts)
		.where(eq(shifts.is_active, true))
		.limit(1)
	return Response.json(shift ?? null)
}
