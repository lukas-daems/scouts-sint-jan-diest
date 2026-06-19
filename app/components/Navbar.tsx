"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { branchProfiles } from "../lib/branches";
import { sitePageGroups } from "../lib/site-pages";

const homeSectionLinks = [
  { label: "Over ons", href: "/#over-ons" },
  { label: "Activiteiten", href: "/#activiteiten" },
  { label: "Takken", href: "/#takken" },
  { label: "Kamp", href: "/#kamp" },
  { label: "Foto's", href: "/#fotos" },
  { label: "Contact", href: "/#contact" },
];

const navigationGroups = [
  {
    label: "Home",
    href: "/#home",
    slugs: [""],
    items: homeSectionLinks,
  },
  {
    label: "Takken",
    href: "/takken",
    slugs: ["takken"],
    items: [
      { label: "Alle takken", href: "/takken" },
      ...branchProfiles.map((branch) => ({
        label: branch.name,
        href: `/takken/${branch.slug}`,
        meta: branch.age,
      })),
    ],
  },
  ...sitePageGroups,
];

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

type NavbarProps = {
  logoUrl?: string;
  siteName?: string;
};

export default function Navbar({
  logoUrl = "",
  siteName = "Scouts Sint-Jan Berchmans",
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const pathname = usePathname();
  const activeSlug = pathname.replace(/^\//, "").split("/")[0];
  const logoSrc = !logoFailed ? logoUrl || "/assets/logo.png" : "";

  function isActive(slugs: string[]) {
    if (slugs.includes("")) {
      return pathname === "/";
    }

    return slugs.includes(activeSlug);
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Hoofdnavigatie"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
      >
        <Link className="flex min-w-0 items-center gap-3.5 text-white" href="/#home">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-xl shadow-green-950/20 ring-1 ring-white/40">
            {logoSrc ? (
              <img
                alt={`Logo van ${siteName}`}
                className="h-full w-full rounded-full object-cover"
                onError={() => setLogoFailed(true)}
                src={logoSrc}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center rounded-full bg-[#edf6e8] text-sm font-black text-[#103001]">
                SJ
              </span>
            )}
          </span>
          <span className="truncate text-sm font-bold tracking-tight sm:text-base">
            {siteName}
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navigationGroups.map((group) => (
            <div className="group relative py-6" key={group.label}>
              <Link
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition hover:bg-white/10 hover:text-white xl:px-4 ${
                  isActive(group.slugs)
                    ? "bg-white/12 text-white ring-1 ring-white/20"
                    : "text-white/82"
                }`}
                href={group.href}
              >
                {group.label}
                <Chevron />
              </Link>

              <div className="pointer-events-none absolute left-1/2 top-full w-72 -translate-x-1/2 translate-y-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="rounded-3xl border border-white/30 bg-white p-3 text-slate-950 shadow-2xl shadow-green-950/20">
                  <Link
                    className="mb-2 block rounded-2xl bg-[#edf6e8] px-4 py-3 text-sm font-black text-[#103001] transition hover:bg-[#d7e8cf]"
                    href={group.href}
                  >
                    {group.label === "Home" ? "Naar de homepage" : group.label}
                  </Link>
                  {group.items.map((item) => (
                    <Link
                      className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-[#f2f8ee] hover:text-[#103001]"
                      href={item.href}
                      key={item.href}
                    >
                      <span>{item.label}</span>
                      {"meta" in item && item.meta ? (
                        <span className="text-xs font-semibold text-slate-400">
                          {item.meta}
                        </span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link
          className="hidden rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-green-950/20 transition hover:-translate-y-0.5 hover:bg-green-50 lg:inline-flex"
          href="/#contact"
        >
          Word lid
        </Link>

        <button
          aria-expanded={isOpen}
          aria-label="Menu openen"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path d="M6 6l12 12M18 6 6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      <div
        className={`mx-5 overflow-hidden rounded-3xl bg-white shadow-2xl shadow-green-950/20 transition-all duration-300 sm:mx-8 lg:hidden ${
          isOpen ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex max-h-[calc(100vh-6rem)] flex-col gap-1 overflow-y-auto p-3">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <Link
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-[#f2f8ee] hover:text-[#103001]"
                href={group.href}
                onClick={() => setIsOpen(false)}
              >
                {group.label}
                <Chevron />
              </Link>
              <div className="mb-2 ml-3 border-l border-slate-200 pl-3">
                {group.items.map((item) => (
                  <Link
                    className="flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-[#f2f8ee] hover:text-[#103001]"
                    href={item.href}
                    key={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{item.label}</span>
                    {"meta" in item && item.meta ? (
                      <span className="text-xs font-semibold text-slate-400">
                        {item.meta}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link
            className="mt-2 rounded-full bg-[#103001] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
            href="/#contact"
            onClick={() => setIsOpen(false)}
          >
            Word lid
          </Link>
        </div>
      </div>
    </header>
  );
}
