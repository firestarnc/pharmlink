import { OnboardingForm } from "@/components/pharmacist/onboarding-form";
import { requireRole } from "@/lib/session";
import { UserRole } from "@/generated/prisma/enums";

export default async function OnboardingPage() {
  await requireRole(UserRole.PHARMACIST);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Complete your profile</h1>
      <p className="mb-6 mt-1 text-sm text-slate-600">
        Submit your professional details for mandatory verification before matching.
      </p>
      <OnboardingForm />
    </main>
  );
}
