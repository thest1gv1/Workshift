'use client'

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SERVICES} from "@/constants/services";
import {useState} from "react";
import {addClient, ClientType} from "@/store/shiftStore";
import {cn} from "@/lib/utils";
import { useRouter } from 'next/navigation'

export default function AddPage() {

  const router = useRouter()

  const [name, setName] = useState('')
  const [type, setType] = useState<ClientType>('issued')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [note, setNote] = useState('')

  console.log(selectedServices)

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    )
  }

  const handleSave = () => {
    if(!name.trim()) return

    addClient({
      name,
      type,
      services:selectedServices,
      note
    })

    router.push('/')
  }

  return (
    <div className="grid gap-5">
      <h1>Новый клиент</h1>
      <div className="grid gap-2">
        <label
          htmlFor="name"
          className="text-xs uppercase text-muted-foreground tracking-wider"
        >фио клиента
        </label>
        <Input
          id="name"
          value={name}
          placeholder="Иванов И.И."
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <span className="text-xs uppercase text-muted-foreground tracking-wider">Тип</span>

        <div className="grid grid-cols-3 gap-2 text-muted-foreground">
          <Button
            className={type === "issued" ? "!bg-primary/20 !text-primary  !border-primary/50" : ''}
            size="lg"
            variant="outline"
            onClick={() => setType('issued')}

          >Выдано</Button>
          <Button
            className={type === "transfer" ? "!bg-amber/20 !text-amber  !border-amber/50" : ''}
            size="lg"
            variant="outline"
            onClick={() => setType('transfer')}
          >Перенос</Button>
          <Button
            className={type === "rejected" ? "!bg-destructive/20 !text-destructive  !border-destructive/50" : ''}
            size="lg"
            variant="outline"
            onClick={() => setType('rejected')}
          >Отказ</Button>
        </div>
      </div>

      <div className="grid gap-2">
        <span className="text-xs uppercase text-muted-foreground tracking-wider">Услуги</span>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((service) => (
            <span
              className={cn(
                "text-xs border rounded-full px-3 py-1 cursor-pointer",
                selectedServices.includes(service.id)
                  ? "bg-primary/20 text-primary border-primary/50"
                  : "text-muted-foreground border-border"
              )}
              key={service.id}
              onClick={() => toggleService(service.id)}
            >{service.label}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <span className="text-xs uppercase text-muted-foreground tracking-wider">Примечания</span>
        <div>
          <textarea
            className="w-full h-20 bg-input/30 rounded-lg border border-border p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none focus:border-ring"
            value={note}
            placeholder="Проблемы, нет доступа к лк, арест..."
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      <Button size="lg" onClick={handleSave}>Сохранить клиента</Button>

    </div>
  )
}