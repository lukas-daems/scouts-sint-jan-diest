"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { branchProfiles } from "../lib/branches";
import { sitePageGroups } from "../lib/site-pages";
import type { EditableSiteContent } from "../lib/site-content-defaults";

const homeSectionLinks = [
  { label: "Takken", href: "/#takken" },
  { label: "Activiteiten", href: "/#activiteiten" },
  { label: "Kamp", href: "/zomerkamp" },
  { label: "Contact", href: "/#contact" },
];

function getNavigationGroups(content?: EditableSiteContent) {
  const groupLabels: Record<string, string> = {
    Activiteiten: content?.navActivitiesLabel || "Activiteiten",
    "Steun ons": content?.navSupportLabel || "Steun ons",
    Praktisch: content?.navPracticalLabel || "Praktisch",
    Meer: content?.navMoreLabel || "Meer",
  };

  return [
    {
      id: "home",
      label: content?.navHomeLabel || "Home",
      href: "/#home",
      slugs: [""],
      items: homeSectionLinks,
    },
    {
      id: "takken",
      label: content?.navBranchesLabel || "Takken",
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
    ...sitePageGroups.map((group) => {
      const items = group.items.filter((item) => item.href);
      const firstHref = items[0]?.href || "/#home";
      const slugs = group.pages.map((page) => page.slug);

      return {
        ...group,
        id: group.label.toLowerCase().replace(/\s+/g, "-"),
        label: groupLabels[group.label] || group.label,
        href: firstHref,
        slugs,
        items,
      };
    }),
  ];
}

const fallbackNavigationGroups = [
  {
    id: "home",
    label: "Home",
    href: "/#home",
    slugs: [""],
    items: homeSectionLinks,
  },
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
  content?: EditableSiteContent;
};

export default function Navbar({
  logoUrl = "",
  siteName = "Scouts Sint-Jan Berchmans",
  content,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState(
    fallbackNavigationGroups[0].id
  );
  const [logoFailed, setLogoFailed] = useState(false);
  const pathname = usePathname();
  const activeSlug = pathname.replace(/^\//, "").split("/")[0];
  const contrastLogo = content?.siteLogoDarkBackgroundUrl || "";
  const preferredLogo = contrastLogo || logoUrl;
  const logoSrc = !logoFailed ? preferredLogo || "/assets/logo.png" : "";
  const hasUploadedLogo = Boolean(preferredLogo && !logoFailed);
  const shouldCutOutLogo = hasUploadedLogo && !contrastLogo;
  const navigationGroups = getNavigationGroups(content);

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
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10"
      >
        <Link
          className="flex min-w-0 flex-1 items-center gap-3 text-white lg:max-w-[300px] lg:flex-none xl:max-w-[380px]"
          href="/#home"
        >
          <span className="flex h-11 max-w-[76px] shrink-0 items-center overflow-visible sm:h-14 sm:max-w-[104px] lg:h-16 lg:max-w-[116px]">
            {logoSrc ? (
              <img
                alt={`Logo van ${siteName}`}
                className={`h-full w-auto max-w-full object-contain drop-shadow-[0_12px_24px_rgba(7,26,2,0.28)] ${
                  shouldCutOutLogo ? "site-logo-cutout" : "rounded-full"
                }`}
                onError={() => setLogoFailed(true)}
                src={logoSrc}
              />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf6e8] text-sm font-black text-[#103001] shadow-xl shadow-green-950/20 ring-1 ring-white/40">
                SJ
              </span>
            )}
          </span>
          <span className="min-w-0">
            <span className="block max-w-[155px] truncate text-xs font-black leading-tight tracking-tight text-white sm:max-w-[240px] sm:text-base lg:max-w-[260px]">
              {siteName}
            </span>
            <span className="hidden truncate text-xs font-semibold text-green-100/90 xl:block">
              {content?.heroOrgLabel || "Scouts en Gidsen Vlaanderen"}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navigationGroups.map((group) => (
            <div className="group relative py-6" key={group.id}>
              <Link
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition hover:bg-white/10 hover:text-white xl:px-4 ${
                  isActive(group.slugs)
                    ? "bg-white/15 text-white ring-1 ring-white/25"
                    : "text-white/82"
                }`}
                href={group.href}
              >
                {group.label}
                <Chevron />
              </Link>

              <div className="pointer-events-none absolute left-1/2 top-full w-72 -translate-x-1/2 translate-y-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="forest-glass-menu rounded-3xl p-3 text-slate-950">
                  <Link
                    className="mb-2 block rounded-2xl bg-[#edf6e8] px-4 py-3 text-sm font-black text-[#103001] transition hover:bg-[#d7e8cf]"
                    href={group.href}
                  >
                    {group.id === "home" ? "Naar de homepage" : group.label}
                  </Link>
                  {group.items.map((item) => (
                    <Link
                      className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-[#f2f8ee] hover:text-[#103001]"
                      href={item.href}
                      key={item.href}
                    >
                      <span>{item.label}</span>
                      {"meta" in item && typeof item.meta === "string" && item.meta ? (
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
          {content?.navCtaLabel || "Word lid"}
        </Link>

        <button
          aria-expanded={isOpen}
          aria-label="Menu openen"
          className="forest-glass-pill inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/20 lg:hidden"
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
        className={`forest-glass-menu mx-5 overflow-hidden rounded-3xl transition-all duration-300 sm:mx-8 lg:hidden ${
          isOpen ? "max-h-[calc(100vh-6.5rem)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex max-h-[calc(100vh-6.5rem)] flex-col gap-1 overflow-y-auto p-3">
          {navigationGroups.map((group) => (
            <div className="rounded-2xl bg-[#fbfdf9] ring-1 ring-slate-200" key={group.id}>
              <button
                aria-expanded={openMobileGroup === group.id}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black text-slate-800 transition hover:bg-[#f2f8ee] hover:text-[#103001]"
                onClick={() =>
                  setOpenMobileGroup((current) =>
                    current === group.id ? "" : group.id
                  )
                }
                type="button"
              >
                {group.label}
                <span
                  className={`transition ${
                    openMobileGroup === group.id ? "rotate-180" : ""
                  }`}
                >
                  <Chevron />
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openMobileGroup === group.id
                    ? "max-h-[520px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="mx-3 mb-3 grid gap-1 border-l border-slate-200 pl-3">
                  <Link
                    className="rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-[#103001] ring-1 ring-slate-100 transition hover:bg-[#edf6e8]"
                    href={group.href}
                    onClick={() => setIsOpen(false)}
                  >
                    {group.id === "home" ? "Naar de homepage" : `Naar ${group.label}`}
                  </Link>
                  {group.items.map((item) => (
                    <Link
                      className="flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-[#f2f8ee] hover:text-[#103001]"
                      href={item.href}
                      key={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{item.label}</span>
                      {"meta" in item && typeof item.meta === "string" && item.meta ? (
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
          <Link
            className="mt-2 rounded-full bg-[#103001] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
            href="/#contact"
            onClick={() => setIsOpen(false)}
          >
            {content?.navCtaLabel || "Word lid"}
          </Link>
        </div>
      </div>
    </header>
  );
}
