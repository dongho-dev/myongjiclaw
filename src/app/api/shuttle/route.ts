import { NextResponse } from "next/server";

// 명지대 셔틀버스 시간표 (인문캠퍼스 ↔ 자연캠퍼스 기준)
// 실제 운행 시간은 학교 공지에 따라 변동될 수 있음
const SHUTTLE_TIMETABLE = {
  weekday: {
    label: "평일 (월~금)",
    routes: [
      {
        name: "진입로 → 명지대역",
        times: [
          "08:00", "08:20", "08:40", "09:00", "09:20", "09:40",
          "10:00", "10:30", "11:00", "11:30",
          "12:00", "12:30", "13:00", "13:30",
          "14:00", "14:30", "15:00", "15:30",
          "16:00", "16:30", "17:00", "17:30",
          "18:00", "18:30", "19:00", "19:30", "20:00",
        ],
      },
      {
        name: "명지대역 → 진입로",
        times: [
          "08:10", "08:30", "08:50", "09:10", "09:30", "09:50",
          "10:10", "10:40", "11:10", "11:40",
          "12:10", "12:40", "13:10", "13:40",
          "14:10", "14:40", "15:10", "15:40",
          "16:10", "16:40", "17:10", "17:40",
          "18:10", "18:40", "19:10", "19:40", "20:10",
        ],
      },
    ],
  },
  weekend: {
    label: "주말·공휴일",
    routes: [
      {
        name: "진입로 → 명지대역",
        times: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
      },
      {
        name: "명지대역 → 진입로",
        times: ["09:10", "10:10", "11:10", "13:10", "14:10", "15:10", "16:10", "17:10"],
      },
    ],
  },
  vacation: {
    label: "방학 중",
    routes: [
      {
        name: "진입로 → 명지대역",
        times: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
      },
      {
        name: "명지대역 → 진입로",
        times: ["09:10", "10:10", "11:10", "12:10", "13:10", "14:10", "15:10", "16:10", "17:10"],
      },
    ],
  },
  notice: "시간표는 참고용이며, 실제 운행은 학교 공지를 확인하세요.",
};

function getNextShuttle(times: string[]): string | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const time of times) {
    const [h, m] = time.split(":").map(Number);
    if (h * 60 + m > currentMinutes) {
      return time;
    }
  }
  return null;
}

function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

// GET — 셔틀버스 시간표
export async function GET() {
  const scheduleType = isWeekend() ? "weekend" : "weekday";
  const schedule = SHUTTLE_TIMETABLE[scheduleType];

  const routesWithNext = schedule.routes.map((route) => ({
    ...route,
    next: getNextShuttle(route.times),
  }));

  return NextResponse.json({
    today: scheduleType,
    label: schedule.label,
    routes: routesWithNext,
    all_schedules: SHUTTLE_TIMETABLE,
    notice: SHUTTLE_TIMETABLE.notice,
  });
}
