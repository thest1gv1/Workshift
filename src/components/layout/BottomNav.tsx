'use client'

import Link from 'next/link'
import { BarChart2, Home, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
	const pathname = usePathname()

	if (pathname === '/login') return null

	return (
		<nav className='bg-card fixed right-0 bottom-0 left-0 z-20 flex h-16 justify-center'>
			<div className='flex w-full max-w-2xl text-xs uppercase'>
				<Link
					className={cn(
						'flex flex-1 flex-col items-center gap-1 py-3 text-xs uppercase',
						pathname === '/' ? 'text-primary' : 'text-muted-foreground',
					)}
					href='/'
				>
					<Home size={20} />
					Смена
				</Link>
				<Link
					className={cn(
						'flex flex-1 flex-col items-center gap-1 py-3 text-xs uppercase',
						pathname === '/stats' ? 'text-primary' : 'text-muted-foreground',
					)}
					href='/stats'
				>
					<BarChart2 size={20} />
					Статистика
				</Link>
				<Link
					className={cn(
						'flex flex-1 flex-col items-center gap-1 py-3 text-xs uppercase',
						pathname === '/settings' ? 'text-primary' : 'text-muted-foreground',
					)}
					href='/settings'
				>
					<Settings size={20} />
					Настройки
				</Link>
			</div>
		</nav>
	)
}
