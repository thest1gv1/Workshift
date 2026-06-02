import { atom } from 'nanostores'

export interface Settings {
	name: string
	plan: number
}

export const settingsStore = atom({
	name: '',
	plan: 8,
})
