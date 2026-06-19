import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../components/Footer";
import IconBadge from "../components/IconBadge";
import Navbar from "../components/Navbar";
import PageDemoForm from "../components/PageDemoForm";
import SiteEditor from "../components/SiteEditor";
import {
  getEditableSitePage,
  getSitePageBySlug,
  sitePages,
  type EditableSitePage,
  type SitePageLinkItem,
} from "../lib/site-pages";
import { getSiteContent } from "@/db/site-content";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return sitePages.map((page) => ({ slug: page.slug }));
}

type InfoPageProps = {
  params: Promise<{ slug: string }>;
};

function CardsGrid({ page }: { page: EditableSitePage }) {
  if (page.cards.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {page.cards.map((card, index) => (
        <article
          className={`lift-card rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-green-950/6 ${
            index === 0 && page.cards.length > 3 ? "md:col-span-2" : ""
          }`}
          key={`${card.title}-${index}`}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#edf6e8] text-sm font-black text-[#103001] ring-1 ring-[#d7e8cf]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="mt-5 text-2xl font-black text-slate-950">
            {card.title}
          </h2>
          <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
            {card.text}
          </p>
        </article>
      ))}
    </div>
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

function ProductCatalog({ page }: { page: EditableSitePage }) {
  if (page.kind !== "shop" || page.products.length === 0) {
    return null;
  }

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
            <a
              className="mt-5 inline-flex rounded-full bg-[#103001] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
              href="#formulier"
            >
              {product.action}
            </a>
          </article>
        ))}
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

function FeatureBlocks({ page }: { page: EditableSitePage }) {
  return (
    <div className="grid gap-8">
      <CardsGrid page={page} />
      <DocumentsBlock page={page} />
      <ProductCatalog page={page} />
      <LinksBlock page={page} />
      {page.form ? (
        <PageDemoForm
          fields={page.form.fields}
          intro={page.form.intro}
          submitLabel={page.form.submitLabel}
          successMessage={page.form.successMessage}
          title={page.form.title}
        />
      ) : null}
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

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="hero-sky relative isolate overflow-hidden px-5 pb-20 pt-32 text-white sm:px-8 sm:pb-24 lg:px-10 lg:pt-36">
        <Navbar logoUrl={siteContent.siteLogoUrl} siteName={siteContent.siteName} />
        <div aria-hidden="true" className="hero-lines absolute inset-0" />
        <div aria-hidden="true" className="visual-noise absolute inset-0 opacity-50" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="section-fade">
            <p className="mb-5 inline-flex rounded-full border border-white/25 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-green-50 backdrop-blur">
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
                  className="inline-flex justify-center rounded-full border border-white/45 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                  href={page.secondaryCta.href}
                >
                  {page.secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="hero-visual-card p-2 sm:p-3">
            <div
              aria-label={`${page.title} bij Scouts Sint-Jan Diest`}
              className="camp-scene has-photo min-h-[340px]"
              role="img"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(16, 48, 1, 0.03), rgba(7, 26, 2, 0.66)), url("${page.imageUrl}")`,
              }}
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.42fr_0.58fr]">
          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8">
            <IconBadge icon={page.kind === "camp" ? "tent" : "check"} tone="green" />
            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
              Scouts Sint-Jan Diest
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              {page.sidebarTitle}
            </h2>
            <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
              {page.sidebarText}
            </p>
            {page.highlight ? (
              <div className="mt-7 rounded-3xl bg-[#edf6e8] p-5 ring-1 ring-[#d7e8cf]">
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
            <div className="mt-7">
              <FactsList page={page} />
            </div>
          </aside>

          {page.kind === "single" ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-green-950/8 sm:p-10">
              <h2 className="text-3xl font-black text-slate-950">
                {page.title}
              </h2>
              <p className="mt-5 whitespace-pre-line text-lg leading-9 text-slate-600">
                {page.intro}
              </p>
              {page.body ? (
                <div className="mt-8 whitespace-pre-line rounded-3xl bg-[#fbfdf9] p-6 text-base leading-8 text-slate-700 ring-1 ring-slate-200 sm:p-8">
                  {page.body}
                </div>
              ) : null}
              <div className="mt-8">
                <CardsGrid page={page} />
              </div>
            </div>
          ) : (
            <FeatureBlocks page={page} />
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
