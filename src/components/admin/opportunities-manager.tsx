"use client";

import { JobType, ProfessionalCategory } from "@/generated/prisma/enums";
import { FormEvent, useEffect, useState } from "react";

type Opportunity = {
  id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  category: string;
  createdAt: string;
};

const jobTypes = Object.values(JobType);
const categories = Object.values(ProfessionalCategory);

export function OpportunitiesManager() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/opportunities");
    if (!response.ok) {
      setError("Unable to load opportunities");
      return;
    }
    const data = (await response.json()) as Opportunity[];
    setItems(data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      title: String(formData.get("title")),
      companyName: String(formData.get("companyName")),
      companyContact: String(formData.get("companyContact") ?? "") || undefined,
      location: String(formData.get("location")),
      jobType: String(formData.get("jobType")),
      category: String(formData.get("category")),
      salaryMin: Number(formData.get("salaryMin") ?? 0) || undefined,
      salaryMax: Number(formData.get("salaryMax") ?? 0) || undefined,
      requirements: String(formData.get("requirements")),
      urgency: String(formData.get("urgency") ?? "") || undefined,
    };

    const response = await fetch("/api/admin/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Failed to create opportunity");
      return;
    }

    form.reset();
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Create opportunity</h2>
        <input name="title" required placeholder="Role title" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <input name="companyName" required placeholder="Company name" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <input name="companyContact" placeholder="WhatsApp/phone" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <input name="location" required defaultValue="Lagos" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <select name="jobType" className="w-full rounded-md border border-slate-300 px-3 py-2">
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select name="category" className="w-full rounded-md border border-slate-300 px-3 py-2">
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input name="salaryMin" type="number" placeholder="Salary min" className="rounded-md border border-slate-300 px-3 py-2" />
          <input name="salaryMax" type="number" placeholder="Salary max" className="rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <textarea name="requirements" required rows={4} placeholder="Requirements" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <input name="urgency" placeholder="Urgency" className="w-full rounded-md border border-slate-300 px-3 py-2" />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button disabled={loading} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? "Saving..." : "Save opportunity"}
        </button>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold">Recent opportunities</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-md border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-600">{item.companyName}</p>
              <p className="text-xs text-slate-600">
                {item.location} | {item.category.replaceAll("_", " ")} | {item.jobType.replaceAll("_", " ")}
              </p>
            </article>
          ))}
          {items.length === 0 ? <p className="text-sm text-slate-600">No opportunities yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
