/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import BranchLogo from "../../components/BranchLogo";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import SiteEditor from "../../components/SiteEditor";
import {
  branchProfiles,
  getBranchBySlug,
  getEditableBranchProfile,
} from "../../lib/branches";
import { getVisibleProgramItems } from "../../lib/program";
import { getSiteContent } from "@/db/site-content";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return branchProfiles.map((branch) => ({ slug: branch.slug }));
}

function splitLeaderNames(names: string) {
  return names
    .split(/\r?\n|,/)
    .map((name) => name.trim())
    .filter(Boolean);
}

type BranchDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BranchDetailPage({
  params,
}: BranchDetailPageProps) {
  const { slug } = await params;
  const baseBranch = getBranchBySlug(slug);

  if (!baseBranch) {
    notFound();
  }

  const siteContent = await getSiteContent();
  const branch = getEditableBranchProfile(baseBranch, siteContent);
  const otherBranches = branchProfiles
    .filter((item) => item.slug !== branch.slug)
    .map((item) => getEditableBranchProfile(item, siteContent));
  const leaderNames = splitLeaderNames(branch.leaderNames);
  const programItems = getVisibleProgramItems(branch.program);
  const planningSummary =
    programItems.length > 0
      ? branch.planningInfo.countText.replace(
          "{aantal}",
          String(programItems.length)
        )
      : branch.planningInfo.emptyText;

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="hero-sky relative isolate overflow-hidden px-5 pb-16 pt-28 text-white sm:px-8 sm:pb-20 sm:pt-32 lg:px-10">
        <Navbar logoUrl={siteContent.siteLogoUrl} siteName={siteContent.siteName} />
        <div aria-hidden="true" className="hero-lines absolute inset-0" />
        <div aria-hidden="true" className="visual-noise absolute inset-0 opacity-50" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="section-fade">
            <Link
              className="mb-5 inline-flex rounded-full border border-white/25 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-green-50 backdrop-blur transition hover:bg-white/20"
              href="/takken"
            >
              Terug naar alle takken
            </Link>
            <div className="mb-6 flex items-center gap-4">
              <BranchLogo branch={branch} content={siteContent} size="hero" />
              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#103001] shadow-xl shadow-green-950/10">
                {branch.age}
              </span>
            </div>
            <h1 className="text-5xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              {branch.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-green-50 sm:text-lg">
              {branch.intro}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {branch.highlights.map((highlight) => (
                <span
                  className="rounded-full border border-white/25 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-green-50 backdrop-blur"
                  key={highlight}
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-visual-card p-2 sm:p-3">
            <div
              aria-label={`${branch.name} in de natuur`}
              className="camp-scene has-photo min-h-[320px] lg:min-h-[360px]"
              role="img"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(16, 48, 1, 0.04), rgba(7, 26, 2, 0.64)), url("${branch.imageUrl}")`,
              }}
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="premium-card h-fit p-6 sm:p-7">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
              Deze tak
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
              Praktisch voor {branch.name}
            </h2>
            <div className="mt-6 grid gap-3">
              <div className="rounded-3xl bg-[#edf6e8] p-4 ring-1 ring-[#d7e8cf]">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#103001]">
                  Leeftijd
                </p>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {branch.age}
                </p>
              </div>
              <div className="rounded-3xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
                  Werking
                </p>
                <p className="mt-2 text-[15px] leading-7 text-slate-700">
                  Activiteiten op maat van hun leeftijd, begeleid door
                  geengageerde leiding.
                </p>
              </div>
            </div>
            <Link
              className="mt-7 inline-flex w-full justify-center rounded-full bg-[#103001] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/15 transition hover:-translate-y-0.5 hover:bg-[#1e4b0d]"
              href="/#contact"
            >
              Vraag info over {branch.name}
            </Link>
          </aside>

          <div className="grid gap-4">
            {branch.detailBlocks.map((block) => (
              <article className="premium-card p-6 sm:p-7" key={block.title}>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                  {block.title}
                </h2>
                <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">
                  {block.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div className="overflow-hidden rounded-[1.7rem] bg-[#edf6e8]">
            {branch.leaderPhotoUrl ? (
              <img
                alt={`Leiding van de ${branch.name}`}
                className="h-full min-h-[320px] w-full object-cover"
                src={branch.leaderPhotoUrl}
              />
            ) : (
              <div className="flex min-h-[320px] items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(47,107,24,0.22),transparent_30%),linear-gradient(135deg,#edf6e8,#ffffff)] p-8 text-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
                    Foto volgt
                  </p>
                  <p className="mt-3 text-2xl font-black text-[#103001]">
                    Leiding {branch.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
              Wie is de leiding?
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              De leiding van {branch.name}
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Ouders weten graag wie er elke week klaarstaat voor hun kind.
              Hier kan per scoutsjaar de actieve leiding van deze tak worden
              ingevuld.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {leaderNames.length > 0 ? (
                leaderNames.map((name) => (
                  <div
                    className="inline-flex max-w-full rounded-2xl bg-[#edf6e8] px-4 py-2.5 text-sm font-bold leading-6 text-[#103001] ring-1 ring-[#d7e8cf]"
                    key={name}
                  >
                    {name}
                  </div>
                ))
              ) : (
                <div className="inline-flex max-w-full rounded-2xl bg-[#edf6e8] px-4 py-2.5 text-sm font-bold leading-6 text-[#103001] ring-1 ring-[#d7e8cf]">
                  Leiding wordt binnenkort aangevuld
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfdf9] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8 lg:grid-cols-[1.12fr_0.58fr] lg:p-9">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
              Programma
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Wat staat er op de planning?
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Hier vind je de komende vergaderingen van {branch.name}. Elke
              kaart is een echte activiteit met datum, uur en uitleg van de
              leiding.
            </p>

            <div className="mt-8 grid gap-4">
              {programItems.length > 0 ? (
                programItems.map((item, index) => (
                  <article
                    className="rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-950/8 sm:p-6"
                    key={`${item.date}-${item.title}-${index}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                          {item.date}
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">
                          {item.title}
                        </h3>
                      </div>
                      <span className="inline-flex w-fit rounded-full bg-white px-4 py-2 text-sm font-black text-[#103001] ring-1 ring-[#d7e8cf]">
                        {item.time}
                      </span>
                    </div>
                    {item.description ? (
                      <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-600">
                        {item.description}
                      </p>
                    ) : null}
                  </article>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-[#fbfdf9] p-7 text-base leading-8 text-slate-600">
                  {branch.planningInfo.emptyText}
                </div>
              )}
            </div>
          </div>

          <aside className="relative h-fit overflow-hidden rounded-[2rem] bg-[#edf6e8] p-6 ring-1 ring-[#d7e8cf]">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/60" />
            <div className="relative">
              <BranchLogo branch={branch} content={siteContent} />
              <h3 className="mt-6 text-2xl font-black text-[#103001]">
                Planning {branch.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Het aantal blokken past zich automatisch aan op basis van wat de
                leiding invult.
              </p>
              <dl className="mt-6 grid gap-3 text-sm">
                {[
                  {
                    label: "Vaste dag",
                    value: branch.planningInfo.day,
                  },
                  {
                    label: "Uur",
                    value: branch.planningInfo.time,
                    note: branch.planningInfo.timeNote,
                  },
                  {
                    label: "Locatie",
                    value: branch.planningInfo.location,
                  },
                  {
                    label: "Meenemen",
                    value: branch.planningInfo.bring,
                  },
                  {
                    label: "Contact",
                    value: branch.planningInfo.contact,
                  },
                ].map((item) => (
                  <div
                    className="rounded-2xl bg-white/78 p-4 ring-1 ring-white"
                    key={item.label}
                  >
                    <dt className="font-black uppercase tracking-[0.12em] text-[#2f6b18]">
                      {item.label}
                    </dt>
                    <dd className="mt-1 font-semibold leading-6 text-slate-700">
                      {item.value}
                    </dd>
                    {item.note ? (
                      <dd className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                        {item.note}
                      </dd>
                    ) : null}
                  </div>
                ))}
              </dl>
              <p className="mt-5 rounded-2xl bg-[#103001] px-4 py-3 text-sm font-bold leading-6 text-white">
                {planningSummary}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#eef7ff] px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
                Ook ontdekken
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                Andere takken
              </h2>
            </div>
            <Link
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-[#2f6b18] shadow-sm ring-1 ring-slate-200 transition hover:bg-[#f2f8ee]"
              href="/takken"
            >
              Alle takken
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {otherBranches.map((item, index) => (
              <Link
                className="lift-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                href={`/takken/${item.slug}`}
                key={item.slug}
              >
                <BranchLogo
                  branch={item}
                  content={siteContent}
                  tone={index % 2 === 0 ? "green" : "blue"}
                />
                <h3 className="mt-5 text-xl font-black text-slate-950">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm font-bold text-[#2f6b18]">
                  {item.age}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer content={siteContent} />
      <SiteEditor initialContent={siteContent} />
    </main>
  );
}
