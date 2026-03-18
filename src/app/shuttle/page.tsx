"use client";

import { useState, useEffect } from "react";
import { TopNav, BottomNav } from "@/components/nav";

interface Route {
  name: string;
  times: string[];
  next: string | null;
}

interface ShuttleData {
  today: string;
  label: string;
  routes: Route[];
  notice: string;
}

export default function ShuttlePage() {
  const [data, setData] = useState<ShuttleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shuttle")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function isTimePassed(time: string) {
    const now = new Date();
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m < now.getHours() * 60 + now.getMinutes();
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] pb-20 sm:pb-0 dark:bg-[#050a14]">
      <TopNav />
      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">🚌</div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-100">
            셔틀버스 시간표
          </h1>
          {data && (
            <p className="text-sm text-zinc-500">{data.label}</p>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-zinc-400">로딩 중...</div>
        ) : !data ? (
          <div className="py-20 text-center text-zinc-400">시간표를 가져올 수 없습니다</div>
        ) : (
          <div className="space-y-6">
            {data.routes.map((route) => (
              <div
                key={route.name}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    {route.name}
                  </h2>
                  {route.next && (
                    <span className="rounded-full bg-[#003876] px-3 py-1 text-xs font-bold text-white">
                      다음 {route.next}
                    </span>
                  )}
                </div>
                <div className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {route.times.map((time) => {
                      const passed = isTimePassed(time);
                      const isNext = time === route.next;
                      return (
                        <span
                          key={time}
                          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                            isNext
                              ? "bg-[#003876] text-white shadow-sm"
                              : passed
                                ? "bg-zinc-100 text-zinc-300 line-through dark:bg-zinc-800 dark:text-zinc-600"
                                : "bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {time}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-zinc-400">{data.notice}</p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
