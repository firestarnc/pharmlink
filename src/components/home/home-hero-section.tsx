import Image from "next/image";
import Link from "next/link";

export function HomeHeroSection({ headingClassName }: { headingClassName: string }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-8 sm:pb-14">
      <div className="relative overflow-hidden rounded-4xl border border-slate-800 bg-slate-950 text-slate-100 shadow-[0_40px_100px_-45px_rgba(2,6,23,0.9)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.35),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(20,184,166,0.22),transparent_40%)]" />

        <div className="hero-content relative grid items-stretch gap-8 px-5 py-8 sm:gap-8 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="flex flex-col justify-center">
            <p className="mb-4 inline-flex w-fit rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
              Trusted Pharmacy Placement
            </p>

            <h1 className={`${headingClassName} text-4xl leading-[0.95] sm:text-5xl lg:text-7xl`}>
              Introducing PharmaLink, a private pharmacy talent collective.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:mt-5 sm:text-base lg:text-lg">
              Get accessible and personalized pharmacist career matching from the comfort of your home.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-emerald-600"
              >
                Join as Pharmacist
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-slate-400/60 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
              >
                Login
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 text-xs font-medium text-slate-300">
              <span className="rounded-full bg-slate-900/80 px-3 py-1">Verified Profiles</span>
              <span className="rounded-full bg-slate-900/80 px-3 py-1">Curated Matching</span>
              <span className="rounded-full bg-slate-900/80 px-3 py-1">Lagos + Remote</span>
            </div>
          </div>

          <div className="relative min-h-80 sm:min-h-85 lg:min-h-130">
            <div className="absolute inset-0 rotate-2 rounded-[26px] bg-emerald-300/12" />
            <div className="absolute inset-0 -rotate-2 rounded-[26px] border border-emerald-200/25" />

            <div className="hero-image relative h-full overflow-hidden rounded-[26px] border border-slate-700/60">
              <Image
                src="/excel.jpg"
                alt="Pharmacists and clinical workspace"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/55 via-transparent to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/20 bg-black/40 p-3 backdrop-blur-sm sm:bottom-4 sm:left-4 sm:right-4 sm:p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-emerald-200">Pilot-ready platform</p>
                <p className="mt-1 text-xs text-slate-100 sm:text-sm">Faster hiring connections for pharmacists and pharmacy teams.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}