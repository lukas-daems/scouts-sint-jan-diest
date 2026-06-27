import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PhotoGallery from "../components/PhotoGallery";
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

      <PhotoGallery content={siteContent} />
      <Footer content={siteContent} />
      <SiteEditor initialContent={siteContent} />
    </main>
  );
}
