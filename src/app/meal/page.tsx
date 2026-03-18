"use client";

import { useState, useEffect } from "react";
import { TopNav, BottomNav } from "@/components/nav";

interface MealData {
  date: string;
  day: string;
  meals: Record<string, string[]>;
  cached: boolean;
}

export default function MealPage() {
  const [data, setData] = useState<MealData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/meal")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const mealIcons: Record<string, string> = {
    조식: "🌅",
    중식: "☀️",
    석식: "🌙",
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] pb-20 sm:pb-0 dark:bg-[#050a14]">
      <TopNav />
      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">🍚</div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-100">
            오늘의 학식
          </h1>
          {data && (
            <p className="text-sm text-zinc-500">
              {data.date} ({data.day}요일)
            </p>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-zinc-400">메뉴 불러오는 중...</div>
        ) : !data ? (
          <div className="py-20 text-center text-zinc-400">메뉴를 가져올 수 없습니다</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(data.meals).map(([time, items]) => (
              <div
                key={time}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/80 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <span className="text-lg">{mealIcons[time] || "🍽️"}</span>
                  <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    {time}
                  </h2>
                </div>
                <div className="px-5 py-4">
                  {items.length === 0 ? (
                    <p className="text-sm text-zinc-400">메뉴 없음</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {items.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-zinc-700 dark:text-zinc-300"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
