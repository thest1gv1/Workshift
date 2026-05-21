import {Badge} from "@/components/ui/badge";
import {SERVICES} from "@/constants/services";

interface ClientRowProps {
  name: string
  services: string[]
  type: 'issued' | 'transfer' | 'rejected'
}

const badgeVariant: Record<ClientRowProps['type'], 'default' | 'secondary' | 'destructive'> = {
  issued: 'default',
  transfer: 'secondary',
  rejected: 'destructive',
}

const badgeLabel = {
  issued: 'Выдано',
  transfer: 'Перенос',
  rejected: 'Отказ',
}

export default function ClientRow({name, services, type}: ClientRowProps) {


  return (
    <li className="flex items-center gap-2 p-4 bg-card rounded-xl border border-border active:bg-secondary/80 transition-colors duration-150">
      <div className="w-10 h-10 flex items-center justify-center bg-primary/20 text-primary text-xs rounded-lg">
        <span>{name[0].toUpperCase()}</span>
      </div>
      <div>
        <p className="text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">
          {services.map(id => SERVICES.find(s => s.id === id)?.label ?? id).join(', ')}
        </p>
      </div>
      <div className="ml-auto ">
        <Badge variant={badgeVariant[type]}>{badgeLabel[type]}</Badge></div>
    </li>
  )
}