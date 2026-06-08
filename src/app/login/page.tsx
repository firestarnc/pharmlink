import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Sign in to PharmaLink</h1>
      <p className="mb-6 text-sm text-slate-600">For pharmacists and admin access.</p>
      <LoginForm />
      <p className="mt-4 text-sm text-slate-600">
        New pharmacist?{" "}
        <Link href="/signup" className="font-semibold text-slate-900">
          Create an account
        </Link>
      </p>
    </main>
  );
}
