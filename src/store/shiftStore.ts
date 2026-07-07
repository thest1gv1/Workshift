import { atom } from 'nanostores'

export const shiftStore = atom<{
	id: number
	started_at: string | null
	ended_at: string | null
	is_active: boolean
} | null>(null)
