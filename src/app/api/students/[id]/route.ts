import { NextRequest, NextResponse } from "next/server";
import getDb, { Student } from "@/lib/db";

// GET — 학생 단건 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const student = db
      .prepare("SELECT * FROM students WHERE id = ?")
      .get(Number(id)) as Student | undefined;

    if (!student) {
      return NextResponse.json(
        { error: "학생을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...student,
      keywords: JSON.parse(student.keywords),
    });
  } catch (error) {
    console.error("학생 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PUT — 학생 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, department, grade, region, keywords, discord_id } = body;

    if (!name || !department || !grade || !region) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const db = getDb();
    const existing = db
      .prepare("SELECT id FROM students WHERE id = ?")
      .get(Number(id));

    if (!existing) {
      return NextResponse.json(
        { error: "학생을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    db.prepare(
      `UPDATE students
       SET name = ?, department = ?, grade = ?, region = ?, keywords = ?, discord_id = ?, updated_at = datetime('now', 'localtime')
       WHERE id = ?`
    ).run(
      name,
      department,
      Number(grade),
      region,
      JSON.stringify(keywords || []),
      discord_id || null,
      Number(id)
    );

    return NextResponse.json({ message: "학생 정보가 수정되었습니다." });
  } catch (error) {
    console.error("학생 수정 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE — 학생 삭제
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const result = db
      .prepare("DELETE FROM students WHERE id = ?")
      .run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "학생을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "학생이 삭제되었습니다." });
  } catch (error) {
    console.error("학생 삭제 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
