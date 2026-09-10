import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is required')
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
let connected = false

for (let attempt = 1; attempt <= 30; attempt += 1) {
	try {
		await pool.query('select 1')
		connected = true
		break
	} catch (error) {
		if (attempt === 30) throw error
		console.log(`Waiting for PostgreSQL (${attempt}/30)...`)
		await delay(2_000)
	}
}

if (!connected) throw new Error('Could not connect to PostgreSQL')

console.log('Applying database migrations...')
await migrate(drizzle(pool), { migrationsFolder: './migrations/drizzle' })
await pool.end()

console.log('Starting Next.js...')
const nextProcess = spawn(
	process.execPath,
	['node_modules/next/dist/bin/next', 'start'],
	{
		stdio: 'inherit',
		env: process.env,
	},
)

for (const signal of ['SIGTERM', 'SIGINT']) {
	process.on(signal, () => nextProcess.kill(signal))
}

nextProcess.on('exit', code => process.exit(code ?? 1))
