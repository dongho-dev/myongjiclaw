"use client";

import { useState, useEffect, useCallback } from "react";

interface Student {
  id: number;
  name: string;
  department: string;
  grade: number;
  region: string;
  keywords: string[];
  campus: string;
  discord_id: string | null;
  created_at: string;
}

interface Notification {
  id: number;
  student_id: number;
  article_id: string;
  board_type: string;
  sent_at: string;
  student_name: string | null;
  department: string | null;
}

interface MatchResult {
  keyword: string;
  matched_count: number;
  students: Student[];
}

export default function Dashboard() {
  const [tab, setTab] = useState<"students" | "match" | "history">("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const [matchKeyword, setMatchKeyword] = useState("");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [matching, setMatching] = useState(false);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data);
    } catch {
      console.error("학생 목록 로딩 실패");
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data);
    } catch {
      console.error("알림 이력 로딩 실패");
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchStudents(), fetchNotifications()]).finally(() =>
      setLoading(false)
    );
  }, [fetchStudents, fetchNotifications]);

  async function handleDelete(id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/students/${id}`, { method: "DELETE" });
    fetchStudents();
  }

  async function handleMatch(e: React.FormEvent) {
    e.preventDefault();
    if (!matchKeyword.trim()) return;
    setMatching(true);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: matchKeyword }),
      });
      const data = await res.json();
      setMatchResult(data);
    } catch {
      alert("매칭 오류");
    } finally {
      setMatching(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingStudent) return;
    await fetch(`/api/students/${editingStudent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingStudent),
    });
    setEditingStudent(null);
    fetchStudents();
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  const tabItems = [
    { key: "students" as const, label: "학생 목록" },
    { key: "match" as const, label: "매칭 테스트" },
    { key: "history" as const, label: "알림 이력" },
  ];

  const inputClass =
    "w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-[#003876] focus:ring-4 focus:ring-[#003876]/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#050a14]">
      {/* Header */}
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
          <div className="flex items-center gap-2">
            <a
              href="/register"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 hover:text-[#003876] dark:text-zinc-400"
            >
              프로필 등록
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {/* Title + Tabs */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-100">
            대시보드
          </h1>
          <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
            {tabItems.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  tab === t.key
                    ? "bg-[#003876] text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "총 학생", value: students.length },
            { label: "알림 발송", value: notifications.length },
            { label: "학과 수", value: new Set(students.map((s) => s.department)).size },
            { label: "Discord 연동", value: students.filter((s) => s.discord_id).length },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="text-xs font-medium text-zinc-400">{s.label}</div>
              <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tab: 학생 목록 */}
        {tab === "students" && (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            {students.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <p className="text-zinc-400">등록된 학생이 없습니다</p>
                <a
                  href="/register"
                  className="mt-4 inline-block text-sm font-semibold text-[#003876] hover:underline"
                >
                  프로필 등록하기
                </a>
              </div>
            ) : (
              <>
                {/* 모바일 카드 */}
                <div className="divide-y divide-zinc-100 sm:hidden dark:divide-zinc-800">
                  {students.map((s) => (
                    <div key={s.id} className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {s.name}
                          </span>
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                              s.campus === "자연"
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                                : "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                            }`}
                          >
                            {s.campus}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingStudent({ ...s })}
                            className="rounded-lg px-2 py-1 text-xs font-medium text-[#003876]"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="rounded-lg px-2 py-1 text-xs font-medium text-red-500"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                      <p className="mb-2 text-xs text-zinc-500">
                        {s.department} · {s.grade}학년 · {s.region}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {s.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="rounded-md bg-[#003876]/5 px-2 py-0.5 text-[11px] font-medium text-[#003876] dark:bg-blue-950/30 dark:text-blue-300"
                          >
                            {kw}
                          </span>
                        ))}
                        {s.discord_id && (
                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                            {s.discord_id}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 데스크톱 테이블 */}
                <div className="hidden overflow-x-auto sm:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-800/50">
                        {["이름", "캠퍼스", "학과", "학년", "지역", "키워드", "Discord", "등록일", "관리"].map(
                          (h, i) => (
                            <th
                              key={h}
                              className={`px-4 py-3 text-xs font-semibold text-zinc-400 ${
                                i === 8 ? "text-right" : "text-left"
                              }`}
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {students.map((s) => (
                        <tr
                          key={s.id}
                          className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                        >
                          <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                            {s.name}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                                s.campus === "자연"
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                                  : "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                              }`}
                            >
                              {s.campus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                            {s.department}
                          </td>
                          <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                            {s.grade}학년
                          </td>
                          <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                            {s.region}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {s.keywords.map((kw) => (
                                <span
                                  key={kw}
                                  className="rounded-md bg-[#003876]/5 px-2 py-0.5 text-xs font-medium text-[#003876] dark:bg-blue-950/30 dark:text-blue-300"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {s.discord_id ? (
                              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                                {s.discord_id}
                              </span>
                            ) : (
                              <span className="text-xs text-zinc-300">-</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                            {formatDate(s.created_at)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setEditingStudent({ ...s })}
                              className="mr-1 rounded-lg px-2 py-1 text-xs font-medium text-[#003876] hover:bg-[#003876]/5"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="rounded-lg px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab: 매칭 테스트 */}
        {tab === "match" && (
          <div className="space-y-6">
            <form
              onSubmit={handleMatch}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                공지 키워드 매칭
              </h2>
              <p className="mb-5 text-sm text-zinc-500">
                키워드를 입력하면 매칭되는 학생 목록을 조회합니다
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={matchKeyword}
                  onChange={(e) => setMatchKeyword(e.target.value)}
                  placeholder="예: 장학금"
                  className={`flex-1 ${inputClass}`}
                />
                <button
                  type="submit"
                  disabled={matching}
                  className="shrink-0 rounded-xl bg-[#003876] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#004a9e] disabled:opacity-50"
                >
                  {matching ? "검색 중..." : "매칭"}
                </button>
              </div>
            </form>

            {matchResult && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                    매칭 결과
                  </h3>
                  <span className="rounded-full bg-[#003876]/10 px-3 py-1 text-sm font-semibold text-[#003876] dark:bg-blue-950/30 dark:text-blue-300">
                    {matchResult.matched_count}명
                  </span>
                </div>
                {matchResult.students.length === 0 ? (
                  <p className="py-8 text-center text-sm text-zinc-400">
                    매칭되는 학생이 없습니다
                  </p>
                ) : (
                  <div className="space-y-2">
                    {matchResult.students.map((s) => (
                      <div
                        key={s.id}
                        className="flex flex-col gap-2 rounded-xl border border-zinc-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800"
                      >
                        <div>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {s.name}
                          </span>
                          <span className="ml-2 text-sm text-zinc-400">
                            {s.department} · {s.grade}학년
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {s.keywords.map((kw) => (
                            <span
                              key={kw}
                              className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                                kw === matchResult.keyword
                                  ? "bg-[#003876] text-white"
                                  : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                              }`}
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: 알림 이력 */}
        {tab === "history" && (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            {notifications.length === 0 ? (
              <div className="px-6 py-20 text-center text-zinc-400">
                알림 이력이 없습니다
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {n.student_name || `#${n.student_id}`}
                      </span>
                      <span className="ml-2 text-sm text-zinc-400">
                        {n.department}
                      </span>
                      <span className="ml-2 rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        {n.board_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="font-mono">{n.article_id}</span>
                      <span>{formatDate(n.sent_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 수정 모달 */}
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
            <form
              onSubmit={handleUpdate}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
            >
              <h2 className="mb-5 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                학생 정보 수정
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    이름
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, name: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      캠퍼스
                    </label>
                    <select
                      value={editingStudent.campus}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, campus: e.target.value })
                      }
                      className={inputClass}
                    >
                      <option value="인문">인문</option>
                      <option value="자연">자연</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      학년
                    </label>
                    <select
                      value={editingStudent.grade}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          grade: Number(e.target.value),
                        })
                      }
                      className={inputClass}
                    >
                      {[1, 2, 3, 4].map((g) => (
                        <option key={g} value={g}>
                          {g}학년
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    학과
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStudent.department}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        department: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Discord ID
                  </label>
                  <input
                    type="text"
                    value={editingStudent.discord_id || ""}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        discord_id: e.target.value || null,
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#003876] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#004a9e]"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
