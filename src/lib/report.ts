import { SERVICES } from '@/constants/services'
import type { Settings } from '@/store/settingsStore'
import type { Client } from '@/store/shiftStore'

export function generateReport(clients: Client[], settings: Settings) {
	const now = new Date()
	const day = String(now.getDate()).padStart(2, '0')
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const date = `${day}.${month}`

	const countService = (id: string) =>
		clients.filter(c => c.services.includes(id)).length

	return `ФИО: ${settings.name}

Дата: ${date}

Выдано:

${clients
	.filter(c => c.type === 'issued')
	.map(
		c =>
			`${c.name} ${c.services
				.map(id => SERVICES.find(s => s.id === id)?.label ?? id)
				.join(' ')}`,
	)
	.join('\n')}

Переносы/отказы:
${clients
	.filter(c => c.type === 'transfer' || c.type === 'rejected')
	.map(
		c =>
			`${c.name} ${c.services.map(
				id => SERVICES.find(s => s.id === id)?.label ?? id,
			)}`,
	)
	.join('\n')}
Клиентопоток:${clients.length}
Выдано дк:${countService('dk')}
ПС (кросс):${countService('ps')}
Втб+:${countService('vtbplus')}
СОМ:${countService('som')}
КСП/сумм:${countService('ksp')}
ИЗП:${countService('izp')}
ЗП Лайт:${countService('zplite')}
Автост:${countService('avtost')}
Группа близкие:${countService('gruppa')}
Выдано КК по заявке:${countService('kk')}
Заведено УЗ КК:${countService('uz_kk')}
Выдано кросс КК:${countService('kross_kk')}
СКК:${countService('skk')}
КН:${countService('kn')}
Нс пустой:${countService('ns')}
НС от 10к/сумм:${countService('ns10')}
Вклад/сумм:${countService('vklad')}
ПИФ/сумм:${countService('pif')}
ПДС/сумм:${countService('pds')}
Пенсия:${countService('pensiya')}
АП СС:${countService('ap_ss')}
АП ЖКУ:${countService('ap_jku')}
ВТБ-мобайл:${countService('vtb_mobile')}
ВТБ PAY:${countService('vtb_pay')}
КОБ/КРБ (мин 0,8):${countService('kob')}
Арест:${countService('arrest')}
Блокировка ВТБо:${countService('blok')}`
}
