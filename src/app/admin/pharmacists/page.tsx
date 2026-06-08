import { NotificationType, UserRole, VerificationStatus } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
import { requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";

async function updateVerification(formData: FormData) {
  "use server";

  await requireRole(UserRole.ADMIN);

  const profileId = String(formData.get("profileId"));
  const status = String(formData.get("status")) as VerificationStatus;

  const profile = await db.pharmacistProfile.update({
    where: { id: profileId },
    data: {
      verificationStatus: status,
      verificationReviewedAt: new Date(),
      verificationReason: status === VerificationStatus.REJECTED ? "Rejected by admin review" : null,
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  await createNotification({
    recipientUserId: profile.user.id,
    title: "Profile verification updated",
    message:
      status === VerificationStatus.VERIFIED
        ? "Your profile has been verified."
        : "Your profile was rejected. Review your details and submit again.",
    type: status === VerificationStatus.VERIFIED ? NotificationType.SUCCESS : NotificationType.WARNING,
    linkUrl: "/pharmacist/dashboard",
  });

  revalidatePath("/admin/pharmacists");
}

export default async function AdminPharmacistsPage() {
  await requireRole(UserRole.ADMIN);

  const profiles = await db.pharmacistProfile.findMany({
    include: { user: true, documents: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Pharmacists and verification</h1>
      <div className="space-y-3">
        {profiles.map((profile) => (
          <article key={profile.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{profile.user.fullName}</p>
                <p className="text-xs text-slate-600">{profile.user.email}</p>
                <p className="text-xs text-slate-600">
                  {profile.category.replaceAll("_", " ")} | {profile.lagosArea}
                </p>
                <p className="text-xs text-slate-600">Verification: {profile.verificationStatus}</p>
                {profile.cvUrl ? (
                  <p className="text-xs text-slate-600">
                    CV: <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="underline">Open file</a>
                  </p>
                ) : null}
                {profile.documents.length > 0 ? (
                  <p className="text-xs text-slate-600">
                    License docs: {profile.documents.length}
                  </p>
                ) : null}
              </div>
              <form action={updateVerification} className="flex gap-2">
                <input type="hidden" name="profileId" value={profile.id} />
                <button name="status" value={VerificationStatus.VERIFIED} className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">
                  Mark verified
                </button>
                <button name="status" value={VerificationStatus.REJECTED} className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                  Reject
                </button>
              </form>
            </div>
          </article>
        ))}
        {profiles.length === 0 ? <p className="text-sm text-slate-600">No pharmacist profiles yet.</p> : null}
      </div>
    </main>
  );
}
