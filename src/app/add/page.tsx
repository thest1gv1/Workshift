import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

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

    </div>
  )
}