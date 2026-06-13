'use client'

import { settingsStore } from '@/store/settingsStore'
import { useStore } from '@nanostores/react'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { applyTheme, themeStore, ThemeType } from '@/store/themeStore'

export default function SettingsPage() {
	const settings = useStore(settingsStore)

	const theme = useStore(themeStore)

	return (
		<div className='grid gap-5'>
			<h1>Настройки</h1>
			<div className='grid gap-2'>
				<label
					htmlFor='name'
					className='text-muted-foreground text-xs tracking-wider uppercase'
				>
					Смена темы
				</label>
				<Select
					value={theme}
					onValueChange={value => {
						applyTheme(value as ThemeType)
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder='Выберите тему' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='system'>Системная</SelectItem>
						<SelectItem value='light'>Светлая</SelectItem>
						<SelectItem value='dark'>Тёмная</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className='grid gap-2'>
				<label
					htmlFor='name'
					className='text-muted-foreground text-xs tracking-wider uppercase'
				>
					Профиль
				</label>
				<Input
					id='name'
					value={settings.name}
					placeholder='Ваше Фио'
					onChange={e =>
						settingsStore.set({
							...settings,
							name: e.target.value,
						})
					}
				/>
			</div>
			<div className='grid gap-2'>
				<label
					htmlFor='plan'
					className='text-muted-foreground text-xs tracking-wider uppercase'
				>
					Дневной план
				</label>
				<Input
					id='plan'
					value={settings.plan}
					type='number'
					placeholder='8'
					onChange={e =>
						settingsStore.set({
							...settings,
							plan: Number(e.target.value),
						})
					}
				/>
			</div>
		</div>
	)
}
