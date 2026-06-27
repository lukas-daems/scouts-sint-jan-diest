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
      title: "Eerste indruk",
      description: "Pas de badge, titel en korte intro aan die bovenaan deze pagina staan.",
      fields: [
        { key: keyFor(page, "Eyebrow"), label: "Kleine badge bovenaan" },
        { key: page.titleKey ?? keyFor(page, "Title"), label: "Grote titel" },
        { key: page.introKey, label: "Intro onder de titel", kind: "textarea" },
      ],
    },
    {
      title: "Teksten en infokaarten",
      description:
        "Beheer de tekstkaartjes, praktische info en het opvallende accentblok op deze pagina.",
      fields: [
        { key: keyFor(page, "SidebarTitle"), label: "Eerste tekstblok: titel" },
        { key: keyFor(page, "SidebarText"), label: "Eerste tekstblok: tekst", kind: "textarea" },
        { key: keyFor(page, "Cards"), label: "Tekstkaarten", kind: "textarea" },
        { key: keyFor(page, "Facts"), label: "Praktische kaartjes", kind: "textarea" },
        { key: keyFor(page, "HighlightLabel"), label: "Accentblok: kleine badge" },
        { key: keyFor(page, "HighlightTitle"), label: "Accentblok: titel" },
        { key: keyFor(page, "HighlightText"), label: "Accentblok: tekst", kind: "textarea" },
      ],
    },
    {
      title: "Knoppen en contactbalk",
      description: "Pas de knoppen bovenaan en de gedeelde contactbalk onderaan aan.",
      fields: [
        { key: keyFor(page, "PrimaryCtaLabel"), label: "Eerste knop: tekst" },
        { key: keyFor(page, "PrimaryCtaHref"), label: "Eerste knop: link" },
        { key: keyFor(page, "SecondaryCtaLabel"), label: "Tweede knop: tekst" },
        { key: keyFor(page, "SecondaryCtaHref"), label: "Tweede knop: link" },
        { key: "pageSharedCtaEyebrow", label: "Contactbalk: kleine badge" },
        { key: "pageSharedCtaTitle", label: "Contactbalk: titel" },
        { key: "pageSharedCtaButton", label: "Contactbalk: knoptekst" },
      ],
    },
  ];

  if (page.kind === "camp") {
    groups[1] = {
      title: "Kampverhaal",
      description:
        "De zichtbare kampteksten: korte duiding, uitleg voor leden en uitleg voor ouders.",
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
        "Leg hier uit waarom Steak- en Burgerday bestaat en hoe bezoekers de scouts steunen.",
      fields: [
        { key: keyFor(page, "HighlightLabel"), label: "Kleine badge boven titel" },
        { key: keyFor(page, "HighlightTitle"), label: "Titel van het steunverhaal" },
        { key: keyFor(page, "HighlightText"), label: "Tekst van het steunverhaal", kind: "textarea" },
      ],
    };
  }

  if (page.kind === "camp") {
    groups.push({
      title: "Documenten en updates",
      description:
        "Voeg links toe naar kampboekje, medische fiche, bagagelijst en korte updates.",
      fields: [
        { key: keyFor(page, "Documents"), label: "Documentlinks", kind: "textarea" },
        { key: keyFor(page, "Updates"), label: "Praktische updates", kind: "textarea" },
      ],
    });
  }

  if (page.kind === "shop") {
    groups.push({
      title: "Producten",
      description: "Producten die als aparte kaartjes op de shop-pagina verschijnen.",
      fields: [
        { key: keyFor(page, "Products"), label: "Productenlijst", kind: "textarea" },
      ],
    });
  }

  if (page.kind === "links") {
    groups.push({
      title: "Linkpagina",
      description: "Links die per categorie gegroepeerd worden op de linkpagina.",
      fields: [
        { key: keyFor(page, "Items"), label: "Links per categorie", kind: "textarea" },
      ],
    });
  }

  if (page.kind === "rental") {
    groups.push({
      title: "Verhuurblokken",
      description:
        "Titels voor de onderdelen rond materiaal, prijzen en afspraken.",
      fields: [
        { key: keyFor(page, "MaterialsTitle"), label: "Titel voor materiaal" },
        { key: keyFor(page, "PricesTitle"), label: "Titel voor prijzen" },
      ],
    });
  }

  if (page.kind === "committee") {
    groups.push({
      title: "Oudercomite extra info",
      description:
        "Titels en ledenlijst voor de pagina van het oudercomite.",
      fields: [
        { key: keyFor(page, "WorkTitle"), label: "Titel: wat doen we?" },
        { key: keyFor(page, "JoinTitle"), label: "Titel: hoe aansluiten?" },
        { key: keyFor(page, "MembersTitle"), label: "Titel boven ledenlijst" },
        { key: keyFor(page, "Members"), label: "Ledenlijst", kind: "textarea" },
      ],
    });
  }

  if (page.bodyKey) {
    groups.push({
      title: "Grote vrije tekst",
      description: "Deze tekst behoudt witruimte, lege regels en nieuwe regels.",
      fields: [{ key: page.bodyKey, label: "Vrije tekst", kind: "textarea" }],
    });
  }

  if (["event", "order", "reservation", "shop", "committee", "rental"].includes(page.kind)) {
    groups.push({
      title: "Link naar inschrijving of aanvraag",
      description:
        "Gebruik hier een externe link, bijvoorbeeld Google Forms, Microsoft Forms of een mailadres. Er staat geen formulier op de site zelf.",
      fields: [
        { key: keyFor(page, "ExternalCtaTitle"), label: "Titel van de linkbalk" },
        { key: keyFor(page, "ExternalCtaText"), label: "Korte uitleg in de linkbalk", kind: "textarea" },
        { key: keyFor(page, "ExternalCtaButton"), label: "Tekst op de knop" },
        { key: keyFor(page, "ExternalCtaUrl"), label: "Externe link of e-mailadres" },
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
