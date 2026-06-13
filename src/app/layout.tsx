import type { Metadata } from 'next'
import { Onest, Unbounded } from 'next/font/google'
import { cn } from '@/lib/utils'
import BottomNav from '@/components/layout/BottomNav'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import ThemeProvider from '@/components/ThemeProvider'

const onest = Onest({
	subsets: ['latin', 'cyrillic'],
	weight: ['300', '400', '500', '600'],
	variable: '--font-onest',
})

const unbounded = Unbounded({
	subsets: ['latin', 'cyrillic'],
	weight: ['500', '600'],
	variable: '--font-unbounded',
})

export const metadata: Metadata = {
	title: 'Workshift',
	description: 'Приложение для формирования сменного отчёта',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='ru'
			className={cn('font-sans', onest.variable, unbounded.variable)}
			suppressHydrationWarning
		>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
        const t = localStorage.getItem('theme') || 'system'
        const dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        if (dark) document.documentElement.classList.add('dark')
    `,
					}}
				/>
			</head>
			<body>
				<ThemeProvider>
					<Toaster position='top-center' />
					<div className='mx-auto w-full max-w-2xl px-4 pt-10 pb-20'>
						{children}
					</div>
					<BottomNav />
				</ThemeProvider>
			</body>
		</html>
	)
}
