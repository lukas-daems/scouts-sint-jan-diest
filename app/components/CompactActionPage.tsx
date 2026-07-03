import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "./Footer";
import IconBadge, { type IconName } from "./IconBadge";
import Navbar from "./Navbar";
import SiteEditor from "./SiteEditor";
import {
  getEditableSitePage,
  getSitePageBySlug,
  type EditableSitePage,
} from "../lib/site-pages";
import { getSiteContent } from "@/db/site-content";

type CompactActionSlug = "dropping" | "ontbijtmanden";

const pageKindVisuals: Record<
  EditableSitePage["kind"],
  { icon: IconName; label: string; actionLabel: string }
> = {
  overview: { icon: "calendar", label: "Overzicht", actionLabel: "Info" },
  camp: { icon: "tent", label: "Kamp", actionLabel: "Kampinfo" },
  event: { icon: "route", label: "Evenement", actionLabel: "Inschrijven" },
  order: { icon: "heart", label: "Verkoopactie", actionLabel: "Bestellen" },
  reservation: { icon: "campfire", label: "Eetmoment", actionLabel: "Reserveren" },
  shop: { icon: "flag", label: "Shop", actionLabel: "Aanvragen" },
  committee: { icon: "users", label: "Ouders", actionLabel: "Contact" },
  rental: { icon: "home", label: "Verhuur", actionLabel: "Contact" },
  links: { icon: "map", label: "Links", actionLabel: "Meer info" },
  single: { icon: "spark", label: "Informatie", actionLabel: "Meer info" },
};

const adminPlaceholderPhrases = [
  "document of link toevoegen",
  "link of document volgt",
  "pdf of infolink toevoegen",
  "per tak aanvullen",
  "vervang later",
  "officieel profiel toevoegen",
  "toevoegen",
  "aanvullen",
];

function cleanPublicText(value: string, fallback = "Wordt binnenkort gedeeld.") {
  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();

  if (!trimmed || adminPlaceholderPhrases.some((phrase) => lower.includes(phrase))) {
    return fallback;
  }

  return value;
}

function hasUsefulPublicLink(href?: string) {
  const normalized = (href ?? "").trim().toLowerCase();

  return Boolean(
    normalized && normalized !== "/#contact" && normalized !== "#contact"
  );
}

function FactsPanel({ page }: { page: EditableSitePage }) {
  if (page.facts.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 p-6 sm:p-8 md:grid-cols-2 lg:p-10">
      {page.facts.map((fact) => {
        const note = fact.note ? cleanPublicText(fact.note) : "";

        return (
          <article
            className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200"
            key={`${fact.label}-${fact.value}`}
          >
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2f6b18]">
              {fact.label}
            </p>
            <p className="mt-2 text-xl font-black text-slate-950">
              {fact.value}
            </p>
            {note ? (
              <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export default async function CompactActionPage({ slug }: { slug: CompactActionSlug }) {
  const basePage = getSitePageBySlug(slug);

  if (!basePage) {
    notFound();
  }

  const siteContent = await getSiteContent();
  const page = getEditableSitePage(basePage, siteContent);
  const visual = pageKindVisuals[page.kind] ?? pageKindVisuals.overview;
  const heroFacts = page.facts.slice(0, 2);
  const hasLink = hasUsefulPublicLink(page.externalCta?.href);

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="hero-sky relative isolate overflow-hidden px-5 pb-20 pt-32 text-white sm:px-8 sm:pb-24 lg:px-10 lg:pt-36">
        <Navbar
          content={siteContent}
          logoUrl={siteContent.siteLogoUrl}
          siteName={siteContent.siteName}
        />
        <div aria-hidden="true" className="hero-lines absolute inset-0" />
        <div aria-hidden="true" className="visual-noise absolute inset-0 opacity-50" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="section-fade">
            <p className="forest-glass-pill mb-5 inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-green-50">
              {page.eyebrow}
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-2xl whitespace-pre-line text-lg leading-8 text-green-50">
              {page.intro}
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              {page.primaryCta ? (
                <Link
                  className="inline-flex justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-green-950/20 transition hover:-translate-y-0.5 hover:bg-green-50"
                  href={page.primaryCta.href}
                >
                  {page.primaryCta.label}
                </Link>
              ) : null}
              {page.secondaryCta ? (
                <Link
                  className="forest-glass-pill inline-flex justify-center rounded-full px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
                  href={page.secondaryCta.href}
                >
                  {page.secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="hero-visual-card relative p-2 sm:p-3">
            <div
              aria-label={`${page.title} bij ${siteContent.siteName}`}
              className="camp-scene has-photo min-h-[340px]"
              role="img"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(16, 48, 1, 0.03), rgba(7, 26, 2, 0.66)), url("${page.imageUrl}")`,
              }}
            />
            <div className="forest-glass-photo absolute inset-x-4 bottom-4 rounded-[1.5rem] p-4 text-white sm:inset-x-5 sm:bottom-5 sm:p-5">
              <div className="grid gap-4 md:grid-cols-[1fr_minmax(220px,0.58fr)] md:items-center">
                <div className="flex items-center gap-3">
                  <IconBadge icon={visual.icon} tone="light" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-green-100">
                      {visual.label}
                    </p>
                    <h2 className="mt-1 text-xl font-black">{page.navLabel}</h2>
                  </div>
                </div>
                {heroFacts.length > 0 ? (
                  <div className="grid gap-2">
                    {heroFacts.map((fact) => (
                      <div
                        className="rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/15"
                        key={`${fact.label}-${fact.value}`}
                      >
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-green-100">
                          {fact.label}
                        </p>
                        <p className="mt-0.5 text-sm font-bold leading-5 text-white">
                          {fact.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8">
          <section
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-green-950/8"
            id="aanvragen"
          >
            <div className="grid gap-0 lg:grid-cols-[0.86fr_1.14fr]">
              <div className="bg-[#103001] p-6 text-white sm:p-8 lg:p-10">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-green-100">
                  {visual.actionLabel}
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight">
                  {page.externalCta?.title || page.title}
                </h2>
                <p className="mt-4 whitespace-pre-line leading-8 text-green-50">
                  {page.externalCta?.text || page.intro}
                </p>
                {page.externalCta ? (
                  hasLink ? (
                    <Link
                      className="mt-7 inline-flex rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-green-950/20 transition hover:-translate-y-0.5 hover:bg-green-50"
                      href={page.externalCta.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {page.externalCta.button}
                    </Link>
                  ) : (
                    <span className="mt-7 inline-flex rounded-full bg-white/12 px-7 py-4 text-sm font-bold text-white ring-1 ring-white/25">
                      Link volgt binnenkort
                    </span>
                  )
                ) : null}
              </div>

              <FactsPanel page={page} />
            </div>
          </section>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-[2rem] border border-slate-200 bg-[#fbfdf9] p-7 shadow-xl shadow-green-950/8 sm:p-9 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
              {siteContent.pageSharedCtaEyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              {siteContent.pageSharedCtaTitle}
            </h2>
          </div>
          <Link
            className="inline-flex justify-center rounded-full bg-[#103001] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/15 transition hover:-translate-y-0.5 hover:bg-[#1e4b0d]"
            href="/#contact"
          >
            {siteContent.pageSharedCtaButton}
          </Link>
        </div>
      </section>

      <Footer content={siteContent} />
      <SiteEditor initialContent={siteContent} />
    </main>
  );
}
