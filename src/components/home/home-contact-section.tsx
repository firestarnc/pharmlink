import Link from "next/link";

export function HomeContactSection({ headingClassName }: { headingClassName: string }) {
  const whatsappLink = "https://wa.me/2349033143705?text=Hi%20PharmaLink%2C%20I%20want%20to%20get%20started.";

  return (
    <section id="contact" className="mx-auto w-full max-w-6xl px-6 pb-14 pt-6">
      <div className="rounded-3xl border-2 border-emerald-300 bg-slate-900 px-6 py-10 text-center text-slate-100 shadow-[0_30px_80px_-30px_rgba(16,185,129,0.65)] sm:px-8 sm:py-14">
        <h2 className={`${headingClassName} mt-2 text-4xl leading-tight sm:text-5xl`}>
          Get started with PharmaLink, today.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          We help verified pharmacists get matched to the right opportunities quickly and safely.
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="mx-auto mt-7 inline-flex rounded-full bg-emerald-500 px-7 py-4 text-base font-bold text-white shadow-[0_20px_55px_-20px_rgba(16,185,129,0.9)] ring-4 ring-emerald-300/40 transition hover:scale-[1.02] hover:bg-emerald-600"
        >
          Contact us on WhatsApp
        </a>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Book a Consultation
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-slate-500 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            Login
          </Link>
          <p className="rounded-full border border-slate-500 px-6 py-3 text-sm font-semibold text-slate-100">
            WhatsApp response is fastest
          </p>
        </div>
      </div>
    </section>
  );
}