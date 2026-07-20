import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SectionHeader from "../components/SectionHeader";
import SiteEditor from "../components/SiteEditor";
import { getAllGalleryThemes, getGalleryCover } from "../lib/gallery";
import { getSiteContent } from "@/db/site-content";

export const dynamic = "force-dynamic";

export default async function FotosPage() {
  const siteContent = await getSiteContent();
  const themes = getAllGalleryThemes(siteContent);
  const firstTheme = themes[0];
  const heroImage = firstTheme
    ? getGalleryCover(firstTheme, siteContent)
    : siteContent.heroImageUrl;

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="hero-sky relative isolate overflow-hidden px-5 pb-16 pt-32 text-white sm:px-8 sm:pb-20 lg:px-10 lg:pt-36">
        <Navbar
          content={siteContent}
          logoUrl={siteContent.siteLogoUrl}
          siteName={siteContent.siteName}
        />
        <div aria-hidden="true" className="hero-lines absolute inset-0" />
        <div aria-hidden="true" className="visual-noise absolute inset-0 opacity-45" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-5 flex flex-wrap gap-3">
              <Link
                className="forest-glass-pill inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-green-50 transition hover:bg-white/20"
                href="/"
              >
                Terug naar home
              </Link>
              <p className="forest-glass-pill inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-green-50">
                Fotopagina
              </p>
            </div>
            <h1 className="text-5xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              {siteContent.galleryTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-green-50">
              {siteContent.gallerySubtitle}
            </p>
          </div>
          <div className="hero-visual-card p-2 sm:p-3">
            <div
              aria-label="Sfeerbeeld van Scouts Sint-Jan Berchmans"
              className="camp-scene has-photo min-h-[320px]"
              role="img"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(16, 48, 1, 0.03), rgba(7, 26, 2, 0.66)), url("${heroImage}")`,
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbff] px-5 py-20 sm:px-8 sm:py-28 lg:px-10" id="fotos">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            subtitle={siteContent.gallerySubtitle}
            title={siteContent.galleryTitle}
          />

          <div className="mt-12 grid auto-rows-[230px] gap-5 md:grid-cols-6 lg:auto-rows-[255px]">
            {themes.map((theme, index) => (
              <Link
                aria-label={`${theme.label} foto's bekijken`}
                className={`gallery-card has-photo group transition duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-950/15 ${theme.className}`}
                href={`/fotos/${theme.slug}`}
                key={theme.slug}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(4, 30, 76, 0), rgba(4, 30, 76, 0.78)), url("${getGalleryCover(theme, siteContent)}")`,
                }}
              >
                <div className="absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/25" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-sm font-semibold uppercase text-green-50">
                    Scouts Sint-Jan Berchmans
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">{theme.label}</h3>
                  <p className="mt-2 text-sm font-semibold text-white/80">
                    Bekijk collage
                  </p>
                </div>
                {index === 0 ? (
                  <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase text-slate-950 shadow-lg backdrop-blur">
                    Momenten die blijven
                  </div>
                ) : null}
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
