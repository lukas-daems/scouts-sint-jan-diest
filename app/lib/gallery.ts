import type { EditableSiteContent } from "./site-content-defaults";
import { images } from "./image-placeholders";

export type GalleryTheme = {
  slug: string;
  label: string;
  alt: string;
  coverKey?: keyof EditableSiteContent;
  collageKey?: keyof EditableSiteContent;
  className: string;
  placeholderImages: string[];
  custom?: boolean;
  coverUrl?: string;
  images?: string[];
};

export type CustomGalleryTheme = {
  id: string;
  slug: string;
  label: string;
  alt?: string;
  coverUrl?: string;
  images: string[];
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

export function parseCustomGalleryThemes(value: string): CustomGalleryTheme[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item, index) => {
        const label =
          typeof item?.label === "string" && item.label.trim()
            ? item.label.trim()
            : `Extra collage ${index + 1}`;
        const slug =
          typeof item?.slug === "string" && item.slug.trim()
            ? item.slug.trim()
            : slugifyGalleryLabel(label, index);
        const images = Array.isArray(item?.images)
          ? item.images.filter(
              (image: unknown): image is string =>
                typeof image === "string" && image.length > 0
            )
          : [];

        return {
          id:
            typeof item?.id === "string" && item.id.trim()
              ? item.id.trim()
              : `custom-${index + 1}`,
          slug,
          label,
          alt:
            typeof item?.alt === "string" && item.alt.trim()
              ? item.alt.trim()
              : `Sfeerbeelden van ${label}`,
          coverUrl:
            typeof item?.coverUrl === "string" && item.coverUrl.trim()
              ? item.coverUrl.trim()
              : "",
          images,
        };
      })
      .filter((item) => item.slug && item.label);
  } catch {
    return [];
  }
}

export function stringifyCustomGalleryThemes(items: CustomGalleryTheme[]) {
  return JSON.stringify(
    items.map((item) => ({
      id: item.id,
      slug: item.slug,
      label: item.label,
      alt: item.alt ?? "",
      coverUrl: item.coverUrl ?? "",
      images: item.images.filter(Boolean),
    }))
  );
}

export function slugifyGalleryLabel(label: string, fallbackIndex = 0) {
  const slug = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `extra-collage-${fallbackIndex + 1}`;
}

export function getCustomGalleryThemes(content: EditableSiteContent): GalleryTheme[] {
  const layoutClasses = [
    "md:col-span-3",
    "md:col-span-3",
    "md:col-span-2",
    "md:col-span-4",
  ];

  return parseCustomGalleryThemes(content.galleryCustomThemes).map(
    (item, index) => ({
      slug: item.slug,
      label: item.label,
      alt: item.alt || `Sfeerbeelden van ${item.label}`,
      className: layoutClasses[index % layoutClasses.length],
      placeholderImages: [images.hero, images.galleryWeekend, images.galleryKamp],
      custom: true,
      coverUrl: item.coverUrl,
      images: item.images,
    })
  );
}

export function getAllGalleryThemes(content: EditableSiteContent) {
  return [...galleryThemes, ...getCustomGalleryThemes(content)];
}

export function getGalleryThemeBySlug(
  slug: string,
  content?: EditableSiteContent
) {
  const staticTheme = galleryThemes.find((theme) => theme.slug === slug);
  if (staticTheme) {
    return staticTheme;
  }

  return content
    ? getCustomGalleryThemes(content).find((theme) => theme.slug === slug)
    : undefined;
}

export function parseImageListValue(value: string) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is string => typeof item === "string" && item.length > 0
        )
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
  if (theme.custom) {
    const uploadedImages = theme.images ?? [];
    const coverImage = theme.coverUrl ?? "";
    const imagesFromContent =
      includeCover && coverImage
        ? [coverImage, ...uploadedImages.filter((image) => image !== coverImage)]
        : uploadedImages;

    return imagesFromContent.length > 0
      ? imagesFromContent
      : includeCover
        ? theme.placeholderImages
        : [];
  }

  if (!theme.collageKey || !theme.coverKey) {
    return includeCover ? theme.placeholderImages : [];
  }

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
  if (theme.custom) {
    return (
      theme.coverUrl ||
      theme.images?.[0] ||
      theme.placeholderImages[0]
    );
  }

  if (!theme.coverKey || !theme.collageKey) {
    return theme.placeholderImages[0];
  }

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
