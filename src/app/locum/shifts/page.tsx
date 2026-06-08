import { ShiftStatus, UserRole } from "@/generated/prisma/enums";
import { LocumShiftsList } from "@/components/pharmacist/locum-shifts-list";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export default async function LocumShiftsPage() {
  await requireRole(UserRole.PHARMACIST);

  const shifts = await db.locumShift.findMany({
    where: { status: ShiftStatus.OPEN },
    orderBy: { date: "asc" },
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Locum shifts</h1>
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
    </main>
  );
}
