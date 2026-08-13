import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import type { EditableSiteContent } from "../lib/site-content-defaults";

type HeroAction = {
  label: string;
  href: string;
};

type SitePageHeroProps = {
  content: EditableSiteContent;
  eyebrow?: string;
  title: string;
  intro?: string;
  imageUrl: string;
  primaryCta?: HeroAction;
  secondaryCta?: HeroAction;
  beforeTitle?: ReactNode;
  children?: ReactNode;
};

function HeroButton({ action, variant }: { action: HeroAction; variant: "primary" | "secondary" }) {
  const isExternal = /^(https?:|mailto:)/.test(action.href);
  const className =
    variant === "primary"
      ? "inline-flex justify-center rounded-full bg-white px-7 py-4 text-sm font-black text-[#103001] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-green-50"
      : "inline-flex justify-center rounded-full border border-white/70 bg-transparent px-7 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10";

  if (isExternal) {
    return (
      <a className={className} href={action.href} rel="noreferrer" target="_blank">
        {action.label}
      </a>
    );
  }

  return (
    <Link className={className} href={action.href}>
      {action.label}
    </Link>
  );
}

export default function SitePageHero({
  content,
  eyebrow,
  title,
  intro,
  imageUrl,
  primaryCta,
  secondaryCta,
  beforeTitle,
  children,
}: SitePageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#103001] px-5 pt-20 text-white sm:px-8 lg:px-10">
      <Navbar
        content={content}
        logoUrl={content.siteLogoUrl}
        siteName={content.siteName}
      />
      <div
        aria-label={`${title} bij ${content.siteName}`}
        className="absolute inset-0 bg-cover bg-center"
        role="img"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,15,2,0.82)_0%,rgba(10,35,3,0.64)_52%,rgba(10,35,3,0.42)_100%)]" />
      <div aria-hidden="true" className="visual-noise absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-7xl py-20 sm:py-24 lg:py-28">
        <div className="section-fade max-w-4xl">
          {eyebrow ? (
            <p className="mb-6 inline-flex rounded-full border border-white/45 bg-black/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">
              {eyebrow}
            </p>
          ) : null}
          {beforeTitle}
          <h1 className="max-w-4xl text-5xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {intro ? (
            <p className="mt-6 max-w-2xl whitespace-pre-line text-lg font-medium leading-8 text-white/92">
              {intro}
            </p>
          ) : null}
          {children}
          {(primaryCta || secondaryCta) ? (
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              {primaryCta ? <HeroButton action={primaryCta} variant="primary" /> : null}
              {secondaryCta ? <HeroButton action={secondaryCta} variant="secondary" /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
