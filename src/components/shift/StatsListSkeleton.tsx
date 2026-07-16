import { Skeleton } from '@/components/ui/skeleton'

export default function StatsListSkeleton() {
	return (
		<ul className='grid gap-2'>
			{[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
				<li
					key={i}
					className='bg-card flex items-center justify-between rounded-lg p-3'
				>
					<Skeleton className='h-6 w-24' />
					<Skeleton className='h-6 w-6' />
				</li>
			))}
		</ul>
	)
}
