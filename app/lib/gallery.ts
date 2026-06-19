import type { EditableSiteContent } from "./site-content-defaults";
import { images } from "./image-placeholders";

export type GalleryTheme = {
  slug: string;
  label: string;
  alt: string;
  coverKey: keyof EditableSiteContent;
  collageKey: keyof EditableSiteContent;
  className: string;
  placeholderImages: string[];
};

export const galleryThemes: GalleryTheme[] = [
  {
    slug: "bosspel",
    label: "Bosspel",
    alt: "Scoutsleden tijdens een bosspel",
    coverKey: "galleryBosspelImageUrl",
    collageKey: "galleryBosspelImages",
    className: "md:col-span-3 md:row-span-2",
    placeholderImages: [
      images.galleryBosspel,
      images.galleryGroepsactiviteit,
      images.galleryWeekend,
    ],
  },
  {
    slug: "kamp",
    label: "Kamp",
    alt: "Tenten op een scoutskamp",
    coverKey: "galleryKampImageUrl",
    collageKey: "galleryKampImages",
    className: "md:col-span-3",
    placeholderImages: [images.galleryKamp, images.camp, images.hero],
  },
  {
    slug: "weekend",
    label: "Weekend",
    alt: "Groepsactiviteit van Scouts Sint-Jan Berchmans",
    coverKey: "galleryWeekendImageUrl",
    collageKey: "galleryWeekendImages",
    className: "md:col-span-3",
    placeholderImages: [
      images.galleryWeekend,
      images.galleryBosspel,
      images.galleryKampvuur,
    ],
  },
  {
    slug: "groepsactiviteit",
    label: "Groepsactiviteit",
    alt: "Groepsactiviteit van Scouts Sint-Jan Berchmans",
    coverKey: "galleryGroepsactiviteitImageUrl",
    collageKey: "galleryGroepsactiviteitImages",
    className: "md:col-span-2",
    placeholderImages: [
      images.galleryGroepsactiviteit,
      images.galleryBosspel,
      images.galleryKamp,
    ],
  },
  {
    slug: "kampvuur",
    label: "Kampvuur",
    alt: "Kampvuur tijdens een scoutsavond",
    coverKey: "galleryKampvuurImageUrl",
    collageKey: "galleryKampvuurImages",
    className: "md:col-span-4",
    placeholderImages: [
      images.galleryKampvuur,
      images.galleryWeekend,
      images.galleryKamp,
    ],
  },
];

export function getGalleryThemeBySlug(slug: string) {
  return galleryThemes.find((theme) => theme.slug === slug);
}

export function parseImageListValue(value: string) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string" && item)
      : [];
  } catch {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export function stringifyImageListValue(imagesToStore: string[]) {
  return JSON.stringify(imagesToStore.filter(Boolean));
}

export function getGalleryImages(
  theme: GalleryTheme,
  content: EditableSiteContent,
  includeCover = true
) {
  const uploadedImages = parseImageListValue(content[theme.collageKey]);
  const coverImage = content[theme.coverKey];
  const imagesFromContent =
    includeCover && coverImage
      ? [coverImage, ...uploadedImages.filter((image) => image !== coverImage)]
      : uploadedImages;

  if (imagesFromContent.length > 0) {
    return imagesFromContent;
  }

  return includeCover ? theme.placeholderImages : [];
}

export function getGalleryCover(theme: GalleryTheme, content: EditableSiteContent) {
  return (
    content[theme.coverKey] ||
    parseImageListValue(content[theme.collageKey])[0] ||
    theme.placeholderImages[0]
  );
}

// Collagefoto's worden nu beheerd als JSON-lijsten in de bestaande D1
// site_content tabel. De echte bestanden worden via /api/admin/media naar
// de MEDIA/R2 bucket geupload. Als je later naar bv. Supabase, Firebase,
// Cloudinary of een eigen backend verhuist, is dit de centrale plek om die
// opslaglogica te vervangen.
