import type {Metadata} from "next";
import {Onest, Unbounded} from "next/font/google";
import {cn} from "@/lib/utils";
import BottomNav from "@/components/layout/BottomNav";
import "./globals.css";


const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-onest',
})

const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600'],
  variable: '--font-unbounded',
})

export const metadata: Metadata = {
  title: "Workshift",
  description: "Приложение для формирования сменного отчёта",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={cn("dark font-sans", onest.variable, unbounded.variable)}
    >
    <body>
    <div className="max-w-[480px] mx-auto pt-10 px-4 pb-20">
      {children}
    </div>
    <BottomNav />
    </body>
    </html>
  );
}
