"use client";

import { PaymentStatus, PayerType } from "@/generated/prisma/enums";
import { FormEvent, useEffect, useState } from "react";

type MatchOption = { id: string; label: string };
type PaymentRow = {
  id: string;
  payerType: PayerType;
  expectedAmountNaira: number;
  status: PaymentStatus;
  match: {
    opportunity: { title: string };
    pharmacistProfile: { user: { fullName: string } };
  };
};

const payerTypes = Object.values(PayerType);
const statuses = Object.values(PaymentStatus);

export function PaymentsManager({ matches }: { matches: MatchOption[] }) {
  const [rows, setRows] = useState<PaymentRow[]>([]);

  async function load() {
    const response = await fetch("/api/admin/payments");
    if (!response.ok) return;
    const data = (await response.json()) as PaymentRow[];
    setRows(data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    await fetch("/api/admin/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchId: String(formData.get("matchId")),
        payerType: String(formData.get("payerType")),
        expectedAmountNaira: Number(formData.get("expectedAmountNaira")),
        notes: String(formData.get("notes") ?? "") || undefined,
      }),
    });

    form.reset();
    await load();
  }

  async function updateStatus(paymentId: string, status: PaymentStatus) {
    await fetch("/api/admin/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId, status }),
    });
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={createPayment} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Create payment record</h2>
        <select name="matchId" required className="w-full rounded-md border border-slate-300 px-3 py-2">
          <option value="">Select hired match</option>
          {matches.map((match) => (
            <option key={match.id} value={match.id}>
              {match.label}
            </option>
          ))}
        </select>
        <select name="payerType" className="w-full rounded-md border border-slate-300 px-3 py-2">
          {payerTypes.map((payerType) => (
            <option key={payerType} value={payerType}>
              {payerType}
            </option>
          ))}
        </select>
        <input name="expectedAmountNaira" required type="number" placeholder="Amount (NGN)" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <textarea name="notes" rows={3} placeholder="Notes" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create</button>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold">Payment ledger</h2>
        <div className="space-y-2">
          {rows.map((row) => (
            <article key={row.id} className="rounded-md border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">{row.match.opportunity.title}</p>
              <p className="text-xs text-slate-600">{row.match.pharmacistProfile.user.fullName}</p>
              <p className="text-xs text-slate-600">
                {row.payerType} | NGN {row.expectedAmountNaira.toLocaleString()}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateStatus(row.id, status)}
                    className={`rounded px-2 py-1 text-xs ${
                      row.status === status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </article>
          ))}
          {rows.length === 0 ? <p className="text-sm text-slate-600">No payment records yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
