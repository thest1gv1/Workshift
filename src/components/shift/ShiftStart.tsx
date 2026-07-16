import { Button } from '@/components/ui/button'
import { Zap, History, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ShiftStartProps {
	name: string
	onStart: () => void
	isStarting: boolean
}

export default function ShiftStart({
	name,
	onStart,
	isStarting,
}: ShiftStartProps) {
	return (
		<div className='flex min-h-[70vh] flex-col items-center justify-center gap-6 pt-24 text-center'>
			<div className='grid gap-1'>
				<h1 className='text-2xl font-semibold'>Добрый день</h1>
				<p className='text-muted-foreground text-sm'>{name || 'Сотрудник'}</p>
			</div>

			<div className='grid w-full max-w-xs gap-2'>
				<Button size='lg' onClick={onStart} disabled={isStarting}>
					{isStarting ? <Loader2 className='animate-spin' /> : <Zap />}
					Начать смену
				</Button>
				<Link href='/history'>
					<Button variant='outline' size='lg' className='w-full'>
						<History />
						История смен
					</Button>
				</Link>
			</div>
		</div>
	)
}
