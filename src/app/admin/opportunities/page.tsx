import { UserRole } from "@/generated/prisma/enums";
import { OpportunitiesManager } from "@/components/admin/opportunities-manager";
import { requireRole } from "@/lib/session";

export default async function AdminOpportunitiesPage() {
  await requireRole(UserRole.ADMIN);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Opportunities intake</h1>
      <p className="mb-6 text-sm text-slate-600">Enter company requests from WhatsApp and keep roles private.</p>
      <OpportunitiesManager />
    </main>
  );
}
