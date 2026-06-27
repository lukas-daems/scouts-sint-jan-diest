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
  committeeMembers: string[];
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

export function parseCards(value: string): SitePageCard[] {
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

export function parseFacts(value: string): SitePageFact[] {
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

export function parseDocuments(value: string): SitePageDocument[] {
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

export function parseProducts(value: string): SitePageProduct[] {
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

export function parseLinks(value: string): SitePageLinkItem[] {
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

export function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function stringifyCards(items: SitePageCard[]) {
  return items
    .filter((item) => item.title.trim() || item.text.trim())
    .map((item) => `${item.title.trim()}|${item.text.trim()}`)
    .join("\n");
}

export function stringifyFacts(items: SitePageFact[]) {
  return items
    .filter((item) => item.label.trim() || item.value.trim() || item.note?.trim())
    .map((item) =>
      [item.label.trim(), item.value.trim(), (item.note ?? "").trim()].join("|")
    )
    .join("\n");
}

export function stringifyDocuments(items: SitePageDocument[]) {
  return items
    .filter((item) => item.label.trim() || item.href.trim() || item.description.trim())
    .map((item) =>
      [item.label.trim(), item.href.trim(), item.description.trim()].join("|")
    )
    .join("\n");
}

export function stringifyProducts(items: SitePageProduct[]) {
  return items
    .filter((item) => item.name.trim() || item.price.trim() || item.sizes.trim())
    .map((item) =>
      [
        item.name.trim(),
        item.price.trim(),
        item.sizes.trim(),
        item.action.trim(),
      ].join("|")
    )
    .join("\n");
}

export function stringifyLinks(items: SitePageLinkItem[]) {
  return items
    .filter((item) => item.label.trim() || item.href.trim() || item.description.trim())
    .map((item) =>
      [
        item.category.trim(),
        item.label.trim(),
        item.href.trim(),
        item.description.trim(),
      ].join("|")
    )
    .join("\n");
}

export function stringifyLines(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean).join("\n");
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
    committeeMembers:
      page.kind === "committee" ? parseLines(valueFor(content, page, "Members")) : [],
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
      title: "Bovenkant van de pagina",
      description: "De badge, titel en introtekst die bezoekers als eerste zien.",
      fields: [
        { key: keyFor(page, "Eyebrow"), label: "Kleine tekst boven de titel" },
        { key: page.titleKey ?? keyFor(page, "Title"), label: "Grote titel" },
        { key: page.introKey, label: "Korte uitleg onder de titel", kind: "textarea" },
      ],
    },
    {
      title: "Inhoudsblokken",
      description:
        "De tekstblokken, infokaarten en het opvallende accentblok op deze pagina.",
      fields: [
        { key: keyFor(page, "SidebarTitle"), label: "Titel van het eerste tekstblok" },
        { key: keyFor(page, "SidebarText"), label: "Tekst van het eerste tekstblok", kind: "textarea" },
        { key: keyFor(page, "Cards"), label: "Witte tekstkaarten", kind: "textarea" },
        { key: keyFor(page, "Facts"), label: "Kleine praktische infokaarten", kind: "textarea" },
        { key: keyFor(page, "HighlightLabel"), label: "Accentblok: kleine tekst" },
        { key: keyFor(page, "HighlightTitle"), label: "Accentblok: titel" },
        { key: keyFor(page, "HighlightText"), label: "Accentblok: uitleg", kind: "textarea" },
      ],
    },
    {
      title: "Knoppen",
      description: "De knoppen bovenaan en de gedeelde contactbalk onderaan de pagina.",
      fields: [
        { key: keyFor(page, "PrimaryCtaLabel"), label: "Eerste knop: tekst" },
        { key: keyFor(page, "PrimaryCtaHref"), label: "Eerste knop: link" },
        { key: keyFor(page, "SecondaryCtaLabel"), label: "Tweede knop: tekst" },
        { key: keyFor(page, "SecondaryCtaHref"), label: "Tweede knop: link" },
        { key: "pageSharedCtaEyebrow", label: "Contactbalk onderaan: kleine tekst" },
        { key: "pageSharedCtaTitle", label: "Contactbalk onderaan: titel" },
        { key: "pageSharedCtaButton", label: "Contactbalk onderaan: knop" },
      ],
    },
  ];

  if (page.kind === "camp") {
    groups[1] = {
      title: "Kampverhaal",
      description:
        "De twee zichtbare inhoudsblokken op de zomerkamppagina: kampverhaal en korte duiding.",
      fields: [
        { key: "campHomepageNote", label: "Korte duiding bij kamp", kind: "textarea" },
        { key: "campWhat", label: "Wat is kamp?", kind: "textarea" },
        { key: "campForParents", label: "Voor ouders", kind: "textarea" },
        { key: "campForNewMembers", label: "Voor nieuwe leden", kind: "textarea" },
      ],
    };
  }

  if (page.slug === "steak-en-burgerday") {
    groups[1] = {
      title: "Steunverhaal",
      description:
        "Deze tekst legt uit waarom Steak- en Burgerday bestaat en hoe bezoekers de scouts steunen.",
      fields: [
        { key: keyFor(page, "HighlightLabel"), label: "Kleine tekst boven titel" },
        { key: keyFor(page, "HighlightTitle"), label: "Titel steunverhaal" },
        { key: keyFor(page, "HighlightText"), label: "Uitleg steunverhaal", kind: "textarea" },
      ],
    };
  }

  if (page.kind === "camp") {
    groups.push({
      title: "Documenten en updates",
      description:
        "Documenten en updates voor kampinfo. Updates mogen meerdere regels bevatten.",
      fields: [
        { key: keyFor(page, "Documents"), label: "Documenten", kind: "textarea" },
        { key: keyFor(page, "Updates"), label: "Praktische updates", kind: "textarea" },
      ],
    });
  }

  if (page.kind === "shop") {
    groups.push({
      title: "Productcatalogus",
      description: "Producten die als aparte productkaarten op de shop-pagina verschijnen.",
      fields: [
        { key: keyFor(page, "Products"), label: "Producten", kind: "textarea" },
      ],
    });
  }

  if (page.kind === "links") {
    groups.push({
      title: "Linkpagina",
      description: "Links die per categorie gegroepeerd worden op de linkpagina.",
      fields: [
        { key: keyFor(page, "Items"), label: "Links", kind: "textarea" },
      ],
    });
  }

  if (page.kind === "rental") {
    groups.push({
      title: "Blokken op de verhuurpagina",
      description:
        "Titels voor de aparte onderdelen rond materiaal en prijzen.",
      fields: [
        { key: keyFor(page, "MaterialsTitle"), label: "Titel materiaalblok" },
        { key: keyFor(page, "PricesTitle"), label: "Titel prijzenblok" },
      ],
    });
  }

  if (page.kind === "committee") {
    groups.push({
      title: "Blokken op de oudercomitepagina",
      description:
        "Titels en ledenlijst voor de pagina van het oudercomite.",
      fields: [
        { key: keyFor(page, "WorkTitle"), label: "Titel werkingblok" },
        { key: keyFor(page, "JoinTitle"), label: "Titel aansluitblok" },
        { key: keyFor(page, "MembersTitle"), label: "Titel ledenlijst" },
        { key: keyFor(page, "Members"), label: "Ledenlijst", kind: "textarea" },
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
      title: "Externe linkbalk",
      description:
        "Geen formulier op de site zelf. Plaats hier de link naar bijvoorbeeld Google Forms, Microsoft Forms of een mailadres.",
      fields: [
        { key: keyFor(page, "ExternalCtaTitle"), label: "Titel van de linkbalk" },
        { key: keyFor(page, "ExternalCtaText"), label: "Korte uitleg in de linkbalk", kind: "textarea" },
        { key: keyFor(page, "ExternalCtaButton"), label: "Tekst op de knop" },
        { key: keyFor(page, "ExternalCtaUrl"), label: "Link of mailadres" },
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
    slugs: ["oud-leiding", "fotos"],
    items: [
      { label: "Foto's", href: "/fotos" },
      { label: "Oud-leiding", href: "/oud-leiding" },
    ],
  },
];
