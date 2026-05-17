interface StatBoxProps {
  value: number
  label: string
}


export default function StatBox({value, label}: StatBoxProps) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-lg">
      <span className="text-2xl font-semibold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}