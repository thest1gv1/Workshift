import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SERVICES} from "@/constants/services";

export default function AddPage() {
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
          placeholder="Иванов И.И."
        />
      </div>

      <div className="grid gap-2">
        <span className="text-xs uppercase text-muted-foreground tracking-wider">Тип</span>

        <div className="grid grid-cols-3 gap-2 text-muted-foreground">
          <Button
            size="lg"
            variant="outline"
            className="!bg-primary/20 !text-primary  !border-primary/50 "
          >Выдано</Button>
          <Button
            size="lg"
            variant="outline"
          >Перенос</Button>
          <Button
            size="lg"
            variant="outline"
          >Отказ</Button>
        </div>
      </div>

      <div className="grid gap-2">
        <span className="text-xs uppercase text-muted-foreground tracking-wider">Услуги</span>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((service) => (
            <span
              className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1"
              key={service.id}
            >{service.label}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <span className="text-xs uppercase text-muted-foreground tracking-wider">Примечания</span>
        <div>
          <textarea
            className="w-full h-20 bg-input/30 rounded-lg border border-border p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none focus:border-ring"
            placeholder="Проблемы, нет доступа к лк, арест..."
          />
        </div>
      </div>

      <Button size="lg">Сохранить клиента</Button>

    </div>
  )
}