'use client'

import {Copy, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import ClientRow from "@/components/shift/ClientRow";
import ShiftCard from "@/components/shift/ShiftCard";
import Link from "next/link";
import {useStore} from "@nanostores/react";
import {settingsStore} from "@/store/settingsStore";
import {clientsStore} from "@/store/shiftStore";

export default function Home() {
  const clients = useStore(clientsStore)
  const settings = useStore(settingsStore)

  return (
    <div className="grid gap-5">
      <div className="flex justify-between gap-2 ">
        <div className="grid gap-0.5">
          <p className="text-xs uppercase text-muted-foreground">Добрый день</p>
          <h1 className="text-lg ">{settings.name || 'Сотрудник'}</h1>
        </div>
        <div className="w-10 h-10 flex items-center justify-center text-xs font-semibold text-primary-foreground bg-linear-to-br from-primary to-accent2 rounded-full">АВ</div>
      </div>

      <ShiftCard plan={settings.plan} />

      <div className="grid gap-3">
        <h2>Клиенты</h2>
        <ul className="grid gap-2 ">
          {clients.map((client)=>(
            <ClientRow
              key={client.id}
              id={client.id}
              name={client.name}
              services={client.services}
              type={client.type}
            />
          ))}
        </ul>
      </div>

      <div className="grid gap-2 ">
        <Link href="/add">
          <Button
            size="lg"
            className="w-full"
          ><Plus />Добавить клиента</Button>
        </Link>

        <Button
          size="lg"
          variant="outline"
        > <Copy /> Скопировать отчет</Button>
      </div>

    </div>
  )
}
