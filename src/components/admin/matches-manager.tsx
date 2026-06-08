"use client";

import { MatchStatus } from "@/generated/prisma/enums";
import { FormEvent, useEffect, useState } from "react";

type Option = { id: string; label: string };
type MatchRow = {
  id: string;
  status: MatchStatus;
  opportunity: { title: string };
  pharmacistProfile: { user: { fullName: string; email: string } };
};

const statuses = Object.values(MatchStatus);

export function MatchesManager({
  opportunities,
  profiles,
}: {
  opportunities: Option[];
  profiles: Option[];
}) {
  const [rows, setRows] = useState<MatchRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/admin/matches");
    if (!response.ok) {
      setError("Could not load matches");
      return;
    }
    const data = (await response.json()) as MatchRow[];
    setRows(data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createMatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/admin/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunityId: String(formData.get("opportunityId")),
        pharmacistProfileId: String(formData.get("pharmacistProfileId")),
        adminNotes: String(formData.get("adminNotes") ?? "") || undefined,
      }),
    });

    if (!response.ok) {
      setError("Failed to create match");
      return;
    }

    form.reset();
    await load();
  }

  async function updateStatus(matchId: string, status: MatchStatus) {
    await fetch("/api/admin/matches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, status }),
    });
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={createMatch} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Create match</h2>
        <select name="opportunityId" required className="w-full rounded-md border border-slate-300 px-3 py-2">
          <option value="">Select opportunity</option>
          {opportunities.map((opportunity) => (
            <option key={opportunity.id} value={opportunity.id}>
              {opportunity.label}
            </option>
          ))}
        </select>
        <select name="pharmacistProfileId" required className="w-full rounded-md border border-slate-300 px-3 py-2">
          <option value="">Select pharmacist</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.label}
            </option>
          ))}
        </select>
        <textarea name="adminNotes" rows={4} placeholder="Notes" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create match</button>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold">Recent matches</h2>
        <div className="space-y-2">
          {rows.map((row) => (
            <article key={row.id} className="rounded-md border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">{row.opportunity.title}</p>
              <p className="text-xs text-slate-600">{row.pharmacistProfile.user.fullName}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(row.id, status)}
                    className={`rounded px-2 py-1 text-xs ${
                      row.status === status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                    type="button"
                  >
                    {status.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            </article>
          ))}
          {rows.length === 0 ? <p className="text-sm text-slate-600">No matches yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
