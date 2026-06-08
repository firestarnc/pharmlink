import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Create pharmacist account</h1>
      <p className="mb-6 text-sm text-slate-600">Lagos-first pharmacist talent matching platform.</p>
      <SignupForm />
      <p className="mt-4 text-sm text-slate-600">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-slate-900">
          Sign in
        </Link>
      </p>
    </main>
  );
}
