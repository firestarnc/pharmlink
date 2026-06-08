type TeamMember = {
  name: string;
  role: string;
  bio: string;
};

const members: TeamMember[] = [
  {
    name: "Dr. Nneka Okafor",
    role: "Lead Clinical Advisor",
    bio: "Guides credential standards and candidate quality for pharmacist placement readiness.",
  },
  {
    name: "Samuel Adewale",
    role: "Talent Matching Lead",
    bio: "Matches pharmacist profiles to full-time and locum opportunities based on fit and urgency.",
  },
  {
    name: "Grace Ibeh",
    role: "Onboarding Specialist",
    bio: "Supports candidates through profile completion, verification, and interview preparation.",
  },
  {
    name: "Mariam Yusuf",
    role: "Employer Partnerships",
    bio: "Works with pharmacy owners and hiring managers to close high-quality roles faster.",
  },
];

export function HomeTeamSection({ headingClassName }: { headingClassName: string }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="mb-8 text-center">
        <h2 className={`${headingClassName} text-4xl text-slate-900 sm:text-5xl`}>Meet the team</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          A focused team committed to helping pharmacists find the right opportunities and helping employers hire with
          confidence.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => (
          <article key={member.name} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-lg font-semibold text-slate-900">{member.name}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">{member.role}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{member.bio}</p>
          </article>
        ))}
      </div>
    </section>
  );
}