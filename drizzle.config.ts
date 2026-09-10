import { loadEnvConfig } from '@next/env'
import { defineConfig } from 'drizzle-kit'

// Use the same .env.local / .env resolution as Next.js.
loadEnvConfig(process.cwd())

if (!process.env.DATABASE_URL) {
	throw new Error(
		'DATABASE_URL is required. Set it in .env.local or the environment.',
	)
}

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/db/schema.ts',
	out: './migrations/drizzle',
	dbCredentials: { url: process.env.DATABASE_URL },
	strict: true,
})
