import db from '@/lib/db'
import { shifts } from '@/lib/db/schema'

export async function POST() {
	const [shift] = await db.insert(shifts).values({}).returning()
	return Response.json(shift)
}

export async function GET() {
	return Response.json(await db.select().from(shifts))
}
