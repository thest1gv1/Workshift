import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './db/schema'

const globalForDb = globalThis as typeof globalThis & { workshiftPool?: Pool }

export const pool =
	globalForDb.workshiftPool ??
	new Pool({
		connectionString: process.env.DATABASE_URL,
	})

if (process.env.NODE_ENV !== 'production') globalForDb.workshiftPool = pool

const db = drizzle(pool, { schema })

export default db
