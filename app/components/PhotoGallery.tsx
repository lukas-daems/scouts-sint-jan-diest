import Link from "next/link";
import SectionHeader from "./SectionHeader";
import type { EditableSiteContent } from "../lib/site-content-defaults";
import { getAllGalleryThemes, getGalleryCover } from "../lib/gallery";

type PhotoGalleryProps = {
  content: EditableSiteContent;
};

export default function PhotoGallery({ content }: PhotoGalleryProps) {
  const themes = getAllGalleryThemes(content);

  return (
    <section className="bg-[#f7fbff] px-5 py-20 sm:px-8 sm:py-28 lg:px-10" id="fotos">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          subtitle={content.gallerySubtitle}
          title={content.galleryTitle}
        />

        <div className="mt-12 grid auto-rows-[230px] gap-5 md:grid-cols-6 lg:auto-rows-[255px]">
          {themes.map((theme) => (
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
              <div className="forest-glass-photo absolute inset-x-4 bottom-4 rounded-[1.4rem] p-4 text-white sm:inset-x-5 sm:bottom-5 sm:p-5">
                <p className="text-sm font-semibold uppercase text-green-50">
                  {content.siteName}
                </p>
                <h3 className="mt-2 text-2xl font-bold">{theme.label}</h3>
                <p className="mt-2 text-sm font-semibold text-white/80">
                  Bekijk collage
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
