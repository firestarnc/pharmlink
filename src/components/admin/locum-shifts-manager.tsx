"use client";

import { FormEvent, useEffect, useState } from "react";

type Shift = {
  id: string;
  title: string;
  lagosArea: string;
  payNaira: number;
  status: string;
  applications: { id: string }[];
};

export function LocumShiftsManager() {
  const [items, setItems] = useState<Shift[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/admin/locum-shifts");
    if (!response.ok) {
      setError("Could not load shifts");
      return;
    }
    const data = (await response.json()) as Shift[];
    setItems(data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/admin/locum-shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(formData.get("title")),
        companyName: String(formData.get("companyName")),
        lagosArea: String(formData.get("lagosArea")),
        date: String(formData.get("date")),
        startTime: String(formData.get("startTime")),
        endTime: String(formData.get("endTime")),
        payNaira: Number(formData.get("payNaira")),
        requirements: String(formData.get("requirements")),
      }),
    });

    if (!response.ok) {
      setError("Failed to create shift");
      return;
    }

    form.reset();
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Post locum shift</h2>
        <input name="title" required placeholder="Shift title" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <input name="companyName" required placeholder="Company" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <input name="lagosArea" required placeholder="Lagos area" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <input name="date" type="date" required className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <div className="grid grid-cols-2 gap-2">
          <input name="startTime" required placeholder="Start" className="rounded-md border border-slate-300 px-3 py-2" />
          <input name="endTime" required placeholder="End" className="rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <input name="payNaira" type="number" required placeholder="Pay (NGN)" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <textarea name="requirements" required rows={3} placeholder="Requirements" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create shift</button>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold">Open and recent shifts</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-md border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-600">{item.lagosArea}</p>
              <p className="text-xs text-slate-600">
                NGN {item.payNaira.toLocaleString()} | {item.status}
              </p>
              <p className="text-xs text-slate-600">Applications: {item.applications.length}</p>
            </article>
          ))}
          {items.length === 0 ? <p className="text-sm text-slate-600">No shifts yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
