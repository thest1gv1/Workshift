import { atom } from 'nanostores'

export type ThemeType = 'light' | 'dark' | 'system'

export const themeStore = atom<ThemeType>('system')

export function applyTheme(theme: ThemeType) {
	localStorage.setItem('theme', theme)
	themeStore.set(theme)

	const isDark =
		theme === 'dark' ||
		(theme === 'system' &&
			window.matchMedia('(prefers-color-scheme: dark)').matches)

	if (isDark) {
		document.documentElement.classList.add('dark')
	} else {
		document.documentElement.classList.remove('dark')
	}
}

export function initTheme() {
	const saved = localStorage.getItem('theme') as ThemeType | null
	applyTheme(saved ?? 'system')
}
