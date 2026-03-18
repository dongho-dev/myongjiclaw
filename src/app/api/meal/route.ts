import { NextResponse } from "next/server";
import getDb from "@/lib/db";

const MEAL_URL = "https://www.mju.ac.kr/mjukr/8595/subview.do";

interface MealCache {
  date: string;
  data: string;
  fetched_at: string;
}

function getTodayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getDayLabel() {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[new Date().getDay()];
}

async function fetchMealFromWeb(): Promise<Record<string, string[]>> {
  try {
    const res = await fetch(MEAL_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MyongjiClaw/1.0)",
      },
      signal: AbortSignal.timeout(10000),
    });
    const html = await res.text();

    const meals: Record<string, string[]> = {
      조식: [],
      중식: [],
      석식: [],
    };

    // 간단한 HTML 파싱 — <td> 안에서 메뉴 텍스트 추출
    const tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const items: string[] = [];
    let match;
    while ((match = tdPattern.exec(html)) !== null) {
      const text = match[1]
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
      if (text.length > 1 && text.length < 200) {
        items.push(text);
      }
    }

    // 메뉴 텍스트가 추출되면 시간대별로 할당
    if (items.length >= 3) {
      meals["조식"] = items.slice(0, Math.ceil(items.length / 3)).map((s) => s.trim()).filter(Boolean);
      meals["중식"] = items.slice(Math.ceil(items.length / 3), Math.ceil((items.length * 2) / 3)).map((s) => s.trim()).filter(Boolean);
      meals["석식"] = items.slice(Math.ceil((items.length * 2) / 3)).map((s) => s.trim()).filter(Boolean);
    }

    return meals;
  } catch {
    return {};
  }
}

// GET — 오늘 학식 메뉴 (캐시 적용)
export async function GET() {
  try {
    const today = getTodayStr();
    const db = getDb();

    // 캐시 확인
    const cached = db
      .prepare("SELECT * FROM meal_cache WHERE date = ?")
      .get(today) as MealCache | undefined;

    if (cached) {
      return NextResponse.json({
        date: today,
        day: getDayLabel(),
        meals: JSON.parse(cached.data),
        cached: true,
      });
    }

    // 크롤링
    const meals = await fetchMealFromWeb();

    // 빈 결과라도 캐시 (재크롤링 방지, 하루 단위)
    const mealData = Object.keys(meals).length > 0
      ? meals
      : {
          조식: ["메뉴 정보를 가져올 수 없습니다"],
          중식: ["메뉴 정보를 가져올 수 없습니다"],
          석식: ["메뉴 정보를 가져올 수 없습니다"],
        };

    db.prepare(
      "INSERT OR REPLACE INTO meal_cache (date, data) VALUES (?, ?)"
    ).run(today, JSON.stringify(mealData));

    return NextResponse.json({
      date: today,
      day: getDayLabel(),
      meals: mealData,
      cached: false,
    });
  } catch (error) {
    console.error("학식 조회 오류:", error);
    return NextResponse.json(
      { error: "학식 메뉴를 가져올 수 없습니다." },
      { status: 500 }
    );
  }
}
