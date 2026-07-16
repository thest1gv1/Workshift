import { Skeleton } from '@/components/ui/skeleton'

export default function ShiftListSkeleton() {
	return (
		<ul className='grid gap-2'>
			{[1, 2, 3, 4, 5].map(i => (
				<li
					key={i}
					className='border-border flex items-center justify-between rounded-xl border p-4'
				>
					<div className='grid gap-1.5'>
						<Skeleton className='h-4 w-32' />
						<Skeleton className='h-3 w-24' />
					</div>
					<Skeleton className='h-8 w-8 shrink-0 rounded-full' />
				</li>
			))}
		</ul>
	)
}
