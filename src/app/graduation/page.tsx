"use client";

import { useState } from "react";
import { TopNav, BottomNav } from "@/components/nav";

interface GraduationData {
  department: string;
  total_credits: number;
  major_credits: number;
  general_credits: number;
  language: string;
  gpa_minimum: number;
  etc: string[];
}

const DEPARTMENTS = [
  "컴퓨터공학과", "소프트웨어학과", "정보통신공학과", "전자공학과",
  "경영학과", "경제학과", "법학과", "행정학과",
  "국어국문학과", "영어영문학과", "건축학과", "수학과",
];

export default function GraduationPage() {
  const [department, setDepartment] = useState("");
  const [data, setData] = useState<GraduationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(dept: string) {
    setDepartment(dept);
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/graduation/${encodeURIComponent(dept)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error);
        setData(null);
      } else {
        setData(json);
      }
    } catch {
      setError("조회에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] pb-20 sm:pb-0 dark:bg-[#050a14]">
      <TopNav />
      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">🎓</div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-100">
            졸업요건 조회
          </h1>
          <p className="text-sm text-zinc-500">학과를 선택하면 졸업에 필요한 조건을 확인할 수 있어요</p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              onClick={() => handleSearch(d)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                department === d
                  ? "border-[#003876] bg-[#003876]/5 text-[#003876] dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {loading && (
          <div className="py-10 text-center text-zinc-400">조회 중...</div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {data && !loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "총 이수학점", value: data.total_credits },
                { label: "전공학점", value: data.major_credits },
                { label: "교양학점", value: data.general_credits },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="text-xs font-medium text-zinc-400">
                    {item.label}
                  </div>
                  <div className="mt-1 text-2xl font-bold text-[#003876] dark:text-blue-300">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm font-medium text-zinc-500">어학 요건</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {data.language}
                  </span>
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm font-medium text-zinc-500">최소 평점</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {data.gpa_minimum} / 4.5
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                기타 요건
              </h3>
              <ul className="space-y-2">
                {data.etc.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#003876] dark:bg-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
