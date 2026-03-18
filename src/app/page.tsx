export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#003876]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-base font-extrabold text-[#003876]">
              M
            </div>
            <span className="text-lg font-bold text-white">명지클로</span>
          </a>
          <nav className="flex items-center gap-2">
            <a
              href="/register"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              프로필 등록
            </a>
            <a
              href="/dashboard"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              대시보드
            </a>
            <a
              href="/register"
              className="ml-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#003876] transition-all hover:bg-white/90"
            >
              시작하기
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#003876] via-[#004a9e] to-[#0060c7] px-5 pt-16 text-center">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl py-20 sm:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            명지대학교 학생 전용 서비스
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            학교생활의 모든 것,
            <br />
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              명지클로가 알려줄게요
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-blue-100/90 sm:text-xl">
            학식, 셔틀, 시간표, 졸업요건부터 맞춤 공지 알림까지.
            <br className="hidden sm:block" />
            AI 비서가 명지대 생활을 도와드립니다.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/register"
              className="w-full rounded-2xl bg-white px-8 py-4 text-base font-bold text-[#003876] shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              시작하기
            </a>
            <a
              href="/dashboard"
              className="w-full rounded-2xl border border-white/25 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto"
            >
              대시보드 보기
            </a>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0 40C360 80 720 0 1080 40C1260 60 1380 60 1440 55V80H0V40Z"
              className="fill-[#f7f9fc] dark:fill-[#050a14]"
            />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#003876] sm:text-3xl dark:text-blue-200">
            주요 기능
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            명지클로가 제공하는 서비스를 확인하세요
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "🔔",
              title: "맞춤 알림",
              desc: "관심 키워드를 등록하면 관련 공지가 올라올 때 자동으로 알려드려요.",
              href: "/register",
            },
            {
              icon: "🍚",
              title: "학식 메뉴",
              desc: "오늘 학식 뭐 나오는지 매일 자동으로 확인해서 알려드려요.",
              href: "/meal",
            },
            {
              icon: "🚌",
              title: "셔틀 시간표",
              desc: "다음 셔틀이 언제 오는지, 실시간으로 확인할 수 있어요.",
              href: "/shuttle",
            },
            {
              icon: "📅",
              title: "시간표 관리",
              desc: "내 시간표를 등록하고 언제든 조회할 수 있어요.",
              href: "/dashboard",
            },
            {
              icon: "🎓",
              title: "졸업요건 조회",
              desc: "학과별 졸업에 필요한 학점과 조건을 한눈에 확인하세요.",
              href: "/graduation",
            },
            {
              icon: "💬",
              title: "Discord 연동",
              desc: "Discord로 알림을 받을 수 있어요. 오픈클로 봇과 연동됩니다.",
              href: "/register",
            },
          ].map((f) => (
            <a
              key={f.title}
              href={f.href}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#003876]/20 hover:shadow-lg hover:shadow-[#003876]/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#003876]/5 text-2xl dark:bg-blue-900/30">
                {f.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {f.desc}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-5 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          지금 바로 시작하세요
        </h2>
        <p className="mb-8 text-zinc-500 dark:text-zinc-400">
          프로필 등록은 1분이면 충분합니다
        </p>
        <a
          href="/register"
          className="inline-block rounded-2xl bg-[#003876] px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#004a9e] hover:shadow-xl"
        >
          프로필 등록하기
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white px-5 py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-zinc-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#003876] text-[10px] font-bold text-white">
              M
            </div>
            <span>명지클로</span>
          </div>
          <p>명지대학교 학생들을 위한 AI 비서 서비스</p>
        </div>
      </footer>
    </div>
  );
}
