'use client'

import Link from "next/link";
import {BarChart2, Home, Settings} from "lucide-react";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";

export default function BottomNav() {

  const pathname = usePathname()

  if(pathname === '/login') return null

  return (
    <nav className="flex fixed bottom-0 left-0 right-0  mx-auto bg-card uppercase text-xs ">
      <Link
        className={cn("flex-1 flex flex-col items-center gap-1 py-3 text-xs uppercase", pathname === "/" ? "text-primary" : "text-muted-foreground")}
        href="/"
      >
        <Home size={20} />
        Смена
      </Link>
      <Link
        className={cn("flex-1 flex flex-col items-center gap-1 py-3 text-xs uppercase", pathname === "/stats" ? "text-primary" : "text-muted-foreground")}
        href="/stats"
      >
        <BarChart2 size={20} />
        Статистика
      </Link>
      <Link
        className={cn("flex-1 flex flex-col items-center gap-1 py-3 text-xs uppercase", pathname === "/settings" ? "text-primary" : "text-muted-foreground")}
        href="/settings"
      >
        <Settings size={20} />
        Настройки
      </Link>
    </nav>
  )
}