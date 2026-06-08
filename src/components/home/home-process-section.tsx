import Link from "next/link";

const services = [
  {
    title: "Full-time Placement",
    body: "Permanent pharmacist hiring support for independent and group pharmacy operators.",
  },
  {
    title: "Locum Coverage",
    body: "Rapid short-term placement for leave cover, weekend shifts, and urgent staffing gaps.",
  },
  {
    title: "Intern Pipeline",
    body: "Structured talent matching for pharmacist interns building practical workplace experience.",
  },
  {
    title: "Technician Hiring",
    body: "Role-fit matching for pharmacy technicians across retail and clinical operations.",
  },
];

export function HomeProcessSection({ headingClassName }: { headingClassName: string }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="mb-7 text-center">
        <h2 className={`${headingClassName} text-4xl text-slate-900 sm:text-5xl`}>Our services</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <article key={service.title} className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
            <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{service.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="#contact"
          className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
}