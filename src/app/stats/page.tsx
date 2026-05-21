import StatBox from "@/components/shift/StatBox";


export default function StatsPage() {
  return (
    <div className="grid gap-5">
      <h1>Статистика</h1>
      <div className="grid grid-cols-2 gap-2">
        <StatBox
          value={1}
          label='Выдано'
        />
        <StatBox
          value={0}
          label='Клиентопоток'
        />
      </div>


      <div className="grid gap-2">
        <span className="text-xs uppercase text-muted-foreground tracking-wider">Услуги</span>
        <div>
          <ul className="grid gap-2">
            <li className="flex justify-between items-center p-3 bg-card rounded-lg">
              <span className=" text-muted-foreground">ДК</span>
              <span className=" font-semibold text-primary">3</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-card rounded-lg">
              <span className=" text-muted-foreground">КЕШ</span>
              <span className=" font-semibold text-primary">2</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-card rounded-lg">
              <span className=" text-muted-foreground">ДКО</span>
              <span className=" font-semibold text-primary">4</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}