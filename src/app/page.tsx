import {Copy, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import ClientRow from "@/components/shift/ClientRow";
import ShiftCard from "@/components/shift/ShiftCard";

export default function Home() {
  return (
    <div className="grid gap-5">
      <div className="flex justify-between gap-2 ">
        <div className="grid gap-0.5">
          <p className="text-xs uppercase text-muted-foreground">Добрый день</p>
          <h1 className="text-lg ">Сотрудник</h1>
        </div>
        <div className="w-10 h-10 flex items-center justify-center text-xs font-semibold text-primary-foreground bg-gradient-to-br from-primary to-accent2 rounded-full">АВ</div>
      </div>

      <ShiftCard />

      <div className="grid gap-3">
        <h2>Клиенты</h2>
        <ul className="grid gap-2 ">
          <ClientRow
            name="Иванов"
            services="ДК, ДКО, К+, ПИН, КЕШ"
            type="issued"
          />
          <ClientRow
            name="Петров"
            services="НС, ИЗП, ВТБ+"
            type="transfer"
          />
          <ClientRow
            name="Сидоров"
            services="КК заявка, Вклад"
            type="rejected"
          />
        </ul>
      </div>

      <div className="grid gap-2 ">
        <Button size="lg"> <Plus />Добавить клиента</Button>
        <Button
          size="lg"
          variant="outline"
        > <Copy /> Скопировать отчет</Button>
      </div>

    </div>
  )
}
