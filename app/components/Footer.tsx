/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { branchProfiles } from "../lib/branches";
import { sitePageGroups } from "../lib/site-pages";
import type { EditableSiteContent } from "../lib/site-content-defaults";

const navLinks = [
  ["Home", "/#home"],
  ["Takken", "/takken"],
  ["Activiteiten", "/activiteiten"],
  ["Zomerkamp", "/zomerkamp"],
  ["Foto's", "/fotos"],
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

function getContactPhones(content: EditableSiteContent) {
  const phoneLines = (content.contactPhones || content.contactPhone)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsedPhones = phoneLines.map((line) => {
    const [name = "", phone = ""] = line.split("|");

    return {
      name: name.trim() || "Groepsleiding",
      phone: phone.trim() || name.trim(),
    };
  });

  return parsedPhones.length
    ? parsedPhones
    : [{ name: "Groepsleiding", phone: content.contactPhone }];
}

export default function Footer({ content }: FooterProps) {
  const contrastLogoSrc = content.siteLogoDarkBackgroundUrl || "";
  const logoSrc = contrastLogoSrc || content.siteLogoUrl || "/assets/logo.png";
  const hasLogoForGreenBackground = Boolean(contrastLogoSrc);
  const contactPhones = getContactPhones(content);

  return (
    <footer className="bg-[#071a02] px-5 py-14 text-white sm:px-8 sm:py-18 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[1.25fr_1.75fr] lg:gap-14">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/10">
            <div className="flex flex-col items-start gap-6">
              <span
                className={
                  hasLogoForGreenBackground
                    ? "inline-flex max-w-full"
                    : "inline-flex max-w-full rounded-[1.6rem] bg-[#f7f0dc] p-3.5 shadow-2xl shadow-black/20 ring-1 ring-white/20"
                }
              >
                <img
                  alt={`Logo van ${content.siteName}`}
                  className={`max-w-full object-contain ${
                    hasLogoForGreenBackground
                      ? "h-28 drop-shadow-[0_18px_30px_rgba(0,0,0,0.32)] sm:h-32"
                      : "site-logo-cutout h-28 drop-shadow-[0_12px_20px_rgba(16,48,1,0.2)] sm:h-32"
                  }`}
                  src={logoSrc}
                />
              </span>
              <div>
                <h2 className="text-2xl font-black">{content.siteName}</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-green-100">
                  {content.footerDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            <FooterColumn title="Navigatie" links={navLinks} />
            <FooterColumn
              title="Takken"
              links={branchProfiles.map((branch) => [
                branch.name,
                `/takken/${branch.slug}`,
              ])}
            />
            <FooterColumn
              title="Pagina's"
              links={pageLinks.map((link) => [link.label, link.href])}
            />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
                Contact
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-green-100">
                <li>{content.contactLocation}</li>
                <li>
                  <a
                    className="break-all transition hover:text-white"
                    href={`mailto:${content.contactEmail}`}
                  >
                    {content.contactEmail}
                  </a>
                </li>
                {contactPhones.slice(0, 3).map((item) => (
                  <li key={`${item.name}-${item.phone}`}>
                    <a
                      className="transition hover:text-white"
                      href={`tel:${item.phone.replace(/\s/g, "")}`}
                    >
                      {item.name}: {item.phone}
                    </a>
                  </li>
                ))}
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

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[][];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm text-green-100">
        {links.map(([label, href]) => (
          <li key={`${title}-${label}`}>
            <Link className="transition hover:text-white" href={href}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
