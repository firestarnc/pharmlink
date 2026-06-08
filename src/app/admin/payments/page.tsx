import { MatchStatus, UserRole } from "@/generated/prisma/enums";
import { PaymentsManager } from "@/components/admin/payments-manager";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export default async function AdminPaymentsPage() {
  await requireRole(UserRole.ADMIN);

  const hiredMatches = await db.match.findMany({
    where: { status: MatchStatus.HIRED },
    include: {
      opportunity: true,
      pharmacistProfile: { include: { user: true } },
    },
    orderBy: { decidedAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Payment tracking</h1>
      <p className="mb-6 text-sm text-slate-600">Track post-hire platform fees and commissions.</p>
      <PaymentsManager
        matches={hiredMatches.map((match) => ({
          id: match.id,
          label: `${match.opportunity.title} • ${match.pharmacistProfile.user.fullName}`,
        }))}
      />
    </main>
  );
}
