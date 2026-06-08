import Link from "next/link";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { PaymentStatus, UserRole } from "@/generated/prisma/enums";
import { LogoutButton } from "@/components/auth/logout-button";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export default async function AdminDashboardPage() {
  await requireRole(UserRole.ADMIN);

  const [pharmacists, opportunities, matches, paymentsDue] = await Promise.all([
    db.pharmacistProfile.count(),
    db.opportunity.count(),
    db.match.count(),
    db.paymentRecord.count({ where: { status: PaymentStatus.DUE } }),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-600">Manage matching operations for Lagos.</p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <LogoutButton />
        </div>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Pharmacists</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{pharmacists}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Opportunities</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{opportunities}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Matches</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{matches}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Payments due</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{paymentsDue}</p>
        </article>
      </section>

      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/pharmacists" className="rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-900">
          Pharmacists and verification
        </Link>
        <Link href="/admin/opportunities" className="rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-900">
          Opportunities
        </Link>
        <Link href="/admin/matches" className="rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-900">
          Matches
        </Link>
        <Link href="/admin/locum-shifts" className="rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-900">
          Locum shifts
        </Link>
        <Link href="/admin/payments" className="rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-900">
          Payments ledger
        </Link>
      </section>
    </main>
  );
}
