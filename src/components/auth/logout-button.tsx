"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
      type="button"
    >
      Sign out
    </button>
  );
}
