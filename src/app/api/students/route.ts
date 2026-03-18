import { NextRequest, NextResponse } from "next/server";
import getDb, { Student } from "@/lib/db";

// POST — 학생 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, department, grade, region, keywords, discord_id } = body;

    if (!name || !department || !grade || !region) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    if (grade < 1 || grade > 4) {
      return NextResponse.json(
        { error: "학년은 1~4 사이여야 합니다." },
        { status: 400 }
      );
    }

    const db = getDb();
    const stmt = db.prepare(
      "INSERT INTO students (name, department, grade, region, keywords, discord_id) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const result = stmt.run(
      name,
      department,
      Number(grade),
      region,
      JSON.stringify(keywords || []),
      discord_id || null
    );

    return NextResponse.json(
      { id: result.lastInsertRowid, message: "학생이 등록되었습니다." },
      { status: 201 }
    );
  } catch (error) {
    console.error("학생 등록 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET — 전체 학생 조회
export async function GET() {
  try {
    const db = getDb();
    const students = db
      .prepare("SELECT * FROM students ORDER BY created_at DESC")
      .all() as Student[];

    const parsed = students.map((s) => ({
      ...s,
      keywords: JSON.parse(s.keywords),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("학생 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
