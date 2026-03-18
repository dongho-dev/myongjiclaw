import { NextRequest, NextResponse } from "next/server";
import getDb, { Student } from "@/lib/db";

// POST — 공지 키워드로 매칭 학생 조회 + 알림 이력 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, department, region, grade } = body;

    if (!keyword) {
      return NextResponse.json(
        { error: "매칭할 키워드를 입력해주세요." },
        { status: 400 }
      );
    }

    const db = getDb();

    let query = "SELECT * FROM students WHERE keywords LIKE ?";
    const params: (string | number)[] = [`%${keyword}%`];

    if (department) {
      query += " AND department = ?";
      params.push(department);
    }
    if (region) {
      query += " AND region = ?";
      params.push(region);
    }
    if (grade) {
      query += " AND grade = ?";
      params.push(Number(grade));
    }

    query += " ORDER BY created_at DESC";

    const students = db.prepare(query).all(...params) as Student[];

    const parsed = students.map((s) => ({
      ...s,
      keywords: JSON.parse(s.keywords),
    }));

    return NextResponse.json({
      keyword,
      matched_count: parsed.length,
      students: parsed,
    });
  } catch (error) {
    console.error("매칭 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET — 필터 기반 학생 검색 (쿼리 파라미터)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const grade = searchParams.get("grade");
    const region = searchParams.get("region");
    const keyword = searchParams.get("keyword");

    const db = getDb();
    let query = "SELECT * FROM students WHERE 1=1";
    const params: (string | number)[] = [];

    if (department) {
      query += " AND department = ?";
      params.push(department);
    }
    if (grade) {
      query += " AND grade = ?";
      params.push(Number(grade));
    }
    if (region) {
      query += " AND region = ?";
      params.push(region);
    }
    if (keyword) {
      query += " AND keywords LIKE ?";
      params.push(`%${keyword}%`);
    }

    query += " ORDER BY created_at DESC";

    const students = db.prepare(query).all(...params) as Student[];

    const parsed = students.map((s) => ({
      ...s,
      keywords: JSON.parse(s.keywords),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("매칭 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
