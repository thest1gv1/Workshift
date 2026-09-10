import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'

const requiredVariables = [
	'DB_HOST',
	'DB_PORT',
	'DB_NAME',
	'DB_USER',
	'DB_PASSWORD',
]

for (const variable of requiredVariables) {
	if (!process.env[variable]) {
		throw new Error(`${variable} is required`)
	}
}

const connection = {
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
}

const pool = new pg.Pool(connection)
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

const encodedUser = encodeURIComponent(connection.user)
const encodedPassword = encodeURIComponent(connection.password)
const encodedDatabase = encodeURIComponent(connection.database)
process.env.DATABASE_URL = `postgresql://${encodedUser}:${encodedPassword}@${connection.host}:${connection.port}/${encodedDatabase}`

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
