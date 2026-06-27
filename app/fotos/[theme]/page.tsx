/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import SiteEditor from "../../components/SiteEditor";
import {
  galleryThemes,
  getGalleryImages,
  getGalleryThemeBySlug,
} from "../../lib/gallery";
import { getSiteContent } from "@/db/site-content";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return galleryThemes.map((theme) => ({ theme: theme.slug }));
}

type GalleryDetailPageProps = {
  params: Promise<{ theme: string }>;
};

export default async function GalleryDetailPage({
  params,
}: GalleryDetailPageProps) {
  const { theme: themeSlug } = await params;
  const siteContent = await getSiteContent();
  const theme = getGalleryThemeBySlug(themeSlug, siteContent);

  if (!theme) {
    notFound();
  }

  const photos = getGalleryImages(theme, siteContent);

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
        <div className="relative mx-auto max-w-7xl">
          <Link
            className="forest-glass-pill mb-5 inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-green-50 transition hover:bg-white/20"
            href="/fotos"
          >
            Terug naar sfeerbeelden
          </Link>
          <div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="forest-glass-pill mb-5 inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-green-50">
                Fotocollage
              </p>
              <h1 className="text-5xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
                {theme.label}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-green-50">
                Een aparte galerijweergave met meerdere beelden rond dit thema,
                verzameld uit activiteiten, weekends en kampmomenten.
              </p>
            </div>
            <div className="hero-visual-card p-2 sm:p-3">
              <div
                aria-label={theme.alt}
                className="camp-scene has-photo min-h-[340px]"
                role="img"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(16, 48, 1, 0.03), rgba(7, 26, 2, 0.66)), url("${photos[0]}")`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
                {photos.length} beelden
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                Collage {theme.label}
              </h2>
            </div>
            <Link
              className="inline-flex rounded-full bg-[#103001] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-green-950/15 transition hover:-translate-y-0.5 hover:bg-[#1e4b0d]"
              href="/#contact"
            >
              Foto delen of vraag stellen
            </Link>
          </div>

          <div className="mt-12 grid auto-rows-[240px] gap-5 md:grid-cols-6 lg:auto-rows-[280px]">
            {photos.map((photo, index) => (
              <article
                className={`group relative overflow-hidden rounded-[2rem] border border-white bg-white shadow-xl shadow-green-950/8 ${
                  index === 0
                    ? "md:col-span-3 md:row-span-2"
                    : index === 1
                      ? "md:col-span-3"
                      : index % 4 === 0
                        ? "md:col-span-4"
                        : "md:col-span-2"
                }`}
                key={`${photo}-${index}`}
              >
                <img
                  alt={`${theme.label} foto ${index + 1}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  src={photo}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/0 to-transparent opacity-70" />
                <div className="forest-glass-light absolute bottom-5 left-5 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#103001]">
                  {theme.label}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer content={siteContent} />
      <SiteEditor initialContent={siteContent} />
    </main>
  );
}
