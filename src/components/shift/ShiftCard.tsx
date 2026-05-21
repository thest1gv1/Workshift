'use client'

import StatBox from "@/components/shift/StatBox";
import {clientsStore} from "@/store/shiftStore";
import {useStore} from "@nanostores/react";

interface ShiftCardProps {
  plan: number
}

export default function ShiftCard({plan}: ShiftCardProps) {

  const clients = useStore(clientsStore)
  const issued = clients.filter(c => c.type === 'issued').length
  const transfers = clients.filter(c => c.type === 'transfer').length
  const progress = plan > 0 ? Math.min(100, Math.round((issued / plan) * 100)) : 0

  return (
    <div className="grid gap-4 p-5 bg-card rounded-2xl border border-border">
      <div className="grid gap-0.5">
        <p className="text-xs uppercase text-muted-foreground">Текущая смена</p>
        <h2>Суббота, 16 мая</h2>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatBox
          value={issued}
          label="Выдано"
        />
        <StatBox
          value={transfers}
          label="Переносы"
        />
        <StatBox
          value={clients.length}
          label="Клиенты"
        />
      </div>

      <div className="grid gap-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>План выполнен</span>
          <span>{issued} / {plan}</span>
        </div>
        <div className="h-1 bg-secondary rounded-full">
          <div className="h-full bg-gradient-to-r from-primary to-accent2 rounded-full transition-all duration-300"
               style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}