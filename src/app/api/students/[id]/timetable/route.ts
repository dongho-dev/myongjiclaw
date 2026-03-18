import { NextRequest, NextResponse } from "next/server";
import getDb, { TimetableEntry } from "@/lib/db";

const VALID_DAYS = ["mon", "tue", "wed", "thu", "fri"];

// POST — 학생 시간표 등록 (기존 시간표 교체)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentId = Number(id);
    const body = await request.json();
    const { entries } = body as {
      entries: { day: string; period: number; subject: string; professor?: string; location?: string }[];
    };

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { error: "시간표 항목(entries)을 배열로 전달해주세요." },
        { status: 400 }
      );
    }

    const db = getDb();

    // 학생 존재 확인
    const student = db.prepare("SELECT id FROM students WHERE id = ?").get(studentId);
    if (!student) {
      return NextResponse.json(
        { error: "학생을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 유효성 검사
    for (const entry of entries) {
      if (!VALID_DAYS.includes(entry.day)) {
        return NextResponse.json(
          { error: `잘못된 요일: ${entry.day} (mon~fri)` },
          { status: 400 }
        );
      }
      if (!entry.period || entry.period < 1 || entry.period > 15) {
        return NextResponse.json(
          { error: `교시는 1~15 사이여야 합니다.` },
          { status: 400 }
        );
      }
      if (!entry.subject) {
        return NextResponse.json(
          { error: "과목명(subject)은 필수입니다." },
          { status: 400 }
        );
      }
    }

    // 트랜잭션: 기존 시간표 삭제 → 새로 삽입
    const insertMany = db.transaction((items: typeof entries) => {
      db.prepare("DELETE FROM timetables WHERE student_id = ?").run(studentId);

      const stmt = db.prepare(
        "INSERT INTO timetables (student_id, day, period, subject, professor, location) VALUES (?, ?, ?, ?, ?, ?)"
      );
      for (const item of items) {
        stmt.run(
          studentId,
          item.day,
          item.period,
          item.subject,
          item.professor || null,
          item.location || null
        );
      }
    });

    insertMany(entries);

    return NextResponse.json(
      { message: "시간표가 등록되었습니다.", count: entries.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("시간표 등록 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET — 학생 시간표 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentId = Number(id);
    const db = getDb();

    const student = db.prepare("SELECT id, name FROM students WHERE id = ?").get(studentId) as
      | { id: number; name: string }
      | undefined;

    if (!student) {
      return NextResponse.json(
        { error: "학생을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const entries = db
      .prepare(
        "SELECT * FROM timetables WHERE student_id = ? ORDER BY day, period"
      )
      .all(studentId) as TimetableEntry[];

    // 요일별로 그룹핑
    const grouped: Record<string, TimetableEntry[]> = {
      mon: [], tue: [], wed: [], thu: [], fri: [],
    };
    for (const entry of entries) {
      grouped[entry.day].push(entry);
    }

    return NextResponse.json({
      student_id: student.id,
      student_name: student.name,
      timetable: grouped,
      total: entries.length,
    });
  } catch (error) {
    console.error("시간표 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
