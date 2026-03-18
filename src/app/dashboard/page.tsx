"use client";

import { useState, useEffect, useCallback } from "react";

interface Student {
  id: number;
  name: string;
  department: string;
  grade: number;
  region: string;
  keywords: string[];
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

  // 매칭 관련
  const [matchKeyword, setMatchKeyword] = useState("");
  const [matchTitle, setMatchTitle] = useState("");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [matching, setMatching] = useState(false);

  // 학생 수정 모달
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
        body: JSON.stringify({
          title: matchTitle || undefined,
          keyword: matchKeyword,
        }),
      });
      const data = await res.json();
      setMatchResult(data);
      fetchNotifications();
    } catch {
      alert("매칭 중 오류가 발생했습니다.");
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

  const tabClass = (t: string) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-all ${
      tab === t
        ? "bg-blue-600 text-white shadow-sm"
        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
    }`;

  const modalInputClass =
    "w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-zinc-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            대시보드
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            등록된 학생과 알림 이력을 관리합니다.
          </p>
        </div>
        <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            onClick={() => setTab("students")}
            className={tabClass("students")}
          >
            학생 목록
          </button>
          <button
            onClick={() => setTab("match")}
            className={tabClass("match")}
          >
            매칭 테스트
          </button>
          <button
            onClick={() => setTab("history")}
            className={tabClass("history")}
          >
            알림 이력
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            총 학생 수
          </div>
          <div className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {students.length}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            알림 발송
          </div>
          <div className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {notifications.length}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            학과 수
          </div>
          <div className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {new Set(students.map((s) => s.department)).size}
          </div>
        </div>
      </div>

      {/* Tab: 학생 목록 */}
      {tab === "students" && (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          {students.length === 0 ? (
            <div className="px-6 py-16 text-center text-zinc-400">
              등록된 학생이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                      이름
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                      학과
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                      학년
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                      지역
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                      Discord
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                      키워드
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                      등록일
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-zinc-500 dark:text-zinc-400">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {students.map((s) => (
                    <tr
                      key={s.id}
                      className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                        {s.name}
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
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                        {s.discord_id ? (
                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                            {s.discord_id}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-300 dark:text-zinc-600">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {s.keywords.map((kw) => (
                            <span
                              key={kw}
                              className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                        {formatDate(s.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setEditingStudent({ ...s })}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              공지 키워드 매칭
            </h2>
            <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
              공지 키워드를 입력하면 해당 키워드에 관심 있는 학생 목록을
              조회합니다.
            </p>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="matchTitle"
                  className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  알림 제목{" "}
                  <span className="font-normal text-zinc-400">(선택)</span>
                </label>
                <input
                  id="matchTitle"
                  type="text"
                  value={matchTitle}
                  onChange={(e) => setMatchTitle(e.target.value)}
                  placeholder="예: 2026학년도 1학기 장학금 안내"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label
                  htmlFor="matchKw"
                  className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  매칭 키워드 <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="matchKw"
                    type="text"
                    required
                    value={matchKeyword}
                    onChange={(e) => setMatchKeyword(e.target.value)}
                    placeholder="예: 장학금"
                    className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    type="submit"
                    disabled={matching}
                    className="shrink-0 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50"
                  >
                    {matching ? "검색 중..." : "매칭 검색"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {matchResult && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  매칭 결과
                </h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  {matchResult.matched_count}명 매칭
                </span>
              </div>
              {matchResult.students.length === 0 ? (
                <p className="py-8 text-center text-zinc-400">
                  &ldquo;{matchResult.keyword}&rdquo; 키워드와 매칭되는 학생이
                  없습니다.
                </p>
              ) : (
                <div className="space-y-2">
                  {matchResult.students.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-100 px-4 py-3 dark:border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {s.name}
                          </span>
                          <span className="ml-2 text-sm text-zinc-400">
                            {s.department} {s.grade}학년
                          </span>
                        </div>
                        {s.discord_id && (
                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                            {s.discord_id}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {s.keywords.map((kw) => (
                          <span
                            key={kw}
                            className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                              kw === matchResult.keyword
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
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
            <div className="px-6 py-16 text-center text-zinc-400">
              알림 이력이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                      학생
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                      학과
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                      게시판
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                      게시글 ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                      발송 시간
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {notifications.map((n) => (
                    <tr
                      key={n.id}
                      className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                        {n.student_name || `#${n.student_id}`}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {n.department || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          {n.board_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                        {n.article_id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                        {formatDate(n.sent_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 수정 모달 */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <form
            onSubmit={handleUpdate}
            className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
          >
            <h2 className="mb-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
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
                    setEditingStudent({
                      ...editingStudent,
                      name: e.target.value,
                    })
                  }
                  className={modalInputClass}
                />
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
                  className={modalInputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                    className={modalInputClass}
                  >
                    <option value={1}>1학년</option>
                    <option value={2}>2학년</option>
                    <option value={3}>3학년</option>
                    <option value={4}>4학년</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    지역
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStudent.region}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        region: e.target.value,
                      })
                    }
                    className={modalInputClass}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Discord ID{" "}
                  <span className="font-normal text-zinc-400">(선택)</span>
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
                  placeholder="username#1234"
                  className={modalInputClass}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
