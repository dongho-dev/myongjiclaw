"use client";

import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/meal", label: "학식", icon: "🍚" },
  { href: "/shuttle", label: "셔틀", icon: "🚌" },
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/graduation", label: "졸업", icon: "🎓" },
  { href: "/dashboard", label: "대시보드", icon: "📊" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur-md sm:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors ${
                active
                  ? "text-[#003876] dark:text-blue-300"
                  : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className={`text-[10px] font-semibold ${active ? "text-[#003876] dark:text-blue-300" : ""}`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#003876] text-xs font-bold text-white">
            M
          </div>
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            명지클로
          </span>
        </a>
        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => {
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#003876]/5 text-[#003876] dark:bg-blue-950/30 dark:text-blue-300"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {item.icon} {item.label}
              </a>
            );
          })}
          <a
            href="/register"
            className="ml-2 rounded-xl bg-[#003876] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#004a9e]"
          >
            등록
          </a>
        </nav>
      </div>
    </header>
  );
}
