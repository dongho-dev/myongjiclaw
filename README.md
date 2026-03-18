# 명지클로 (MyongjiClaw)

명지대학교 학생을 위한 맞춤 알림 서비스 웹앱.
학생 프로필과 관심 키워드를 등록하면 공지사항을 자동으로 매칭해 알림을 보내줍니다.

## Tech Stack

- **Frontend** — Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend** — Next.js API Routes
- **Database** — SQLite (better-sqlite3)
- **Language** — TypeScript

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
npm start
```

서버가 실행되면 `http://localhost:3000`에서 접속할 수 있습니다.

> DB 파일(`myongjiclaw.db`)은 프로젝트 루트에 자동 생성됩니다.

## Project Structure

```
src/
├── lib/
│   └── db.ts                             # SQLite 연결 + 테이블 초기화
├── app/
│   ├── page.tsx                          # 프로필 등록 페이지
│   ├── dashboard/page.tsx                # 대시보드 (학생 목록 / 매칭 / 알림 이력)
│   └── api/
│       ├── students/
│       │   ├── route.ts                  # GET: 전체 조회, POST: 등록
│       │   └── [id]/
│       │       ├── route.ts              # GET: 단건, PUT: 수정, DELETE: 삭제
│       │       └── timetable/route.ts    # GET: 시간표 조회, POST: 시간표 등록
│       ├── match/route.ts                # POST: 키워드 매칭, GET: 필터 검색
│       ├── notifications/route.ts        # GET: 알림 이력, POST: 알림 기록
│       ├── meal/route.ts                 # GET: 오늘 학식 메뉴
│       ├── shuttle/route.ts              # GET: 셔틀버스 시간표
│       └── graduation/
│           └── [department]/route.ts     # GET: 학과별 졸업요건
```

## API Reference

### Students (CRUD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/students` | 전체 학생 목록 |
| `POST` | `/api/students` | 학생 등록 |
| `GET` | `/api/students/:id` | 학생 단건 조회 |
| `PUT` | `/api/students/:id` | 학생 정보 수정 |
| `DELETE` | `/api/students/:id` | 학생 삭제 |

```json
// POST /api/students
{
  "name": "홍길동",
  "department": "컴퓨터공학과",
  "grade": 3,
  "region": "서울",
  "campus": "자연",
  "keywords": ["장학금", "취업"],
  "discord_id": "hong#1234"
}
```

### Match

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/match` | 공지 키워드로 매칭 학생 조회 |
| `GET` | `/api/match?keyword=&department=&region=&grade=` | 필터 기반 검색 |

```json
// POST /api/match
{
  "keyword": "장학금",
  "department": "컴퓨터공학과",
  "region": "서울",
  "grade": 3
}
```

### Timetable

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/students/:id/timetable` | 시간표 등록 (전체 교체) |
| `GET` | `/api/students/:id/timetable` | 시간표 조회 (요일별 그룹핑) |

```json
// POST /api/students/1/timetable
{
  "entries": [
    { "day": "mon", "period": 1, "subject": "자료구조", "professor": "김교수", "location": "S5101" },
    { "day": "mon", "period": 2, "subject": "알고리즘", "professor": "이교수", "location": "S5201" }
  ]
}
```

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | 알림 발송 이력 조회 |
| `POST` | `/api/notifications` | 알림 기록 저장 (중복 방지) |

동일한 `student_id + article_id` 조합은 중복 저장되지 않습니다.

### Meal

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/meal` | 오늘 학식 메뉴 (크롤링 + 하루 캐시) |

### Shuttle

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/shuttle` | 셔틀버스 시간표 + 다음 셔틀 시간 |

### Graduation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/graduation/:department` | 학과별 졸업요건 조회 |

```
GET /api/graduation/컴퓨터공학과
```

## Database Schema

```sql
-- 학생
students (id, name, department, grade, region, keywords, campus, discord_id, created_at, updated_at)

-- 알림 이력 (student_id + article_id UNIQUE)
notifications (id, student_id, article_id, board_type, sent_at)

-- 시간표
timetables (id, student_id, day, period, subject, professor, location)

-- 학식 캐시
meal_cache (date, data, fetched_at)
```

## License

MIT
