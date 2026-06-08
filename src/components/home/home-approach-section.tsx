export function HomeApproachSection({ headingClassName }: { headingClassName: string }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16 text-center">
      <h2 className={`${headingClassName} text-4xl text-slate-900 sm:text-5xl`}>Our approach</h2>
      <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
        We operate as a private pharmacy talent collective, matching verified professionals to real pharmaceutical opportunities. We are not a public job board. 
        Every pharmacist profile is reviewed for fit, availability, and readiness before opportunity introductions.
      </p>
    </section>
  );
}