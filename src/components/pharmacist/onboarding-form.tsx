"use client";

import { JobType, ProfessionalCategory } from "@/generated/prisma/enums";
import { useToast } from "@/components/ui/toast-provider";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { z } from "zod";

const categories = Object.values(ProfessionalCategory);
const jobTypes = Object.values(JobType);

const onboardingSchema = z.object({
  category: z.nativeEnum(ProfessionalCategory),
  lagosArea: z.string().trim().min(2, "Search area must be at least 2 characters"),
  yearsOfExperience: z.coerce.number().min(0).max(60),
  qualification: z.string().trim().min(2, "Qualification must be at least 2 characters"),
  licenseNumber: z.string().trim().max(80).optional(),
  currentEmployment: z.string().trim().max(120).optional(),
  preferredJobType: z.nativeEnum(JobType),
  availability: z.string().trim().max(120).optional(),
  preferredSalaryMin: z.coerce.number().optional(),
  preferredSalaryMax: z.coerce.number().optional(),
  preferredWorkArea: z.string().trim().max(120).optional(),
  summary: z.string().trim().max(1500).optional(),
  cvUrl: z.url("CV file URL must be valid").optional(),
}).refine((data) => {
  if (data.preferredSalaryMin == null || data.preferredSalaryMax == null) {
    return true;
  }

  return data.preferredSalaryMin <= data.preferredSalaryMax;
}, {
  message: "Minimum salary cannot exceed maximum salary",
  path: ["preferredSalaryMin"],
});

export function OnboardingForm() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [cvUrl, setCvUrl] = useState("");
  const [licenseDocumentUrls, setLicenseDocumentUrls] = useState<string[]>([]);

  async function uploadDocument(file: File, uploadType: "CV" | "LICENSE") {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("uploadType", uploadType);

    const response = await fetch("/api/pharmacist/upload", {
      method: "POST",
      body: payload,
    });

    const data = (await response.json().catch(() => null)) as { data?: { fileUrl?: string }; error?: string } | null;

    if (!response.ok) {
      throw new Error(data?.error ?? "Upload failed");
    }

    return data?.data?.fileUrl ?? "";
  }

  async function onUploadCv(event: FormEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      return;
    }

    setUploadingCv(true);

    try {
      const uploadedUrl = await uploadDocument(file, "CV");
      setCvUrl(uploadedUrl);
      pushToast({
        title: "CV uploaded",
        description: "Your CV file is now attached to your profile.",
        variant: "success",
      });
    } catch (error) {
      pushToast({
        title: "CV upload failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setUploadingCv(false);
      event.currentTarget.value = "";
    }
  }

  async function onUploadLicense(event: FormEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      return;
    }

    setUploadingLicense(true);

    try {
      const uploadedUrl = await uploadDocument(file, "LICENSE");
      setLicenseDocumentUrls((current) => [...current, uploadedUrl]);
      pushToast({
        title: "License uploaded",
        description: "Your license document has been saved for verification.",
        variant: "success",
      });
    } catch (error) {
      pushToast({
        title: "License upload failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setUploadingLicense(false);
      event.currentTarget.value = "";
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const draftPayload = {
      category: String(formData.get("category")),
      lagosArea: String(formData.get("lagosArea")),
      yearsOfExperience: Number(formData.get("yearsOfExperience") ?? 0),
      qualification: String(formData.get("qualification")),
      licenseNumber: String(formData.get("licenseNumber") ?? "") || undefined,
      currentEmployment: String(formData.get("currentEmployment") ?? "") || undefined,
      preferredJobType: String(formData.get("preferredJobType")),
      availability: String(formData.get("availability") ?? "") || undefined,
      preferredSalaryMin: Number(formData.get("preferredSalaryMin") ?? 0) || undefined,
      preferredSalaryMax: Number(formData.get("preferredSalaryMax") ?? 0) || undefined,
      preferredWorkArea: String(formData.get("preferredWorkArea") ?? "") || undefined,
      summary: String(formData.get("summary") ?? "") || undefined,
      cvUrl: cvUrl || undefined,
      licenseDocumentUrls,
    };

    const parsed = onboardingSchema.safeParse(draftPayload);
    if (!parsed.success) {
      setLoading(false);
      pushToast({
        title: "Validation error",
        description: parsed.error.issues[0]?.message ?? "Please review your input.",
        variant: "error",
      });
      return;
    }

    const response = await fetch("/api/pharmacist/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      pushToast({
        title: "Profile submission failed",
        description: data?.error ?? "Please try again.",
        variant: "error",
      });
      return;
    }

    pushToast({
      title: "Profile submitted",
      description: "Your profile is now in review and pending verification.",
      variant: "success",
    });

    router.push("/pharmacist/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">Professional Category</label>
        <select name="category" required className="w-full rounded-md border border-slate-300 px-3 py-2">
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Search Area <span className="text-xs text-slate-500">(Target Lagos Area)</span></label>
        <input name="lagosArea" required className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Years of Experience</label>
        <input name="yearsOfExperience" type="number" min={0} defaultValue={0} className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Qualification</label>
        <input name="qualification" required className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">License Number (if applicable)</label>
        <input name="licenseNumber" className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Current Employment</label>
        <input name="currentEmployment" className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Preferred Job Type</label>
        <select name="preferredJobType" required className="w-full rounded-md border border-slate-300 px-3 py-2">
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Availability</label>
        <input name="availability" placeholder="Weekdays, evenings, etc." className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Preferred Salary Min (NGN)</label>
        <input name="preferredSalaryMin" type="number" className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Preferred Salary Max (NGN)</label>
        <input name="preferredSalaryMax" type="number" className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Preferred Work Area</label>
        <input name="preferredWorkArea" className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">CV Upload (PDF, DOC, DOCX, JPG, PNG)</label>
        <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onInput={onUploadCv} disabled={uploadingCv} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <p className="mt-1 text-xs text-slate-500">{uploadingCv ? "Uploading CV..." : cvUrl ? "CV uploaded successfully" : "No CV uploaded yet"}</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">License Upload (optional)</label>
        <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onInput={onUploadLicense} disabled={uploadingLicense} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        <p className="mt-1 text-xs text-slate-500">{uploadingLicense ? "Uploading license..." : `${licenseDocumentUrls.length} license document(s) uploaded`}</p>
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">Professional Summary</label>
        <textarea name="summary" rows={4} className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <button
        disabled={loading}
        className="md:col-span-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit for verification"}
      </button>
    </form>
  );
}
