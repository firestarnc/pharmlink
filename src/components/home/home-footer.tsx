import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 pb-10 pt-2 text-sm text-slate-600">
      <div className="grid gap-8 border-t border-slate-200 pt-8 md:grid-cols-4">
        <div>
          <p className="text-xl font-semibold text-slate-900">Stay in touch.</p>
          <p className="mt-2 text-sm text-slate-500">Private pharmacist talent matching for Lagos and beyond.</p>
        </div>

        <div>
          <p className="font-semibold text-slate-900">Questions?</p>
          <a href="mailto:hello@pharmalink.ng" className="mt-2 inline-block text-sm text-slate-600 underline">
            Contact us
          </a>
        </div>

        <div>
          <p className="font-semibold text-slate-900">Explore</p>
          <div className="mt-2 space-y-1">
            <Link href="/signup" className="block text-sm text-slate-600 hover:text-slate-900">
              Join as Pharmacist
            </Link>
            <Link href="/login" className="block text-sm text-slate-600 hover:text-slate-900">
              Login
            </Link>
          </div>
        </div>

        <div>
          <p className="font-semibold text-slate-900">PharmaLink</p>
          <p className="mt-2 text-sm text-slate-500">Verified candidates. Curated opportunities. Better outcomes.</p>
        </div>
      </div>
    </footer>
  );
}