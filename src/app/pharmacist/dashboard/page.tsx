import Link from "next/link";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { ShiftStatus, UserRole, VerificationStatus } from "@/generated/prisma/enums";
import { LocumShiftsList } from "@/components/pharmacist/locum-shifts-list";
import { LogoutButton } from "@/components/auth/logout-button";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export default async function PharmacistDashboardPage() {
  const session = await requireRole(UserRole.PHARMACIST);

  const profile = await db.pharmacistProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      matches: {
        include: {
          opportunity: true,
          payments: true,
        },
        orderBy: { offeredAt: "desc" },
      },
    },
  });

  const shifts = await db.locumShift.findMany({
    where: { status: ShiftStatus.OPEN },
    orderBy: { date: "asc" },
    take: 20,
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pharmacist Dashboard</h1>
          <p className="text-sm text-slate-600">Welcome, {session.user.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <LogoutButton />
        </div>
      </div>

      {!profile ? (
        <section className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-lg font-semibold text-amber-900">Profile incomplete</h2>
          <p className="mt-1 text-sm text-amber-800">Create your profile before we can verify and match you.</p>
          <Link href="/pharmacist/onboarding" className="mt-3 inline-block rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white">
            Complete profile
          </Link>
        </section>
      ) : (
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Verification status</h2>
          <p className="mt-1 text-sm text-slate-600">Current status: {profile.verificationStatus.replaceAll("_", " ")}</p>
          {profile.verificationStatus === VerificationStatus.REJECTED && profile.verificationReason ? (
            <p className="mt-1 text-sm text-red-700">Reason: {profile.verificationReason}</p>
          ) : null}
          <Link href="/pharmacist/onboarding" className="mt-3 inline-block text-sm font-semibold text-slate-900 underline">
            Update profile
          </Link>
        </section>
      )}

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Match offers</h2>
        <div className="space-y-3">
          {profile?.matches.map((match) => (
            <article key={match.id} className="rounded-md border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">{match.opportunity.title}</p>
              <p className="text-xs text-slate-600">Status: {match.status.replaceAll("_", " ")}</p>
              <p className="text-xs text-slate-600">
                Salary range: {match.opportunity.salaryMin ?? "-"} - {match.opportunity.salaryMax ?? "-"}
              </p>
            </article>
          ))}
          {profile?.matches.length ? null : <p className="text-sm text-slate-600">No match offers yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Open locum shifts</h2>
        <LocumShiftsList
          shifts={shifts.map((shift) => ({
            id: shift.id,
            title: shift.title,
            lagosArea: shift.lagosArea,
            companyName: shift.companyName,
            date: shift.date.toISOString(),
            startTime: shift.startTime,
            endTime: shift.endTime,
            payNaira: shift.payNaira,
            requirements: shift.requirements,
          }))}
        />
      </section>
    </main>
  );
}
