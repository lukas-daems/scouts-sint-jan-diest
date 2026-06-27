import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../components/Footer";
import IconBadge, { type IconName } from "../components/IconBadge";
import Navbar from "../components/Navbar";
import SiteEditor from "../components/SiteEditor";
import {
  getEditableSitePage,
  getSitePageBySlug,
  sitePages,
  type EditableSitePage,
  type SitePageLinkItem,
} from "../lib/site-pages";
import type { EditableSiteContent } from "../lib/site-content-defaults";
import { getSiteContent } from "@/db/site-content";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return sitePages.map((page) => ({ slug: page.slug }));
}

type InfoPageProps = {
  params: Promise<{ slug: string }>;
};

const pageKindVisuals: Record<
  EditableSitePage["kind"],
  { icon: IconName; label: string }
> = {
  overview: { icon: "calendar", label: "Overzicht" },
  camp: { icon: "tent", label: "Kamp" },
  event: { icon: "route", label: "Evenement" },
  order: { icon: "heart", label: "Verkoopactie" },
  reservation: { icon: "campfire", label: "Eetmoment" },
  shop: { icon: "flag", label: "Shop" },
  committee: { icon: "users", label: "Ouders" },
  rental: { icon: "home", label: "Verhuur" },
  links: { icon: "map", label: "Links" },
  single: { icon: "spark", label: "Informatie" },
};

function getPageKindVisual(page: EditableSitePage) {
  return pageKindVisuals[page.kind] ?? pageKindVisuals.overview;
}

function CardsGrid({ page }: { page: EditableSitePage }) {
  if (page.cards.length === 0) {
    return null;
  }

  const headings: Record<string, { eyebrow: string; title: string }> = {
    overview: { eyebrow: "Overzicht", title: "Wat vind je hier?" },
    camp: { eyebrow: "Kampinformatie", title: "Alles rond het zomerkamp" },
    event: { eyebrow: "Evenement", title: "Praktische afspraken" },
    order: { eyebrow: "Verkoopactie", title: "Bestellen en steunen" },
    reservation: { eyebrow: "Reservatie", title: "Menu, planning en reservatie" },
    shop: { eyebrow: "Shop", title: "Wat kan je aanvragen?" },
    links: { eyebrow: "Links", title: "Nuttige verwijzingen" },
    single: { eyebrow: "Informatie", title: "Meer uitleg" },
  };
  const heading = headings[page.kind] ?? headings.overview;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
          {heading.eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">
          {heading.title}
        </h2>
      </div>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {page.cards.map((card, index) => (
          <article
            className={`rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-green-950/8 ${
              index === 0 && page.cards.length > 3 ? "md:col-span-2" : ""
            }`}
            key={`${card.title}-${index}`}
          >
            <div className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf6e8] text-sm font-black text-[#103001] ring-1 ring-[#d7e8cf]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-black text-slate-950">
                  {card.title}
                </h3>
                <p className="mt-2 whitespace-pre-line leading-7 text-slate-600">
                  {card.text}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FactsList({ page }: { page: EditableSitePage }) {
  if (page.facts.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3">
      {page.facts.map((fact) => (
        <div
          className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200"
          key={`${fact.label}-${fact.value}`}
        >
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2f6b18]">
            {fact.label}
          </p>
          <p className="mt-2 text-xl font-black text-slate-950">{fact.value}</p>
          {fact.note ? (
            <p className="mt-2 text-sm leading-6 text-slate-600">{fact.note}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function PageOverview({
  page,
  siteName,
}: {
  page: EditableSitePage;
  siteName: string;
}) {
  const hasSupport = Boolean(page.highlight) || page.facts.length > 0;
  const visual = getPageKindVisual(page);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8 lg:p-10">
      <div
        className={`grid gap-8 ${
          hasSupport ? "lg:grid-cols-[0.92fr_1.08fr] lg:items-start" : ""
        }`}
      >
        <div>
          <IconBadge icon={visual.icon} tone="green" />
          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
            {siteName}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {page.sidebarTitle}
          </h2>
          <p className="mt-4 max-w-2xl whitespace-pre-line leading-8 text-slate-600">
            {page.sidebarText}
          </p>
        </div>

        {hasSupport ? (
          <div className="grid gap-4">
            {page.highlight ? (
              <div className="rounded-3xl bg-[#edf6e8] p-5 ring-1 ring-[#d7e8cf] sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                  {page.highlight.label}
                </p>
                <h3 className="mt-2 text-xl font-black text-slate-950">
                  {page.highlight.title}
                </h3>
                <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
                  {page.highlight.text}
                </p>
              </div>
            ) : null}
            <FactsList page={page} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function DocumentsBlock({ page }: { page: EditableSitePage }) {
  if (page.kind !== "camp" || page.documents.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
            Documenten
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">
            Kampboekje, medische fiche en bagagelijst
          </h2>
        </div>
      </div>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {page.documents.map((document) => (
          <Link
            className="lift-card rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5 transition hover:bg-[#edf6e8]"
            href={document.href}
            key={document.label}
          >
            <h3 className="text-lg font-black text-slate-950">
              {document.label}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {document.description}
            </p>
            <p className="mt-4 text-sm font-black text-[#2f6b18]">
              Open document →
            </p>
          </Link>
        ))}
      </div>
      {page.updates ? (
        <div className="mt-7 rounded-3xl bg-[#edf6e8] p-5 text-sm font-semibold leading-7 text-[#103001] ring-1 ring-[#d7e8cf]">
          <p className="font-black uppercase tracking-[0.16em]">
            Praktische updates
          </p>
          <p className="mt-2 whitespace-pre-line">{page.updates}</p>
        </div>
      ) : null}
    </section>
  );
}

function CampStoryBlocks({ content }: { content: EditableSiteContent }) {
  const blocks = [
    { title: "Wat is kamp?", text: content.campWhat },
    { title: "Voor ouders", text: content.campForParents },
    { title: "Voor nieuwe leden", text: content.campForNewMembers },
  ].filter((block) => block.text.trim());

  if (blocks.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-green-950/8">
      <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="bg-[#103001] p-6 text-white sm:p-8 lg:p-9">
          <IconBadge icon="tent" tone="light" />
          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-green-100">
            Kampverhaal
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">
            Wat ouders en leden mogen verwachten
          </h2>
          <p className="mt-4 leading-7 text-green-50">
            {content.campHomepageNote}
          </p>
        </div>
        <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-3 lg:p-7">
          {blocks.map((block) => (
            <article
              className="rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5"
              key={block.title}
            >
              <h3 className="text-lg font-black text-slate-950">
                {block.title}
              </h3>
              <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                {block.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CampPageContent({
  page,
  content,
}: {
  page: EditableSitePage;
  content: EditableSiteContent;
}) {
  return (
    <div className="grid gap-8">
      <CampStoryBlocks content={content} />
      <DocumentsBlock page={page} />
    </div>
  );
}

function ProductCatalog({ page }: { page: EditableSitePage }) {
  if (page.kind !== "shop" || page.products.length === 0) {
    return null;
  }

  const requestHref = page.externalCta?.href;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
        Catalogus
      </p>
      <h2 className="mt-2 text-3xl font-black text-slate-950">
        Producten en materiaal
      </h2>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {page.products.map((product) => (
          <article
            className="lift-card rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5"
            key={product.name}
          >
            <h3 className="text-xl font-black text-slate-950">
              {product.name}
            </h3>
            <p className="mt-2 text-3xl font-black text-[#103001]">
              {product.price}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Maten: {product.sizes}
            </p>
            {requestHref ? (
              <Link
                className="mt-5 inline-flex rounded-full bg-[#103001] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
                href={requestHref}
                rel="noreferrer"
                target="_blank"
              >
                {product.action}
              </Link>
            ) : (
              <span className="mt-5 inline-flex rounded-full bg-[#edf6e8] px-5 py-2.5 text-sm font-bold text-[#103001] ring-1 ring-[#d7e8cf]">
                Link volgt binnenkort
              </span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function ExternalCtaBlock({ page }: { page: EditableSitePage }) {
  if (!page.externalCta) {
    return null;
  }

  const hasLink = Boolean(page.externalCta.href);

  return (
    <section
      className="rounded-[2rem] border border-[#d7e8cf] bg-[#edf6e8] p-6 shadow-xl shadow-green-950/8 sm:p-8"
      id="aanvragen"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="shrink-0">
            <IconBadge icon="check" tone="green" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">
              Externe link
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              {page.externalCta.title}
            </h2>
            <p className="mt-3 max-w-2xl whitespace-pre-line leading-7 text-slate-700">
              {page.externalCta.text}
            </p>
          </div>
        </div>

        {hasLink ? (
          <Link
            className="inline-flex shrink-0 justify-center rounded-full bg-[#103001] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/15 transition hover:-translate-y-0.5 hover:bg-[#1e4b0d]"
            href={page.externalCta.href}
            rel="noreferrer"
            target="_blank"
          >
            {page.externalCta.button}
          </Link>
        ) : (
          <span className="inline-flex shrink-0 justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-[#103001] ring-1 ring-[#d7e8cf]">
            Link volgt binnenkort
          </span>
        )}
      </div>
    </section>
  );
}

function LinksBlock({ page }: { page: EditableSitePage }) {
  if (page.kind !== "links" || page.links.length === 0) {
    return null;
  }

  const groupedLinks = page.links.reduce<Record<string, SitePageLinkItem[]>>(
    (groups, item) => {
      groups[item.category] = [...(groups[item.category] ?? []), item];
      return groups;
    },
    {}
  );

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
        Linkbibliotheek
      </p>
      <h2 className="mt-2 text-3xl font-black text-slate-950">
        Nuttige links per categorie
      </h2>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {Object.entries(groupedLinks).map(([category, links]) => (
          <article
            className="rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5"
            key={category}
          >
            <h3 className="text-xl font-black text-slate-950">{category}</h3>
            <div className="mt-4 grid gap-3">
              {links.map((item) => (
                <Link
                  className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:bg-[#edf6e8]"
                  href={item.href}
                  key={`${category}-${item.label}`}
                >
                  <span className="font-black text-[#103001]">{item.label}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-600">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActionFeatureBlocks({ page }: { page: EditableSitePage }) {
  const labels: Record<string, string> = {
    event: "Evenement",
    order: "Verkoopactie",
    reservation: "Reservatie",
  };
  const actionLabel = labels[page.kind] ?? "Actie";
  const hasLink = Boolean(page.externalCta?.href);

  return (
    <div className="grid gap-8">
      <section
        className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-green-950/8"
        id="aanvragen"
      >
        <div className="grid gap-0 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="bg-[#103001] p-6 text-white sm:p-8 lg:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-green-100">
              {actionLabel}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              {page.externalCta?.title || page.title}
            </h2>
            <p className="mt-4 whitespace-pre-line leading-8 text-green-50">
              {page.externalCta?.text || page.sidebarText}
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

          <div className="grid gap-4 p-6 sm:p-8 md:grid-cols-2 lg:p-10">
            {page.facts.map((fact) => (
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
                {fact.note ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {fact.note}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <CardsGrid page={page} />
    </div>
  );
}

function SteakBurgerdayContent({ page }: { page: EditableSitePage }) {
  const hasLink = Boolean(page.externalCta?.href);

  return (
    <div className="grid gap-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-green-950/8">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[#103001] p-6 text-white sm:p-8 lg:p-10">
            <IconBadge icon="heart" tone="light" />
            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-green-100">
              {page.highlight?.label || "Steunactie"}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              {page.highlight?.title || page.title}
            </h2>
          </div>
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="max-w-3xl whitespace-pre-line text-lg leading-8 text-slate-700">
              {page.highlight?.text || page.intro}
            </p>
          </div>
        </div>
      </section>

      {page.externalCta ? (
        <section
          className="rounded-[2rem] border border-[#d7e8cf] bg-[#edf6e8] p-6 shadow-xl shadow-green-950/8 sm:p-8"
          id="aanvragen"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <div className="shrink-0">
                <IconBadge icon="calendar" tone="green" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                  Reservatie
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {page.externalCta.title}
                </h2>
                <p className="mt-3 max-w-2xl whitespace-pre-line leading-7 text-slate-700">
                  {page.externalCta.text}
                </p>
              </div>
            </div>

            {hasLink ? (
              <Link
                className="inline-flex shrink-0 justify-center rounded-full bg-[#103001] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/15 transition hover:-translate-y-0.5 hover:bg-[#1e4b0d]"
                href={page.externalCta.href}
                rel="noreferrer"
                target="_blank"
              >
                {page.externalCta.button}
              </Link>
            ) : (
              <span className="inline-flex shrink-0 justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-[#103001] ring-1 ring-[#d7e8cf]">
                Link volgt binnenkort
              </span>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function RentalPageContent({
  page,
  content,
}: {
  page: EditableSitePage;
  content: EditableSiteContent;
}) {
  return (
    <div className="grid gap-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-green-950/8">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <IconBadge icon="check" tone="green" />
            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
              {content.siteName}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {page.sidebarTitle}
            </h2>
            <p className="mt-4 max-w-2xl whitespace-pre-line leading-8 text-slate-600">
              {page.sidebarText}
            </p>
          </div>

          {page.highlight ? (
            <div className="bg-[#103001] p-6 text-white sm:p-8 lg:p-10">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-green-100">
                {page.highlight.label}
              </p>
              <h3 className="mt-3 text-3xl font-black tracking-tight">
                {page.highlight.title}
              </h3>
              <p className="mt-4 whitespace-pre-line leading-8 text-green-50">
                {page.highlight.text}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
              {page.eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              {content.pageVerhuurMaterialsTitle}
            </h2>
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {page.cards.map((card) => (
            <article
              className="rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5"
              key={card.title}
            >
              <h3 className="text-xl font-black text-slate-950">
                {card.title}
              </h3>
              <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                {card.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {page.facts.length > 0 ? (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
            {page.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">
            {content.pageVerhuurPricesTitle}
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {page.facts.map((fact) => (
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
                {fact.note ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {fact.note}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <ExternalCtaBlock page={page} />
    </div>
  );
}

function CommitteePageContent({
  page,
  content,
}: {
  page: EditableSitePage;
  content: EditableSiteContent;
}) {
  return (
    <div className="grid gap-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <IconBadge icon="check" tone="green" />
            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
              {page.highlight?.label || page.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {page.sidebarTitle}
            </h2>
            <p className="mt-4 max-w-2xl whitespace-pre-line leading-8 text-slate-600">
              {page.sidebarText}
            </p>
          </div>

          {page.highlight ? (
            <div className="rounded-[2rem] bg-[#edf6e8] p-6 ring-1 ring-[#d7e8cf] sm:p-7">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                {page.highlight.title}
              </p>
              <p className="mt-3 whitespace-pre-line text-lg leading-8 text-[#103001]">
                {page.highlight.text}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
          {page.eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">
          {content.pageOudercomiteWorkTitle}
        </h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {page.cards.map((card) => (
            <article
              className="rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5"
              key={card.title}
            >
              <h3 className="text-xl font-black text-slate-950">
                {card.title}
              </h3>
              <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                {card.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {page.facts.length > 0 ? (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
            {page.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">
            {content.pageOudercomiteJoinTitle}
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {page.facts.map((fact) => (
              <article
                className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200"
                key={`${fact.label}-${fact.value}`}
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                  {fact.label}
                </p>
                <p className="mt-2 text-lg font-black text-slate-950">
                  {fact.value}
                </p>
                {fact.note ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {fact.note}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
          {page.eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">
          {content.pageOudercomiteMembersTitle}
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {page.committeeMembers.map((member) => (
            <span
              className="rounded-full bg-[#edf6e8] px-4 py-2 text-sm font-bold text-[#103001] ring-1 ring-[#d7e8cf]"
              key={member}
            >
              {member}
            </span>
          ))}
        </div>
      </section>

      <ExternalCtaBlock page={page} />
    </div>
  );
}

function FeatureBlocks({ page }: { page: EditableSitePage }) {
  if (["event", "order", "reservation"].includes(page.kind)) {
    return <ActionFeatureBlocks page={page} />;
  }

  return (
    <div className="grid gap-8">
      <CardsGrid page={page} />
      <DocumentsBlock page={page} />
      <ProductCatalog page={page} />
      <LinksBlock page={page} />
      <ExternalCtaBlock page={page} />
    </div>
  );
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { slug } = await params;
  const basePage = getSitePageBySlug(slug);

  if (!basePage) {
    notFound();
  }

  const siteContent = await getSiteContent();
  const page = getEditableSitePage(basePage, siteContent);
  const visual = getPageKindVisual(page);
  const heroFacts = page.facts.slice(0, 2);

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
                    <h2 className="mt-1 text-xl font-black">
                      {page.navLabel}
                    </h2>
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
          {page.kind === "rental" ? (
            <RentalPageContent page={page} content={siteContent} />
          ) : page.kind === "committee" ? (
            <CommitteePageContent page={page} content={siteContent} />
          ) : page.kind === "camp" ? (
            <CampPageContent page={page} content={siteContent} />
          ) : page.slug === "steak-en-burgerday" ? (
            <SteakBurgerdayContent page={page} />
          ) : (
            <>
              <PageOverview page={page} siteName={siteContent.siteName} />

              {page.kind === "single" ? (
                <div className="grid gap-8">
                  {page.body ? (
                    <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-green-950/8 sm:p-10">
                      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
                        Informatie
                      </p>
                      <h2 className="mt-2 text-3xl font-black text-slate-950">
                        {page.title}
                      </h2>
                      <div className="mt-6 whitespace-pre-line rounded-3xl bg-[#fbfdf9] p-6 text-base leading-8 text-slate-700 ring-1 ring-slate-200 sm:p-8">
                        {page.body}
                      </div>
                    </section>
                  ) : null}
                  <ExternalCtaBlock page={page} />
                </div>
              ) : (
                <FeatureBlocks page={page} />
              )}
            </>
          )}
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
