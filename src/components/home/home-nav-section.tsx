"use client";

import Link from "next/link";
import { useState } from "react";

export function HomeNavSection() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappLink = "https://wa.me/2349033143705?text=Hi%20PharmaLink%2C%20I%20want%20to%20get%20started.";

  return (
    <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <div className="rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold tracking-wide text-slate-900 backdrop-blur">
        PharmaLink
      </div>

      <button
        type="button"
        className="rounded-full border border-slate-300 bg-white p-2 text-slate-800 md:hidden"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      >
        <span className="sr-only">Toggle menu</span>
        <span className="relative block h-5 w-5" aria-hidden="true">
          <span
            className={`absolute left-0 top-1 block h-0.5 w-5 bg-current transition ${
              isOpen ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-2.5 block h-0.5 w-5 bg-current transition ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 top-4 block h-0.5 w-5 bg-current transition ${
              isOpen ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <nav className="hidden items-center gap-2 md:flex">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.85)] transition hover:bg-emerald-600"
        >
          Contact
        </a>
        <Link
          href="/login"
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Join as Pharmacist
        </Link>
      </nav>

      {isOpen ? (
        <nav className="absolute left-6 right-6 top-full z-20 mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Contact
            </a>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Join as Pharmacist
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}