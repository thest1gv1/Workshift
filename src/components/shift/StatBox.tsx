interface StatBoxProps {
	value: number
	label: string
}

export default function StatBox({ value, label }: StatBoxProps) {
	return (
		<div className='bg-secondary flex flex-col items-center gap-1 rounded-lg p-3'>
			<span className='text-2xl font-semibold'>{value}</span>
			<span className='text-muted-foreground text-xs'>{label}</span>
		</div>
	)
}
