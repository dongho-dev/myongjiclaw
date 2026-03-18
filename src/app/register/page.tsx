"use client";

import { useState } from "react";

const DEPARTMENTS: Record<string, string[]> = {
  인문: [
    "국어국문학과", "영어영문학과", "중어중문학과", "일어일문학과",
    "경영학과", "경제학과", "무역학과", "경영정보학과",
    "법학과", "행정학과", "정치외교학과",
    "아동학과", "식품영양학과",
  ],
  자연: [
    "컴퓨터공학과", "정보통신공학과", "전자공학과", "소프트웨어학과",
    "수학과", "물리학과", "화학과",
    "건축학과", "토목환경공학과", "교통공학과",
  ],
};

const KEYWORD_OPTIONS = [
  { label: "장학금", value: "장학금" },
  { label: "취업/채용", value: "취업" },
  { label: "교직", value: "교직" },
  { label: "고시/자격증", value: "고시" },
  { label: "동아리", value: "동아리" },
  { label: "봉사활동", value: "봉사" },
  { label: "대회/공모전", value: "공모전" },
  { label: "교환학생", value: "교환학생" },
  { label: "기숙사", value: "기숙사" },
  { label: "등록금", value: "등록금" },
];

const REGIONS = [
  "서울", "경기", "인천", "강원",
  "충북", "충남/대전", "전북", "전남/광주",
  "경북/대구", "경남/부산/울산", "제주",
];

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    campus: "인문",
    department: "",
    grade: "",
    region: "",
    discord_id: "",
  });
  const [keywords, setKeywords] = useState<string[]>([]);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    if (name === "campus") {
      setForm({ ...form, campus: value, department: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function toggleKeyword(kw: string) {
    setKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          campus: form.campus,
          department: form.department,
          grade: Number(form.grade),
          region: form.region,
          keywords,
          discord_id: form.discord_id || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data.error });
        return;
      }

      setStatus({ type: "success", message: "프로필이 등록되었습니다!" });
      setForm({
        name: "",
        campus: "인문",
        department: "",
        grade: "",
        region: "",
        discord_id: "",
      });
      setKeywords([]);
    } catch {
      setStatus({ type: "error", message: "서버에 연결할 수 없습니다." });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#003876] focus:ring-4 focus:ring-[#003876]/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

  const departments = DEPARTMENTS[form.campus] || [];

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#050a14]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#003876] text-xs font-bold text-white">
              M
            </div>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              명지클로
            </span>
          </a>
          <a
            href="/dashboard"
            className="text-sm font-medium text-zinc-500 hover:text-[#003876] dark:text-zinc-400"
          >
            대시보드
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-100">
            프로필 등록
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            관심 분야를 등록하면 맞춤 알림을 받을 수 있어요
          </p>
        </div>

        {/* Status */}
        {status && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
            }`}
          >
            <span className="text-base">
              {status.type === "success" ? "✓" : "!"}
            </span>
            {status.message}
            {status.type === "success" && (
              <a
                href="/dashboard"
                className="ml-auto text-sm font-semibold underline underline-offset-2"
              >
                대시보드에서 확인
              </a>
            )}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
        >
          {/* 이름 */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-200"
            >
              이름
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="홍길동"
              className={inputClass}
            />
          </div>

          {/* 캠퍼스 선택 (라디오 카드) */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              캠퍼스
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["인문", "자연"] as const).map((c) => (
                <label
                  key={c}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition-all ${
                    form.campus === c
                      ? "border-[#003876] bg-[#003876]/5 text-[#003876] dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="campus"
                    value={c}
                    checked={form.campus === c}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {c}캠퍼스
                </label>
              ))}
            </div>
          </div>

          {/* 학과 */}
          <div>
            <label
              htmlFor="department"
              className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-200"
            >
              학과
            </label>
            <select
              id="department"
              name="department"
              required
              value={form.department}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">학과를 선택하세요</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 학년 + 지역 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="grade"
                className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-200"
              >
                학년
              </label>
              <select
                id="grade"
                name="grade"
                required
                value={form.grade}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">선택</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
                <option value="4">4학년</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="region"
                className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-200"
              >
                지역
              </label>
              <select
                id="region"
                name="region"
                required
                value={form.region}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">선택</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 관심 키워드 체크박스 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              관심 키워드{" "}
              <span className="font-normal text-zinc-400">(복수 선택)</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {KEYWORD_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-all ${
                    keywords.includes(opt.value)
                      ? "border-[#003876] bg-[#003876]/5 font-medium text-[#003876] dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  <div
                    className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-all ${
                      keywords.includes(opt.value)
                        ? "border-[#003876] bg-[#003876] dark:border-blue-400 dark:bg-blue-500"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {keywords.includes(opt.value) && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={keywords.includes(opt.value)}
                    onChange={() => toggleKeyword(opt.value)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Discord ID */}
          <div>
            <label
              htmlFor="discord_id"
              className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-200"
            >
              Discord ID{" "}
              <span className="font-normal text-zinc-400">(선택)</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                </svg>
              </div>
              <input
                id="discord_id"
                name="discord_id"
                type="text"
                value={form.discord_id}
                onChange={handleChange}
                placeholder="username"
                className={`${inputClass} pl-10`}
              />
            </div>
            <p className="mt-1.5 text-xs text-zinc-400">
              Discord 알림을 받으려면 입력하세요
            </p>
          </div>

          {/* 구분선 */}
          <div className="border-t border-zinc-100 dark:border-zinc-800" />

          {/* 제출 */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#003876] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#004a9e] hover:shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? "등록 중..." : "프로필 등록하기"}
          </button>
        </form>
      </main>
    </div>
  );
}
