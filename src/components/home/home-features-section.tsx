export function HomeFeaturesSection({ headingClassName }: { headingClassName: string }) {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-14 md:grid-cols-2">
      <article className="rounded-3xl border border-slate-200 bg-white p-7">
        <h3 className={`${headingClassName} text-3xl text-slate-900 sm:text-4xl`}>
          Providing you with a safe path to your next role
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          Every profile review includes credential checks, role alignment, and communication support to make your next
          move confident and clear.
        </p>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-7">
        <h3 className={`${headingClassName} text-3xl text-slate-900 sm:text-4xl`}>
          In-person and remote opportunity options
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          From Lagos on-site placements to remote-friendly operations, we match pharmacists to opportunities based on
          location, flexibility, and long-term fit.
        </p>
      </article>
    </section>
  );
}