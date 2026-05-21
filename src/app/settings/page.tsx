import {Input} from "@/components/ui/input";

export default function SettingsPage() {
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
          placeholder="Ваше Фио"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="plan" className="text-xs uppercase text-muted-foreground tracking-wider">
          Дневной план
        </label>
        <Input id="plan" type="number" placeholder="8" />
      </div>
    </div>
  )
}