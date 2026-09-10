import { sql } from 'drizzle-orm'
import {
	boolean,
	foreignKey,
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
} from 'drizzle-orm/pg-core'
import type { ClientType } from '@/types/client'

export const shifts = pgTable('shifts', {
	id: serial('id').primaryKey(),
	started_at: timestamp('started_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	ended_at: timestamp('ended_at', { withTimezone: true }),
	is_active: boolean('is_active').notNull().default(true),
})

export const clients = pgTable(
	'clients',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		type: text('type').$type<ClientType>().notNull(),
		services: text('services')
			.array()
			.notNull()
			.default(sql`'{}'::text[]`),
		amounts: jsonb('amounts')
			.$type<Record<string, number>>()
			.notNull()
			.default({}),
		note: text('note').notNull().default(''),
		transfer_date: text('transfer_date'),
		transfer_slot: text('transfer_slot'),
		shift_id: integer('shift_id'),
	},
	table => [
		foreignKey({
			name: 'clients_shift_id_fkey',
			columns: [table.shift_id],
			foreignColumns: [shifts.id],
		}).onDelete('set null'),
	],
)

export type ClientRow = typeof clients.$inferSelect
export type NewClient = typeof clients.$inferInsert
export type ShiftRow = typeof shifts.$inferSelect
