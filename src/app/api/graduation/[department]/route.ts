import { NextRequest, NextResponse } from "next/server";

// 학과별 졸업요건 데이터
// 실제 데이터는 학교 학사 안내를 기준으로 업데이트 필요
const GRADUATION_REQUIREMENTS: Record<
  string,
  {
    total_credits: number;
    major_credits: number;
    general_credits: number;
    language: string;
    gpa_minimum: number;
    etc: string[];
  }
> = {
  컴퓨터공학과: {
    total_credits: 130,
    major_credits: 66,
    general_credits: 36,
    language: "토익 700점 이상 또는 동등 어학 성적",
    gpa_minimum: 2.0,
    etc: [
      "졸업작품 또는 졸업논문 필수",
      "현장실습 1회 이상 권장",
      "전공필수: 자료구조, 알고리즘, 운영체제, 데이터베이스, 컴퓨터네트워크",
    ],
  },
  소프트웨어학과: {
    total_credits: 130,
    major_credits: 66,
    general_credits: 36,
    language: "토익 700점 이상 또는 동등 어학 성적",
    gpa_minimum: 2.0,
    etc: [
      "캡스톤디자인 필수",
      "인턴십 또는 현장실습 1회 이상 권장",
      "전공필수: 소프트웨어공학, 웹프로그래밍, 모바일프로그래밍",
    ],
  },
  정보통신공학과: {
    total_credits: 130,
    major_credits: 66,
    general_credits: 36,
    language: "토익 700점 이상 또는 동등 어학 성적",
    gpa_minimum: 2.0,
    etc: [
      "졸업작품 필수",
      "전공필수: 신호및시스템, 통신이론, 디지털신호처리",
    ],
  },
  전자공학과: {
    total_credits: 130,
    major_credits: 66,
    general_credits: 36,
    language: "토익 700점 이상 또는 동등 어학 성적",
    gpa_minimum: 2.0,
    etc: [
      "졸업작품 필수",
      "전공필수: 회로이론, 전자기학, 반도체공학",
    ],
  },
  경영학과: {
    total_credits: 130,
    major_credits: 60,
    general_credits: 39,
    language: "토익 700점 이상 또는 동등 어학 성적",
    gpa_minimum: 2.0,
    etc: [
      "전공필수: 경영학원론, 회계원리, 마케팅원론, 재무관리",
      "복수전공 시 전공학점 45학점으로 축소 가능",
    ],
  },
  경제학과: {
    total_credits: 130,
    major_credits: 60,
    general_credits: 39,
    language: "토익 700점 이상 또는 동등 어학 성적",
    gpa_minimum: 2.0,
    etc: [
      "전공필수: 미시경제학, 거시경제학, 경제수학, 계량경제학",
    ],
  },
  법학과: {
    total_credits: 130,
    major_credits: 60,
    general_credits: 39,
    language: "토익 650점 이상 또는 동등 어학 성적",
    gpa_minimum: 2.0,
    etc: [
      "전공필수: 헌법, 민법총칙, 형법총론",
      "모의재판 참여 권장",
    ],
  },
  행정학과: {
    total_credits: 130,
    major_credits: 60,
    general_credits: 39,
    language: "토익 650점 이상 또는 동등 어학 성적",
    gpa_minimum: 2.0,
    etc: [
      "전공필수: 행정학원론, 정책학원론, 조직론",
    ],
  },
  국어국문학과: {
    total_credits: 130,
    major_credits: 54,
    general_credits: 42,
    language: "토익 600점 이상 또는 동등 어학 성적",
    gpa_minimum: 2.0,
    etc: [
      "졸업논문 필수",
      "전공필수: 국어학개론, 국문학개론, 현대문학사",
    ],
  },
  영어영문학과: {
    total_credits: 130,
    major_credits: 54,
    general_credits: 42,
    language: "토익 800점 이상 또는 동등 어학 성적",
    gpa_minimum: 2.0,
    etc: [
      "원어 강의 6과목 이상 이수",
      "전공필수: 영어학개론, 영문학개론, 영작문",
    ],
  },
  건축학과: {
    total_credits: 160,
    major_credits: 90,
    general_credits: 30,
    language: "토익 700점 이상 또는 동등 어학 성적",
    gpa_minimum: 2.0,
    etc: [
      "5년제 (건축학 인증 프로그램)",
      "설계 스튜디오 전 학기 이수 필수",
      "현장실습 필수",
    ],
  },
  수학과: {
    total_credits: 130,
    major_credits: 60,
    general_credits: 39,
    language: "토익 650점 이상 또는 동등 어학 성적",
    gpa_minimum: 2.0,
    etc: [
      "전공필수: 해석학, 선형대수학, 현대대수학",
      "졸업시험 또는 졸업논문 택1",
    ],
  },
};

// GET — 학과별 졸업요건 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ department: string }> }
) {
  try {
    const { department } = await params;
    const decoded = decodeURIComponent(department);

    const requirement = GRADUATION_REQUIREMENTS[decoded];

    if (!requirement) {
      const available = Object.keys(GRADUATION_REQUIREMENTS);
      return NextResponse.json(
        {
          error: `'${decoded}' 학과의 졸업요건 정보가 없습니다.`,
          available_departments: available,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      department: decoded,
      ...requirement,
    });
  } catch (error) {
    console.error("졸업요건 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
