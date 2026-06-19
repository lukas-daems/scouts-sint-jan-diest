/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { branchProfiles } from "../lib/branches";
import { sitePageGroups } from "../lib/site-pages";
import type { EditableSiteContent } from "../lib/site-content-defaults";

const navLinks = [
  ["Home", "/#home"],
  ["Over ons", "/#over-ons"],
  ["Takken", "/takken"],
  ["Activiteiten", "/activiteiten"],
  ["Zomerkamp", "/zomerkamp"],
  ["Foto's", "/#fotos"],
  ["Contact", "/#contact"],
];

const pageLinks = Array.from(
  new Map(
    sitePageGroups.flatMap((group) => group.items).map((link) => [link.href, link])
  ).values()
);

type FooterProps = {
  content: EditableSiteContent;
};

export default function Footer({ content }: FooterProps) {
  const logoSrc = content.siteLogoUrl || "/assets/logo.png";

  return (
    <footer className="bg-[#071a02] px-5 py-16 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-t border-white/10 pt-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.75fr_0.8fr_0.85fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full shadow-xl shadow-green-950/20 ring-1 ring-white/35">
                {logoSrc ? (
                  <img
                    alt="Logo van Scouts Sint-Jan Diest"
                    className="h-full w-full rounded-full object-cover"
                    src={logoSrc}
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-[#edf6e8] text-sm font-black text-[#103001]">
                    SJ
                  </span>
                )}
              </span>
              <h2 className="text-lg font-bold">{content.siteName}</h2>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-green-100">
              {content.footerDescription}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
              Navigatie
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-green-100">
              {navLinks.map(([label, href]) => (
                <li key={label}>
                  <Link className="transition hover:text-white" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
              Takken
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-green-100">
              {branchProfiles.map((branch) => (
                <li key={branch.slug}>
                  <Link
                    className="transition hover:text-white"
                    href={`/takken/${branch.slug}`}
                  >
                    {branch.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
              Pagina&apos;s
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-green-100">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link className="transition hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-green-100">
              <li>{content.contactLocation}</li>
              <li>{content.contactEmail}</li>
              <li>
                <Link
                  className="transition hover:text-white"
                  href={content.instagramUrl || "/#contact"}
                >
                  {content.instagram}
                </Link>
              </li>
              <li>
                <Link
                  className="transition hover:text-white"
                  href={content.facebookUrl || "/#contact"}
                >
                  {content.facebook}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-green-100 md:flex-row md:items-center md:justify-between">
          <p>{content.footerCopyright}</p>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
            <p>{content.footerNotice}</p>
            <Link
              className="font-bold text-white transition hover:text-green-100"
              href="/admin"
            >
              Beheer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
