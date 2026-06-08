export function HomeTestimonialsSection({ headingClassName }: { headingClassName: string }) {
  const reviews = [
    {
      quote:
        "PharmaLink helped me find a role I truly connected with. The process was clear, fast, and professional.",
      name: "Amaka O.",
      title: "PharmaLink Candidate",
    },
    {
      quote:
        "I got a high-quality locum placement in days. The team understood exactly what I needed.",
      name: "Ifeanyi M.",
      title: "Locum Pharmacist",
    },
    {
      quote:
        "The verification step gave me confidence. I only got contacted for serious and relevant opportunities.",
      name: "Aisha B.",
      title: "Community Pharmacist",
    },
    {
      quote:
        "From signup to interview intro, everything felt guided and intentional. It saved me weeks of searching.",
      name: "Tobi E.",
      title: "Pharmacist Intern",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 sm:p-12">
        <div className="mb-8 text-center">
          <h2 className={`${headingClassName} text-3xl leading-tight text-slate-900 sm:text-4xl`}>
            Trusted by pharmacists across different career stages
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm leading-7 text-slate-700">"{review.quote}"</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                {review.name}, {review.title}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}