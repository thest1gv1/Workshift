import { SERVICES } from '@/constants/services'
import type { Settings } from '@/store/settingsStore'
import { Client } from '@/types/client'



export function generateReport(clients: Client[], settings: Settings) {
	const now = new Date()
	const day = String(now.getDate()).padStart(2, '0')
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const date = `${day}.${month}`

	const countService = (id: string) =>
		clients.filter(c => c.services.includes(id)).length

	const sumService = (id: string) =>
		clients.reduce((total, c) => total + (c.amounts?.[id] ?? 0), 0)

	return `ФИО: ${settings.name || 'Cотрудник'}

Дата: ${date}

Выдано:

${clients
	.filter(c => c.type === 'issued')
	.map(
		c =>
			`${c.name} ${c.services
				.map(id => {
					const label = SERVICES.find(s => s.id === id)?.label ?? id
					const amount = c.amounts?.[id]
					return amount ? `${label}(${amount} руб) ` : label
				})
				.join(' ')}${c.note?.trim() ? ` (${c.note.trim()})` : ''}`,
	)
	.join('\n')}

Переносы/отказы:
${clients
	.filter(c => c.type === 'transfer' || c.type === 'rejected')
	.map(c => {
		const note = c.note?.trim() ? ` (${c.note.trim()})` : ''
		const slot = c.transferDate && c.transferSlot
			? ` → ${new Date(c.transferDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} ${c.transferSlot}`
			: ''
		return `${c.name}${slot}${note}`
	})
	.join('\n')}
Клиентопоток: ${clients.length}
Выдано дк: ${countService('dk')}
ПС (кросс): ${countService('ps')}
Втб+: ${countService('vtbplus')}
СОМ: ${countService('som')}/${sumService('som')}
КСП/сумм: ${countService('ksp')}/${sumService('ksp')}
ИЗП: ${countService('izp')}
ЗП Лайт: ${countService('zplite')}
Автост: ${countService('avtost')}/${sumService('avtost')}
Группа близкие: ${countService('gruppa')}
Выдано КК по заявке: ${countService('kk')}
Заведено УЗ КК: ${countService('uz_kk')}
Выдано кросс КК: ${countService('kross_kk')}
СКК: ${countService('skk')}
КН: ${countService('kn')}/${sumService('kn')}
Нс пустой: ${countService('ns')}
НС от 10к/сумм: ${countService('ns10')}/${sumService('ns10')}
Вклад/сумм: ${countService('vklad')}/${sumService('vklad')}
ПИФ/сумм: ${countService('pif')}/${sumService('pif')}
ПДС/сумм: ${countService('pds')}/${sumService('pds')}
Пенсия: ${countService('pensiya')}
АП СС: ${countService('ap_ss')}/${sumService('ap_ss')}
АП ЖКУ: ${countService('ap_jku')}/${sumService('ap_jku')}
ВТБ-мобайл: ${countService('vtb_mobile')}
ВТБ PAY: ${countService('vtb_pay')}
КОБ/КРБ (мин 0,8):${countService('kob')}
Арест: ${countService('arrest')}
Блокировка ВТБо: ${countService('blok')}`


}
