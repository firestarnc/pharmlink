import { UserRole, VerificationStatus } from "@/generated/prisma/enums";
import { MatchesManager } from "@/components/admin/matches-manager";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export default async function AdminMatchesPage() {
  await requireRole(UserRole.ADMIN);

  const [opportunities, profiles] = await Promise.all([
    db.opportunity.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.pharmacistProfile.findMany({
      where: { verificationStatus: VerificationStatus.VERIFIED },
      include: { user: true },
      orderBy: { updatedAt: "desc" },
      take: 200,
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Match management</h1>
      <p className="mb-6 text-sm text-slate-600">Match verified pharmacists to private opportunities.</p>
      <MatchesManager
        opportunities={opportunities.map((opportunity) => ({
          id: opportunity.id,
          label: `${opportunity.title} • ${opportunity.companyName}`,
        }))}
        profiles={profiles.map((profile) => ({
          id: profile.id,
          label: `${profile.user.fullName} • ${profile.category.replaceAll("_", " ")}`,
        }))}
      />
    </main>
  );
}
