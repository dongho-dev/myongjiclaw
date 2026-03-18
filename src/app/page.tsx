"use client";

import { useState } from "react";

const DEPARTMENTS = [
  "국어국문학과", "영어영문학과", "중어중문학과", "일어일문학과",
  "경영학과", "경제학과", "무역학과", "경영정보학과",
  "법학과", "행정학과", "정치외교학과",
  "컴퓨터공학과", "정보통신공학과", "전자공학과", "소프트웨어학과",
  "수학과", "물리학과", "화학과",
  "건축학과", "토목환경공학과", "교통공학과",
  "식품영양학과", "아동학과",
];

const REGIONS = [
  "서울", "경기", "인천", "강원",
  "충북", "충남/대전", "전북", "전남/광주",
  "경북/대구", "경남/부산/울산", "제주",
];

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    department: "",
    grade: "",
    region: "",
    campus: "인문",
    discord_id: "",
  });
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addKeyword() {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed) && keywords.length < 10) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput("");
    }
  }

  function removeKeyword(kw: string) {
    setKeywords(keywords.filter((k) => k !== kw));
  }

  function handleKeywordKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
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
          department: form.department,
          grade: Number(form.grade),
          region: form.region,
          campus: form.campus,
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
      setForm({ name: "", department: "", grade: "", region: "", campus: "인문", discord_id: "" });
      setKeywords([]);
    } catch {
      setStatus({ type: "error", message: "서버에 연결할 수 없습니다." });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-blue-500/20";

  return (
    <div className="mx-auto max-w-lg">
      {/* Hero */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          명지대 학생 전용
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          프로필 등록
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          관심 키워드를 등록하면 맞춤 알림을 받을 수 있어요.
        </p>
      </div>

      {/* Status */}
      {status && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
              : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
          }`}
        >
          <span>{status.type === "success" ? "✓" : "!"}</span>
          {status.message}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        {/* 이름 */}
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            이름 <span className="text-red-400">*</span>
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

        {/* 학과 */}
        <div>
          <label
            htmlFor="department"
            className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            학과 <span className="text-red-400">*</span>
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
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* 캠퍼스 */}
        <div>
          <label
            htmlFor="campus"
            className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            캠퍼스 <span className="text-red-400">*</span>
          </label>
          <select
            id="campus"
            name="campus"
            required
            value={form.campus}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="인문">인문캠퍼스</option>
            <option value="자연">자연캠퍼스</option>
          </select>
        </div>

        {/* 학년 + 지역 (2열) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="grade"
              className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
            >
              학년 <span className="text-red-400">*</span>
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
              className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
            >
              지역 <span className="text-red-400">*</span>
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

        {/* Discord ID */}
        <div>
          <label
            htmlFor="discord_id"
            className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Discord ID{" "}
            <span className="font-normal text-zinc-400">(선택)</span>
          </label>
          <input
            id="discord_id"
            name="discord_id"
            type="text"
            value={form.discord_id}
            onChange={handleChange}
            placeholder="username#1234"
            className={inputClass}
          />
        </div>

        {/* 관심 키워드 */}
        <div>
          <label
            htmlFor="keyword"
            className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            관심 키워드{" "}
            <span className="font-normal text-zinc-400">(최대 10개)</span>
          </label>
          <div className="flex gap-2">
            <input
              id="keyword"
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordKeyDown}
              placeholder="예: 장학금, 취업, 동아리"
              className={`flex-1 ${inputClass}`}
            />
            <button
              type="button"
              onClick={addKeyword}
              className="shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              추가
            </button>
          </div>
          {keywords.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    className="text-blue-400 transition-colors hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className="border-t border-zinc-100 dark:border-zinc-800" />

        {/* 제출 */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:hover:shadow-sm"
        >
          {submitting ? "등록 중..." : "프로필 등록하기"}
        </button>
      </form>
    </div>
  );
}
