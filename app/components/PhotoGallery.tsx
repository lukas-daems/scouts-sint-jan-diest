import Link from "next/link";
import SectionHeader from "./SectionHeader";
import type { EditableSiteContent } from "../lib/site-content-defaults";
import { galleryThemes, getGalleryCover } from "../lib/gallery";

type PhotoGalleryProps = {
  content: EditableSiteContent;
};

export default function PhotoGallery({ content }: PhotoGalleryProps) {
  return (
    <section className="bg-[#f7fbff] px-5 py-20 sm:px-8 sm:py-28 lg:px-10" id="fotos">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          subtitle={content.gallerySubtitle}
          title={content.galleryTitle}
        />

        <div className="mt-12 grid auto-rows-[230px] gap-5 md:grid-cols-6 lg:auto-rows-[255px]">
          {galleryThemes.map((theme, index) => (
            <Link
              aria-label={`${theme.label} foto's bekijken`}
              className={`gallery-card has-photo group transition duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-950/15 ${theme.className}`}
              href={`/fotos/${theme.slug}`}
              key={theme.slug}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(4, 30, 76, 0), rgba(4, 30, 76, 0.78)), url("${getGalleryCover(theme, content)}")`,
              }}
            >
              <div className="absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/25" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-sm font-semibold uppercase text-green-50">
                  {content.siteName}
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
  );
}
