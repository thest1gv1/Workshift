'use client'

import {settingsStore} from "@/store/settingsStore";
import {useStore} from "@nanostores/react";
import {Input} from "@/components/ui/input";

export default function SettingsPage() {

  const settings = useStore(settingsStore)

  return (
    <div className="grid gap-5">
      <h1>Настройки
      </h1>
      <div className="grid gap-2">
        <label
          htmlFor="name"
          className="text-xs uppercase text-muted-foreground tracking-wider"
        >Профиль
        </label>
        <Input
          id="name"
          value={settings.name}
          placeholder="Ваше Фио"
          onChange={(e) => settingsStore.set({
            ...settings,
            name: e.target.value
          })}
        />
      </div>
      <div className="grid gap-2">
        <label
          htmlFor="plan"
          className="text-xs uppercase text-muted-foreground tracking-wider"
        >
          Дневной план
        </label>
        <Input
          id="plan"
          value={settings.plan}
          type="number"
          placeholder="8"
          onChange={(e) => settingsStore.set({
            ...settings,
            plan: Number(e.target.value)
          })}
        />
      </div>
    </div>
  )
}