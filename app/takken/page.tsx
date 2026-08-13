import Link from "next/link";
import BranchLogo from "../components/BranchLogo";
import Footer from "../components/Footer";
import SiteEditor from "../components/SiteEditor";
import SitePageHero from "../components/SitePageHero";
import { branchProfiles, getEditableBranchProfile } from "../lib/branches";
import { images } from "../lib/image-placeholders";
import { getSiteContent } from "@/db/site-content";

export const dynamic = "force-dynamic";

export default async function BranchesPage() {
  const siteContent = await getSiteContent();
  const heroImage = siteContent.heroImageUrl || images.hero;

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-slate-950">
      <SitePageHero
        content={siteContent}
        eyebrow={`Takken van ${siteContent.siteName}`}
        imageUrl={heroImage}
        intro={siteContent.branchesPageSubtitle}
        primaryCta={{ label: "Vraag info aan", href: "/#contact" }}
        secondaryCta={{ label: "Terug naar homepage", href: "/#takken" }}
        title={siteContent.branchesPageTitle}
      />

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
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d7e8cf] hover:shadow-xl hover:shadow-green-950/8 sm:p-7"
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
                            className="rounded-full bg-[#f6f8f3] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 ring-1 ring-slate-200"
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
