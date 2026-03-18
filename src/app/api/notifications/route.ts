import { NextRequest, NextResponse } from "next/server";
import getDb, { Notification } from "@/lib/db";

// POST — 알림 발송 기록 저장 (중복 방지)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_id, article_id, board_type } = body;

    if (!student_id || !article_id || !board_type) {
      return NextResponse.json(
        { error: "student_id, article_id, board_type는 필수입니다." },
        { status: 400 }
      );
    }

    const db = getDb();

    // UNIQUE(student_id, article_id) 제약 조건으로 중복 방지
    const existing = db
      .prepare("SELECT id FROM notifications WHERE student_id = ? AND article_id = ?")
      .get(Number(student_id), String(article_id));

    if (existing) {
      return NextResponse.json(
        { error: "이미 발송된 알림입니다.", duplicate: true },
        { status: 409 }
      );
    }

    const result = db
      .prepare("INSERT INTO notifications (student_id, article_id, board_type) VALUES (?, ?, ?)")
      .run(Number(student_id), String(article_id), board_type);

    return NextResponse.json(
      { id: result.lastInsertRowid, message: "알림이 기록되었습니다." },
      { status: 201 }
    );
  } catch (error) {
    console.error("알림 저장 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET — 알림 이력 조회 (학생 이름 포함)
export async function GET() {
  try {
    const db = getDb();
    const notifications = db
      .prepare(`
        SELECT n.*, s.name as student_name, s.department
        FROM notifications n
        LEFT JOIN students s ON n.student_id = s.id
        ORDER BY n.sent_at DESC
        LIMIT 100
      `)
      .all() as (Notification & { student_name: string | null; department: string | null })[];

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("알림 이력 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
