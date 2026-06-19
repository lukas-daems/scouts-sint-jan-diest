import Link from "next/link";
import BranchLogo from "../components/BranchLogo";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SiteEditor from "../components/SiteEditor";
import { branchProfiles, getEditableBranchProfile } from "../lib/branches";
import { images } from "../lib/image-placeholders";
import { getSiteContent } from "@/db/site-content";

export const dynamic = "force-dynamic";

export default async function BranchesPage() {
  const siteContent = await getSiteContent();
  const heroImage = siteContent.heroImageUrl || images.hero;

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="hero-sky relative isolate overflow-hidden px-5 pb-24 pt-32 text-white sm:px-8 lg:px-10 lg:pt-36">
        <Navbar logoUrl={siteContent.siteLogoUrl} siteName={siteContent.siteName} />
        <div aria-hidden="true" className="hero-lines absolute inset-0" />
        <div aria-hidden="true" className="visual-noise absolute inset-0 opacity-50" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="section-fade">
            <p className="mb-5 inline-flex rounded-full border border-white/25 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-green-50 backdrop-blur">
              Takken van Scouts Sint-Jan Diest
            </p>
            <h1 className="text-5xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              {siteContent.branchesPageTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-green-50">
              {siteContent.branchesPageSubtitle}
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-green-950/20 transition hover:-translate-y-0.5 hover:bg-green-50"
                href="/#contact"
              >
                Vraag info aan
              </Link>
              <Link
                className="inline-flex justify-center rounded-full border border-white/45 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                href="/#takken"
              >
                Terug naar homepage
              </Link>
            </div>
          </div>

          <div className="hero-visual-card p-2 sm:p-3">
            <div
              aria-label="Scouts in de natuur"
              className="camp-scene has-photo min-h-[360px]"
              role="img"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(16, 48, 1, 0.05), rgba(7, 26, 2, 0.64)), url("${heroImage}")`,
              }}
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
              Overzicht
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Van eerste scoutsstappen tot meer verantwoordelijkheid
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Hieronder vind je per tak een korte uitleg. Klik door om meer te
              lezen over de werking, de sfeer en wat ouders mogen verwachten.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {branchProfiles.map((profile) => {
              const branch = getEditableBranchProfile(profile, siteContent);

              return (
                <Link
                  className="lift-card group relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/6 sm:p-7"
                  href={`/takken/${branch.slug}`}
                  key={branch.slug}
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <BranchLogo
                      branch={branch}
                      content={siteContent}
                      tone="green"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-black text-slate-950">
                          {branch.name}
                        </h3>
                        <span className="rounded-full bg-[#edf6e8] px-3.5 py-1.5 text-xs font-bold text-[#103001] ring-1 ring-[#d7e8cf]">
                          {branch.age}
                        </span>
                      </div>
                      <p className="mt-3 text-[15px] leading-7 text-slate-600">
                        {branch.shortDescription}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {branch.highlights.slice(0, 3).map((highlight) => (
                          <span
                            className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 ring-1 ring-slate-200"
                            key={highlight}
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                      <span className="mt-6 inline-flex text-sm font-black text-[#2f6b18] transition group-hover:text-[#103001]">
                        Lees meer over {branch.name} →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer content={siteContent} />
      <SiteEditor initialContent={siteContent} />
    </main>
  );
}
