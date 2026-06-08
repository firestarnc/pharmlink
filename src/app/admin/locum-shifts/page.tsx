import { UserRole } from "@/generated/prisma/enums";
import { LocumShiftsManager } from "@/components/admin/locum-shifts-manager";
import { requireRole } from "@/lib/session";

export default async function AdminLocumShiftsPage() {
  await requireRole(UserRole.ADMIN);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Locum shifts</h1>
      <p className="mb-6 text-sm text-slate-600">Create and track temporary shift opportunities in Lagos.</p>
      <LocumShiftsManager />
    </main>
  );
}
