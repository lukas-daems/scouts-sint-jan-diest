import type { EditableSiteContent } from "./site-content-defaults";
import { images } from "./image-placeholders";

export type SitePageKind =
  | "overview"
  | "camp"
  | "event"
  | "order"
  | "reservation"
  | "shop"
  | "committee"
  | "rental"
  | "links"
  | "single";

export type SiteInfoPage = {
  slug: string;
  prefix: string;
  navLabel: string;
  kind: SitePageKind;
  introKey: keyof EditableSiteContent;
  bodyKey?: keyof EditableSiteContent;
  titleKey?: keyof EditableSiteContent;
  fallbackImageUrl: string;
};

export type SitePageCard = {
  title: string;
  text: string;
};

export type SitePageFact = {
  label: string;
  value: string;
  note?: string;
};

export type SitePageDocument = {
  label: string;
  href: string;
  description: string;
};

export type SitePageProduct = {
  name: string;
  price: string;
  sizes: string;
  action: string;
};

export type SitePageLinkItem = {
  category: string;
  label: string;
  href: string;
  description: string;
};

export type SitePageExternalCta = {
  title: string;
  text: string;
  button: string;
  href: string;
};

export type EditableSitePage = SiteInfoPage & {
  eyebrow: string;
  title: string;
  intro: string;
  body?: string;
  imageUrl: string;
  sidebarTitle: string;
  sidebarText: string;
  cards: SitePageCard[];
  facts: SitePageFact[];
  highlight?: SitePageCard & { label: string };
  documents: SitePageDocument[];
  updates: string;
  products: SitePageProduct[];
  links: SitePageLinkItem[];
  externalCta?: SitePageExternalCta;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
};

export type SitePageAdminField = {
  key: keyof EditableSiteContent;
  label: string;
  kind?: "input" | "textarea";
};

export type SitePageAdminGroup = {
  title: string;
  description: string;
  fields: SitePageAdminField[];
};

export const sitePages: SiteInfoPage[] = [
  {
    slug: "activiteiten",
    prefix: "Activities",
    navLabel: "Activiteiten",
    kind: "overview",
    introKey: "pageActivitiesIntro",
    fallbackImageUrl: images.galleryBosspel,
  },
  {
    slug: "zomerkamp",
    prefix: "Zomerkamp",
    navLabel: "Zomerkamp",
    kind: "camp",
    introKey: "pageZomerkampIntro",
    fallbackImageUrl: images.camp,
  },
  {
    slug: "dropping",
    prefix: "Dropping",
    navLabel: "Dropping",
    kind: "event",
    introKey: "pageDroppingIntro",
    fallbackImageUrl: images.galleryGroepsactiviteit,
  },
  {
    slug: "ontbijtmanden",
    prefix: "Ontbijtmanden",
    navLabel: "Ontbijtmanden",
    kind: "order",
    introKey: "pageOntbijtmandenIntro",
    fallbackImageUrl: images.galleryWeekend,
  },
  {
    slug: "steak-en-burgerday",
    prefix: "SteakBurgerday",
    navLabel: "Steak- en Burgerday",
    kind: "reservation",
    introKey: "pageSteakBurgerdayIntro",
    fallbackImageUrl: images.galleryKampvuur,
  },
  {
    slug: "shop",
    prefix: "Shop",
    navLabel: "Shop",
    kind: "shop",
    introKey: "pageShopIntro",
    fallbackImageUrl: images.galleryTechnieken,
  },
  {
    slug: "oudercomite",
    prefix: "Oudercomite",
    navLabel: "Oudercomite",
    kind: "committee",
    introKey: "pageOudercomiteIntro",
    fallbackImageUrl: images.galleryGroepsactiviteit,
  },
  {
    slug: "verhuur",
    prefix: "Verhuur",
    navLabel: "Verhuur",
    kind: "rental",
    introKey: "pageVerhuurIntro",
    fallbackImageUrl: images.galleryKamp,
  },
  {
    slug: "oud-leiding",
    prefix: "OudLeiding",
    navLabel: "Oud-leiding",
    kind: "single",
    introKey: "pageOudLeidingIntro",
    bodyKey: "pageOudLeidingBody",
    titleKey: "pageOudLeidingTitle",
    fallbackImageUrl: images.galleryWeekend,
  },
  {
    slug: "links",
    prefix: "Links",
    navLabel: "Links",
    kind: "links",
    introKey: "pageLinksIntro",
    fallbackImageUrl: images.hero,
  },
];

function keyFor(page: SiteInfoPage, suffix: string) {
  return `page${page.prefix}${suffix}` as keyof EditableSiteContent;
}

function valueFor(
  content: EditableSiteContent,
  page: SiteInfoPage,
  suffix: string
) {
  return content[keyFor(page, suffix)] || "";
}

function parseCards(value: string): SitePageCard[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "", text = ""] = line.split("|");
      return { title: title.trim(), text: text.trim() };
    })
    .filter((item) => item.title || item.text);
}

function parseFacts(value: string): SitePageFact[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", valueText = "", note = ""] = line.split("|");
      return {
        label: label.trim(),
        value: valueText.trim(),
        note: note.trim(),
      };
    })
    .filter((item) => item.label || item.value);
}

function parseDocuments(value: string): SitePageDocument[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", href = "", description = ""] = line.split("|");
      return {
        label: label.trim(),
        href: href.trim() || "/#contact",
        description: description.trim(),
      };
    })
    .filter((item) => item.label);
}

function parseProducts(value: string): SitePageProduct[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", price = "", sizes = "", action = "Aanvragen"] =
        line.split("|");
      return {
        name: name.trim(),
        price: price.trim(),
        sizes: sizes.trim(),
        action: action.trim(),
      };
    })
    .filter((item) => item.name);
}

function parseLinks(value: string): SitePageLinkItem[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [category = "", label = "", href = "", description = ""] =
        line.split("|");
      return {
        category: category.trim() || "Algemeen",
        label: label.trim(),
        href: href.trim() || "/#contact",
        description: description.trim(),
      };
    })
    .filter((item) => item.label);
}

export function getEditableSitePage(
  page: SiteInfoPage,
  content: EditableSiteContent
): EditableSitePage {
  const highlightLabel = valueFor(content, page, "HighlightLabel");
  const highlightTitle = valueFor(content, page, "HighlightTitle");
  const highlightText = valueFor(content, page, "HighlightText");
  const primaryLabel = valueFor(content, page, "PrimaryCtaLabel");
  const primaryHref = valueFor(content, page, "PrimaryCtaHref");
  const secondaryLabel = valueFor(content, page, "SecondaryCtaLabel");
  const secondaryHref = valueFor(content, page, "SecondaryCtaHref");
  const externalTitle = valueFor(content, page, "ExternalCtaTitle");
  const externalText = valueFor(content, page, "ExternalCtaText");
  const externalButton = valueFor(content, page, "ExternalCtaButton");
  const externalHref = valueFor(content, page, "ExternalCtaUrl");

  return {
    ...page,
    eyebrow: valueFor(content, page, "Eyebrow"),
    title: page.titleKey
      ? content[page.titleKey] || valueFor(content, page, "Title")
      : valueFor(content, page, "Title"),
    intro: content[page.introKey] || "",
    body: page.bodyKey ? content[page.bodyKey] : undefined,
    imageUrl: valueFor(content, page, "ImageUrl") || page.fallbackImageUrl,
    sidebarTitle: valueFor(content, page, "SidebarTitle"),
    sidebarText: valueFor(content, page, "SidebarText"),
    cards: parseCards(valueFor(content, page, "Cards")),
    facts: parseFacts(valueFor(content, page, "Facts")),
    highlight:
      highlightLabel || highlightTitle || highlightText
        ? {
            label: highlightLabel,
            title: highlightTitle,
            text: highlightText,
          }
        : undefined,
    documents: parseDocuments(valueFor(content, page, "Documents")),
    updates: valueFor(content, page, "Updates"),
    products: parseProducts(valueFor(content, page, "Products")),
    links: parseLinks(valueFor(content, page, "Items")),
    externalCta:
      externalTitle || externalText || externalButton || externalHref
        ? {
            title: externalTitle,
            text: externalText,
            button: externalButton || "Open formulier",
            href: externalHref,
          }
        : undefined,
    primaryCta:
      primaryLabel || primaryHref
        ? { label: primaryLabel, href: primaryHref || "/#contact" }
        : undefined,
    secondaryCta:
      secondaryLabel || secondaryHref
        ? { label: secondaryLabel, href: secondaryHref || "/#contact" }
        : undefined,
  };
}

export function getSitePageBySlug(slug: string) {
  return sitePages.find((page) => page.slug === slug);
}

export function getSitePageAdminGroups(page: SiteInfoPage): SitePageAdminGroup[] {
  const groups: SitePageAdminGroup[] = [
    {
      title: "Inhoud",
      description: "Hero, intro en hoofdbeeld.",
      fields: [
        { key: keyFor(page, "Eyebrow"), label: "Badge boven titel" },
        { key: page.titleKey ?? keyFor(page, "Title"), label: "Titel" },
        { key: page.introKey, label: "Intro tekst", kind: "textarea" },
      ],
    },
    {
      title: "Praktische info",
      description:
        "Zijblok, infokaarten en eventuele highlight. Gebruik bij kaarten: titel|tekst. Gebruik bij praktische info: label|waarde|kleine nota.",
      fields: [
        { key: keyFor(page, "SidebarTitle"), label: "Zijblok titel" },
        { key: keyFor(page, "SidebarText"), label: "Zijblok tekst", kind: "textarea" },
        { key: keyFor(page, "Cards"), label: "Kaarten, 1 per lijn: titel|tekst", kind: "textarea" },
        { key: keyFor(page, "Facts"), label: "Praktische info, 1 per lijn: label|waarde|nota", kind: "textarea" },
        { key: keyFor(page, "HighlightLabel"), label: "Highlight label" },
        { key: keyFor(page, "HighlightTitle"), label: "Highlight titel" },
        { key: keyFor(page, "HighlightText"), label: "Highlight tekst", kind: "textarea" },
      ],
    },
    {
      title: "CTA's",
      description: "Knoppen bovenaan en onderaan de pagina.",
      fields: [
        { key: keyFor(page, "PrimaryCtaLabel"), label: "Primaire knop tekst" },
        { key: keyFor(page, "PrimaryCtaHref"), label: "Primaire knop link" },
        { key: keyFor(page, "SecondaryCtaLabel"), label: "Secundaire knop tekst" },
        { key: keyFor(page, "SecondaryCtaHref"), label: "Secundaire knop link" },
        { key: "pageSharedCtaEyebrow", label: "Gedeelde CTA kleine tekst" },
        { key: "pageSharedCtaTitle", label: "Gedeelde CTA titel" },
        { key: "pageSharedCtaButton", label: "Gedeelde CTA knop" },
      ],
    },
  ];

  if (page.kind === "camp") {
    groups.push({
      title: "Documenten en updates",
      description:
        "Gebruik bij documenten: naam|link|uitleg. Updates mogen meerdere regels bevatten.",
      fields: [
        { key: keyFor(page, "Documents"), label: "Documenten", kind: "textarea" },
        { key: keyFor(page, "Updates"), label: "Praktische updates", kind: "textarea" },
      ],
    });
  }

  if (page.kind === "shop") {
    groups.push({
      title: "Productcatalogus",
      description: "Gebruik: productnaam|prijs|maten|knoptekst.",
      fields: [
        { key: keyFor(page, "Products"), label: "Producten", kind: "textarea" },
      ],
    });
  }

  if (page.kind === "links") {
    groups.push({
      title: "Linkpagina",
      description: "Gebruik: categorie|label|url|uitleg.",
      fields: [
        { key: keyFor(page, "Items"), label: "Links", kind: "textarea" },
      ],
    });
  }

  if (page.bodyKey) {
    groups.push({
      title: "Groot tekstblok",
      description: "Deze tekst behoudt witruimte en nieuwe regels.",
      fields: [{ key: page.bodyKey, label: "Tekstblok", kind: "textarea" }],
    });
  }

  if (["event", "order", "reservation", "shop", "committee", "rental"].includes(page.kind)) {
    groups.push({
      title: "Externe formulierlink",
      description:
        "Geen ingebouwd formulier op de site. Plaats hier de link naar bijvoorbeeld Google Forms, Microsoft Forms of een ander extern formulier.",
      fields: [
        { key: keyFor(page, "ExternalCtaTitle"), label: "Titel van de CTA-balk" },
        { key: keyFor(page, "ExternalCtaText"), label: "Korte uitlegtekst", kind: "textarea" },
        { key: keyFor(page, "ExternalCtaButton"), label: "Knoptekst" },
        { key: keyFor(page, "ExternalCtaUrl"), label: "Externe formulierlink" },
      ],
    });
  }

  return groups;
}

export function getSitePageImageKey(page: SiteInfoPage) {
  return keyFor(page, "ImageUrl");
}

export const sitePageGroups = [
  {
    label: "Activiteiten",
    href: "/activiteiten",
    slugs: ["activiteiten", "zomerkamp", "dropping", "steak-en-burgerday"],
    items: [
      { label: "Activiteiten", href: "/activiteiten" },
      { label: "Zomerkamp", href: "/zomerkamp" },
      { label: "Dropping", href: "/dropping" },
      { label: "Steak- en Burgerday", href: "/steak-en-burgerday" },
    ],
  },
  {
    label: "Steun ons",
    href: "/ontbijtmanden",
    slugs: ["ontbijtmanden", "steak-en-burgerday", "dropping", "shop"],
    items: [
      { label: "Ontbijtmanden", href: "/ontbijtmanden" },
      { label: "Steak- en Burgerday", href: "/steak-en-burgerday" },
      { label: "Dropping", href: "/dropping" },
      { label: "Shop", href: "/shop" },
    ],
  },
  {
    label: "Praktisch",
    href: "/oudercomite",
    slugs: ["oudercomite", "verhuur", "links"],
    items: [
      { label: "Oudercomite", href: "/oudercomite" },
      { label: "Verhuur", href: "/verhuur" },
      { label: "Links", href: "/links" },
    ],
  },
  {
    label: "Meer",
    href: "/oud-leiding",
    slugs: ["oud-leiding"],
    items: [{ label: "Oud-leiding", href: "/oud-leiding" }],
  },
];
