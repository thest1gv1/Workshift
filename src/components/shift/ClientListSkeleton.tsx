import { Skeleton } from '@/components/ui/skeleton'

export default function ClientListSkeleton() {
	return (
		<ul className='grid gap-2'>
			{[1, 2, 3, 4].map(i => (
				<li
					key={i}
					className='bg-card border-border flex items-center gap-2 rounded-xl border p-4'
				>
					<Skeleton className='h-10 w-10 shrink-0 rounded-lg' />
					<div className='grid flex-1 gap-1.5'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-3 w-40' />
					</div>
					<Skeleton className='h-6 w-16 shrink-0 rounded-full' />
					<Skeleton className='h-8 w-8 shrink-0 rounded-full' />
				</li>
			))}
		</ul>
	)
}
