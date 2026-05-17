import StatBox from "@/components/shift/StatBox";

export default function ShiftCard(){
  return (
    <div className="grid gap-4 p-5 bg-card rounded-2xl border border-border">
      <div className="grid gap-0.5">
        <p className="text-xs uppercase text-muted-foreground">Текущая смена</p>
        <h2>Суббота, 16 мая</h2>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatBox
          value={1}
          label="Выдано"
        />
        <StatBox
          value={0}
          label="Переносы"
        />
        <StatBox
          value={0}
          label="Клиенты"
        />
      </div>

      <div className="grid gap-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>План выполнен</span>
          <span>1 / 8</span>
        </div>
        <div className="h-1 bg-secondary rounded-full">
          <div className="h-full w-[15%] bg-gradient-to-r from-primary to-accent2 rounded-full" />
        </div>
      </div>
    </div>
  )
}