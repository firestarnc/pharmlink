"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Shift = {
  id: string;
  title: string;
  lagosArea: string;
  companyName: string;
  date: string;
  startTime: string;
  endTime: string;
  payNaira: number;
  requirements: string;
};

export function LocumShiftsList({ shifts }: { shifts: Shift[] }) {
  const router = useRouter();
  const [busyShiftId, setBusyShiftId] = useState<string | null>(null);

  async function apply(shiftId: string) {
    setBusyShiftId(shiftId);
    const response = await fetch("/api/locum/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId }),
    });

    setBusyShiftId(null);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      alert(data?.error ?? "Application failed");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-3">
      {shifts.map((shift) => (
        <article key={shift.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{shift.title}</h3>
              <p className="text-sm text-slate-600">{shift.lagosArea}</p>
              <p className="text-sm text-slate-600">
                {new Date(shift.date).toLocaleDateString()} | {shift.startTime} - {shift.endTime}
              </p>
              <p className="text-sm text-slate-700">{shift.requirements}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">NGN {shift.payNaira.toLocaleString()}</p>
              <button
                onClick={() => apply(shift.id)}
                disabled={busyShiftId === shift.id}
                className="mt-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {busyShiftId === shift.id ? "Applying..." : "Apply"}
              </button>
            </div>
          </div>
        </article>
      ))}
      {shifts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
          No open locum shifts currently.
        </p>
      ) : null}
    </div>
  );
}
