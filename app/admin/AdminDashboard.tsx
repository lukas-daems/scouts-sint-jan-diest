"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  defaultSiteContent,
  type EditableSiteContent,
} from "../lib/site-content-defaults";
import { branchProfiles } from "../lib/branches";
import {
  galleryThemes,
  parseCustomGalleryThemes,
  parseImageListValue,
  slugifyGalleryLabel,
  stringifyCustomGalleryThemes,
  stringifyImageListValue,
  type CustomGalleryTheme,
  type GalleryTheme,
} from "../lib/gallery";
import {
  getSitePageAdminGroups,
  getSitePageImageKey,
  parseCards,
  parseDocuments,
  parseFacts,
  parseLines,
  parseLinks,
  parseProducts,
  sitePageGroups,
  sitePages,
  stringifyCards,
  stringifyDocuments,
  stringifyFacts,
  stringifyLines,
  stringifyLinks,
  stringifyProducts,
  type SitePageCard,
  type SitePageDocument,
  type SitePageFact,
  type SitePageLinkItem,
  type SitePageProduct,
} from "../lib/site-pages";
import { prepareImageForUpload } from "../lib/prepare-image-upload";
import {
  createProgramItem,
  parseProgramItems,
  stringifyProgramItems,
  type ProgramItem,
} from "../lib/program";
import {
  createFaqItem,
  parseFaqItems,
  stringifyFaqItems,
  type FAQItem,
} from "../lib/faq";

type SaveState = "idle" | "saving" | "saved" | "error";
type AdminSection =
  | "branding"
  | "homepage"
  | "takken"
  | "media"
  | "pages"
  | "navigation"
  | "footer"
  | "contact";

type FieldConfig = {
  key: keyof EditableSiteContent;
  label: string;
  kind?: "input" | "textarea";
  help?: string;
  placeholder?: string;
};

type AdminSession = {
  username: string;
  displayName: string;
  role: "superadmin" | "branch";
  branchSlug?: string;
};

type MediaLibraryItem = {
  key: string;
  url: string;
  size: number;
  uploaded: string;
  contentType?: string;
};

type AdminSetupHelpItem = {
  username: string;
  env: string;
  role: string;
};

type SiteContentAdminStatus = {
  source: "database" | "defaults";
  error?: string;
};

const sections: Array<{
  id: AdminSection;
  label: string;
  description: string;
}> = [
  {
    id: "branding",
    label: "Algemeen",
    description: "Logo, naam en branding",
  },
  {
    id: "homepage",
    label: "Homepage",
    description: "Hero, praktisch en kamp",
  },
  {
    id: "takken",
    label: "Takken",
    description: "Kapoenen, welpen en andere takken",
  },
  {
    id: "pages",
    label: "Pagina's",
    description: "Activiteiten, acties en infopagina's",
  },
  {
    id: "media",
    label: "Media",
    description: "Foto's en collages",
  },
  {
    id: "navigation",
    label: "Navigatie",
    description: "Menu-items en links",
  },
  {
    id: "footer",
    label: "Footer",
    description: "Voettekst en sociale links",
  },
  {
    id: "contact",
    label: "Contact",
    description: "Gegevens en footer",
  },
];

const homepageGroups: Array<{
  title: string;
  description: string;
  fields: FieldConfig[];
}> = [
  {
    title: "Bovenkant homepage",
    description: "De grote eerste indruk: badge, titel, knoppen, foto en vier kleine infokaartjes.",
    fields: [
      { key: "heroEyebrow", label: "Badge: eerste tekst" },
      { key: "heroOrgLabel", label: "Badge: tweede tekst" },
      { key: "heroTitleLineOne", label: "Grote titel: eerste regel" },
      { key: "heroTitleLineTwo", label: "Grote titel: tweede regel" },
      {
        key: "heroSubtitle",
        label: "Korte uitleg onder de titel",
        kind: "textarea",
        help: "Deze tekst staat direct onder de grote hero-titel.",
      },
      { key: "heroPrimaryCtaLabel", label: "Witte knop" },
      { key: "heroSecondaryCtaLabel", label: "Doorzichtige knop" },
      { key: "heroStatOneTitle", label: "Infokaartje 1: grote tekst" },
      { key: "heroStatOneLabel", label: "Infokaartje 1: kleine tekst" },
      { key: "heroStatTwoTitle", label: "Infokaartje 2: grote tekst" },
      { key: "heroStatTwoLabel", label: "Infokaartje 2: kleine tekst" },
      { key: "heroStatThreeTitle", label: "Infokaartje 3: grote tekst" },
      { key: "heroStatThreeLabel", label: "Infokaartje 3: kleine tekst" },
      { key: "heroStatFourTitle", label: "Infokaartje 4: grote tekst" },
      { key: "heroStatFourLabel", label: "Infokaartje 4: kleine tekst" },
    ],
  },
  {
    title: "Takkenblok op homepage",
    description: "De compacte blok met de vijf takken en de knop naar de takkenpagina.",
    fields: [
      { key: "branchesHomeTitle", label: "Titel" },
      { key: "branchesHomeSubtitle", label: "Intro tekst", kind: "textarea" },
      { key: "branchesHomeCtaLabel", label: "Knop onder de takken" },
    ],
  },
  {
    title: "Activiteitenblok op homepage",
    description: "De titel, intro, grote zomerkampkaart en de kleine activiteitkaartjes.",
    fields: [
      { key: "activitiesTitle", label: "Titel" },
      { key: "activitiesSubtitle", label: "Intro tekst", kind: "textarea" },
      { key: "activitiesFeaturedBadge", label: "Zomerkampkaart: badge" },
      { key: "activitiesFeaturedTitle", label: "Zomerkampkaart: titel" },
      { key: "activitiesFeaturedText", label: "Zomerkampkaart: tekst", kind: "textarea" },
      { key: "activitiesFeaturedMiniTitle", label: "Fotolabel in zomerkampkaart" },
      { key: "activitiesFeaturedMiniText", label: "Korte tekst bij fotolabel", kind: "textarea" },
      { key: "activitiesFeaturedCtaLabel", label: "Knop in zomerkampkaart" },
      { key: "activitiesMoreTitle", label: "CTA-balk onder activiteiten: titel" },
      { key: "activitiesMoreText", label: "CTA-balk onder activiteiten: tekst", kind: "textarea" },
      { key: "activitiesMoreCtaLabel", label: "CTA-balk onder activiteiten: knop" },
    ],
  },
  {
    title: "Waarom scouts?",
    description: "De overtuigingssectie voor ouders op de homepage.",
    fields: [
      { key: "whyJoinBadge", label: "Badge" },
      { key: "whyJoinTitle", label: "Titel" },
      { key: "whyJoinText", label: "Intro tekst", kind: "textarea" },
      {
        key: "whyJoinBullets",
        label: "Voordelenlijst",
        kind: "textarea",
        help: "Zet elk voordeel op een aparte regel.",
      },
    ],
  },
  {
    title: "Praktische info",
    description: "Info die ouders snel moeten kunnen vinden.",
    fields: [
      { key: "practicalTitle", label: "Titel" },
      { key: "practicalSubtitle", label: "Intro tekst", kind: "textarea" },
      { key: "practicalActivityMoment", label: "Activiteitenmoment" },
      { key: "practicalAddress", label: "Lokaal of adres" },
      { key: "registrationLink", label: "Inschrijvingslink" },
      { key: "practicalCardOneTitle", label: "Info kaart 1 titel" },
      { key: "practicalCardOneText", label: "Info kaart 1 hoofdtekst" },
      { key: "practicalCardOneNote", label: "Info kaart 1 label" },
      { key: "practicalCardTwoTitle", label: "Info kaart 2 titel" },
      { key: "practicalCardTwoText", label: "Info kaart 2 hoofdtekst" },
      { key: "practicalCardTwoNote", label: "Info kaart 2 label" },
      { key: "practicalCardThreeTitle", label: "Info kaart 3 titel" },
      { key: "practicalCardThreeText", label: "Info kaart 3 hoofdtekst" },
      { key: "practicalCardThreeNote", label: "Info kaart 3 label" },
      { key: "practicalCardFourTitle", label: "Info kaart 4 titel" },
      { key: "practicalCardFourText", label: "Info kaart 4 hoofdtekst" },
      { key: "practicalCardFourNote", label: "Info kaart 4 label" },
    ],
  },
  {
    title: "Kamp",
    description: "Teksten voor de kampsectie.",
    fields: [
      { key: "campBadge", label: "Badge" },
      { key: "campTitle", label: "Titel" },
      { key: "campSubtitle", label: "Kamp intro", kind: "textarea" },
      { key: "campHomepageNote", label: "Korte nota op homepage", kind: "textarea" },
      { key: "campWhat", label: "Wat is kamp?", kind: "textarea" },
      { key: "campForParents", label: "Voor ouders", kind: "textarea" },
      { key: "campForNewMembers", label: "Voor nieuwe leden", kind: "textarea" },
    ],
  },
  {
    title: "Foto's, inschrijven en FAQ",
    description: "Overige homepageblokken.",
    fields: [
      { key: "galleryTitle", label: "Fotogalerij titel" },
      { key: "gallerySubtitle", label: "Fotogalerij intro", kind: "textarea" },
      { key: "joinTitle", label: "Inschrijven titel" },
      { key: "joinHeading", label: "Inschrijven hoofdtitel" },
      { key: "joinSubtitle", label: "Inschrijven intro", kind: "textarea" },
      { key: "joinStepOneLabel", label: "Stap 1" },
      { key: "joinStepTwoLabel", label: "Stap 2" },
      { key: "joinStepThreeLabel", label: "Stap 3" },
      { key: "joinStepFourLabel", label: "Stap 4" },
      { key: "joinCtaLabel", label: "Inschrijfknop" },
      { key: "joinSecondaryCtaLabel", label: "Tweede knop" },
      { key: "faqBadge", label: "FAQ badge" },
      { key: "faqTitle", label: "FAQ titel" },
      { key: "faqSubtitle", label: "FAQ intro", kind: "textarea" },
      { key: "faqCtaLabel", label: "FAQ knop" },
    ],
  },
];

const homepageEditorItems: Array<{
  id: string;
  title: string;
  description: string;
  group?: (typeof homepageGroups)[number];
  type: "fields" | "faq";
}> = [
  ...homepageGroups.map((group, index) => ({
    id: `homepage-${index}`,
    title: group.title,
    description: group.description,
    group,
    type: "fields" as const,
  })),
  {
    id: "homepage-faq-list",
    title: "FAQ-vragen",
    description: "Beheer de losse vragen en antwoorden die in de FAQ verschijnen.",
    type: "faq",
  },
];

const contactFields: FieldConfig[] = [
  { key: "contactBadge", label: "Badge" },
  { key: "contactTitle", label: "Titel" },
  { key: "contactSubtitle", label: "Intro tekst", kind: "textarea" },
  { key: "contactLocation", label: "Locatie" },
  { key: "contactEmail", label: "Hoofd e-mail" },
  { key: "contactPhone", label: "Hoofdtelefoon" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "contactExternalTitle", label: "Externe link titel" },
  { key: "contactExternalText", label: "Externe link uitleg", kind: "textarea" },
  { key: "contactExternalButton", label: "Externe link knoptekst" },
  { key: "contactExternalUrl", label: "Externe formulierlink" },
  { key: "contactMailCta", label: "Mailknop" },
  { key: "contactNoticeText", label: "Infotekst onder contact-CTA", kind: "textarea" },
  { key: "contactTrustText", label: "Vertrouwenszin", kind: "textarea" },
];

const footerFields: FieldConfig[] = [
  { key: "footerDescription", label: "Tekst onder groepsnaam", kind: "textarea" },
  { key: "instagramUrl", label: "Instagramlink" },
  { key: "facebookUrl", label: "Facebooklink" },
  { key: "footerNotice", label: "Footer melding", kind: "textarea" },
  { key: "footerCopyright", label: "Copyrightlijn" },
];

const navigationFields: FieldConfig[] = [
  { key: "navHomeLabel", label: "Label Home" },
  { key: "navBranchesLabel", label: "Label Takken" },
  { key: "navActivitiesLabel", label: "Label Activiteiten" },
  { key: "navSupportLabel", label: "Label Steun ons" },
  { key: "navPracticalLabel", label: "Label Praktisch" },
  { key: "navMoreLabel", label: "Label Meer" },
  { key: "navCtaLabel", label: "CTA-knop rechts" },
];

const mediaFields: Array<{
  key: keyof EditableSiteContent;
  label: string;
  description: string;
}> = [
  {
    key: "heroImageUrl",
    label: "Hero foto",
    description: "Grote sfeerfoto bovenaan de homepage.",
  },
  {
    key: "campImageUrl",
    label: "Kamp foto",
    description: "Foto in de kampsectie.",
  },
];

const pageAdminDescriptions: Record<string, string> = {
  activiteiten:
    "Overzicht van wekelijkse werking, kamp, evenementen en steunacties.",
  zomerkamp: "Kampverhaal, documenten, updates en kampgerichte CTA's.",
  dropping: "Evenementpagina met praktische info en externe inschrijflink.",
  ontbijtmanden: "Verkoopactie met bestellink en uitleg rond steun.",
  "steak-en-burgerday":
    "Eetmoment en steunactie met steunverhaal en reservatielink.",
  shop: "Productcatalogus en externe aanvraaglink voor shopmateriaal.",
  oudercomite:
    "Warme infopagina over het oudercomite, werking, ledenlijst en contact.",
  verhuur: "Duidelijke pagina over lokalen, materiaal, prijzen en verhuurcontact.",
  "oud-leiding": "Rustige tekstpagina met ruimte voor latere info en contact.",
  links: "Beheerbare linkpagina met categorieen en nuttige verwijzingen.",
};

const pageEditorItems: Array<{
  id: string;
  title: string;
  description: string;
  href: string;
  adminGroups: ReturnType<typeof getSitePageAdminGroups>;
  imageKey: keyof EditableSiteContent;
}> = sitePages.map((page) => ({
  id: page.slug,
  title: page.navLabel,
  description:
    pageAdminDescriptions[page.slug] ||
    `${page.navLabel} pagina beheren: tekst, info, knoppen en beeld.`,
  href: `/${page.slug}`,
  adminGroups: getSitePageAdminGroups(page),
  imageKey: getSitePageImageKey(page),
}));

function getPreviewPath(
  section: AdminSection,
  branchSlug: string,
  version: number
) {
  const marker = `adminPreview=${version}`;

  if (section === "takken") {
    return `/takken/${branchSlug}?${marker}`;
  }

  if (section === "media") {
    return `/fotos?${marker}`;
  }

  if (section === "pages") {
    return `/activiteiten?${marker}`;
  }

  if (section === "navigation") {
    return `/?${marker}#home`;
  }

  if (section === "contact") {
    return `/?${marker}#contact`;
  }

  return `/?${marker}#home`;
}

export default function AdminDashboard() {
  const [configured, setConfigured] = useState(true);
  const [missingConfig, setMissingConfig] = useState<string[]>([]);
  const [setupHelp, setSetupHelp] = useState<AdminSetupHelpItem[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("groepsleiding");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<EditableSiteContent>(defaultSiteContent);
  const [message, setMessage] = useState("");
  const [contentStatus, setContentStatus] =
    useState<SiteContentAdminStatus | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] =
    useState<AdminSection>("homepage");
  const [activeBranchSlug, setActiveBranchSlug] = useState(
    branchProfiles[0].slug
  );
  const [activeHomepageItemId, setActiveHomepageItemId] = useState(
    homepageEditorItems[0].id
  );
  const [activePageItemId, setActivePageItemId] = useState(pageEditorItems[0].id);
  const [previewVersion, setPreviewVersion] = useState(1);
  const [mediaLibrary, setMediaLibrary] = useState<MediaLibraryItem[]>([]);
  const [mediaLibraryLoading, setMediaLibraryLoading] = useState(false);

  const isSuperAdmin = adminSession?.role === "superadmin";
  const allowedBranches = useMemo(() => {
    if (!adminSession || isSuperAdmin) {
      return branchProfiles;
    }

    return branchProfiles.filter(
      (branch) => branch.slug === adminSession.branchSlug
    );
  }, [adminSession, isSuperAdmin]);
  const visibleSections = useMemo(
    () =>
      !adminSession || isSuperAdmin
        ? sections
        : sections.filter((section) => section.id === "takken"),
    [adminSession, isSuperAdmin]
  );
  const activeSectionId = visibleSections.some(
    (section) => section.id === activeSection
  )
    ? activeSection
    : visibleSections[0]?.id ?? "homepage";
  const activeBranch = useMemo(
    () =>
      allowedBranches.find((branch) => branch.slug === activeBranchSlug) ??
      allowedBranches[0] ??
      branchProfiles[0],
    [activeBranchSlug, allowedBranches]
  );
  const activePageItem =
    pageEditorItems.find((item) => item.id === activePageItemId) ??
    pageEditorItems[0];
  const activeHomepageItem =
    homepageEditorItems.find((item) => item.id === activeHomepageItemId) ??
    homepageEditorItems[0];
  const customGalleryThemes = parseCustomGalleryThemes(content.galleryCustomThemes);

  const previewMarker = `adminPreview=${previewVersion}`;
  const previewPath =
    activeSectionId === "pages"
      ? isSuperAdmin
        ? `${activePageItem.href}?${previewMarker}`
        : `/takken/${activeBranch.slug}?${previewMarker}`
      : getPreviewPath(activeSectionId, activeBranch.slug, previewVersion);
  const activeSectionInfo =
    visibleSections.find((section) => section.id === activeSectionId) ??
    visibleSections[0] ??
    sections[0];

  useEffect(() => {
    async function loadSession() {
      const response = await fetch("/api/admin/session");
      const session = (await response.json()) as {
        authenticated: boolean;
        configured: boolean;
        missing?: string[];
        setupHelp?: AdminSetupHelpItem[];
        session: AdminSession | null;
      };

      setConfigured(session.configured);
      setMissingConfig(session.missing ?? []);
      setSetupHelp(session.setupHelp ?? []);
      setAuthenticated(session.authenticated);
      setAdminSession(session.session);
      if (session.session?.role === "branch" && session.session.branchSlug) {
        setActiveSection("takken");
        setActiveBranchSlug(session.session.branchSlug);
      }
      setLoading(false);

      if (session.authenticated) {
        await loadContent();
      }
    }

    loadSession().catch(() => {
      setMessage("Kon de beheerstatus niet laden.");
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (authenticated && activeSectionId === "media") {
      void loadMediaLibrary();
    }
  }, [authenticated, activeSectionId]);

  async function loadContent() {
    const response = await fetch("/api/admin/content");
    if (!response.ok) {
      setMessage("Kon de site-inhoud niet laden.");
      return;
    }

    const payload = (await response.json()) as {
      content: EditableSiteContent;
      status?: SiteContentAdminStatus;
    };
    setContent(payload.content);
    setContentStatus(payload.status ?? null);
  }

  async function loadMediaLibrary() {
    setMediaLibraryLoading(true);
    const response = await fetch("/api/admin/media", { cache: "no-store" });
    setMediaLibraryLoading(false);

    if (!response.ok) {
      setMessage("Kon de mediabibliotheek niet laden.");
      return;
    }

    const payload = (await response.json()) as { media: MediaLibraryItem[] };
    setMediaLibrary(payload.media ?? []);
  }

  function extractMediaKey(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      return "";
    }

    try {
      const pathname = trimmed.startsWith("http")
        ? new URL(trimmed).pathname
        : trimmed;
      return pathname
        .replace(/^\/api\/media\//, "")
        .replace(/^api\/media\//, "")
        .replace(/^\/+/, "");
    } catch {
      return "";
    }
  }

  function getUsedMediaKeys() {
    return new Set(getMediaUsageMap().keys());
  }

  function addMediaUsage(
    usageMap: Map<string, string[]>,
    key: string,
    label: string
  ) {
    if (!key) {
      return;
    }

    const labels = usageMap.get(key) ?? [];
    if (!labels.includes(label)) {
      labels.push(label);
    }
    usageMap.set(key, labels);
  }

  function getMediaUsageLabel(contentKey: keyof EditableSiteContent) {
    if (contentKey === "siteLogoUrl") {
      return "Logo in navigatie en footer";
    }
    if (contentKey === "heroImageUrl") {
      return "Homepage hero-foto";
    }
    if (contentKey === "campImageUrl") {
      return "Homepage kampsectie";
    }
    if (contentKey === "contactImageUrl") {
      return "Contactblok";
    }

    const galleryTheme = galleryThemes.find(
      (theme) =>
        theme.coverKey === contentKey || theme.collageKey === contentKey
    );
    if (galleryTheme) {
      return galleryTheme.coverKey === contentKey
        ? `Hoofdfoto sfeerbeeld ${galleryTheme.label}`
        : `Collage ${galleryTheme.label}`;
    }

    const branch = branchProfiles.find(
      (item) =>
        item.logoKey === contentKey ||
        item.contentKeys.imageUrl === contentKey ||
        item.contentKeys.leaderPhotoUrl === contentKey
    );
    if (branch) {
      if (branch.logoKey === contentKey) {
        return `Logo tak ${branch.name}`;
      }
      if (branch.contentKeys.leaderPhotoUrl === contentKey) {
        return `Leidingsfoto ${branch.name}`;
      }
      return `Sfeerfoto tak ${branch.name}`;
    }

    const page = pageEditorItems.find((item) => item.imageKey === contentKey);
    if (page) {
      return `Hoofdbeeld pagina ${page.title}`;
    }

    return String(contentKey);
  }

  function getMediaUsageMap() {
    const usageMap = new Map<string, string[]>();
    const mediaPattern = /(?:\/api\/media\/)?(uploads\/[^"'\s)\\\]]+)/g;

    for (const [contentKey, value] of Object.entries(content) as Array<
      [keyof EditableSiteContent, string]
    >) {
      if (typeof value !== "string") {
        continue;
      }

      for (const match of value.matchAll(mediaPattern)) {
        const key = extractMediaKey(match[1] ?? "");
        if (key) {
          addMediaUsage(usageMap, key, getMediaUsageLabel(contentKey));
        }
      }
    }

    return usageMap;
  }

  async function deleteMediaItem(item: MediaLibraryItem) {
    const response = await fetch("/api/admin/media", {
      body: JSON.stringify({ key: item.key }),
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setMessage(payload.error ?? "Bestand verwijderen is niet gelukt.");
      return false;
    }

    setMediaLibrary((current) =>
      current.filter((mediaItem) => mediaItem.key !== item.key)
    );
    return true;
  }

  async function cleanupUnusedMedia() {
    const usedKeys = getUsedMediaKeys();
    const unusedMedia = mediaLibrary.filter((item) => !usedKeys.has(item.key));

    if (unusedMedia.length === 0) {
      setMessage("Er zijn geen ongebruikte uploads om op te ruimen.");
      return;
    }

    let deletedCount = 0;
    for (const item of unusedMedia) {
      if (await deleteMediaItem(item)) {
        deletedCount += 1;
      }
    }

    setMessage(
      `${deletedCount} ongebruikte upload${deletedCount === 1 ? "" : "s"} verwijderd.`
    );
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/admin/login", {
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setMessage(payload.error ?? "Aanmelden is niet gelukt.");
      return;
    }

    const payload = (await response.json()) as { session: AdminSession };
    setAuthenticated(true);
    setAdminSession(payload.session);
    if (payload.session.role === "branch" && payload.session.branchSlug) {
      setActiveSection("takken");
      setActiveBranchSlug(payload.session.branchSlug);
    }
    setPassword("");
    await loadContent();
  }

  async function handleSave(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setSaveState("saving");
    setMessage("");

    const response = await fetch("/api/admin/content", {
      body: JSON.stringify({ content }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setSaveState("error");
      setMessage(payload.error ?? "Opslaan is niet gelukt. Ben je nog aangemeld?");
      return;
    }

    const payload = (await response.json()) as { content: EditableSiteContent };
    setContent(payload.content);
    setSaveState("saved");
    setPreviewVersion((current) => current + 1);
    setMessage("Opgeslagen. Gebruik 'Voorbeeld bekijken' om de site te openen.");
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setAdminSession(null);
    setUsername("groepsleiding");
    setMessage("Je bent afgemeld.");
  }

  async function handleCancelChanges() {
    await loadContent();
    setSaveState("idle");
    setMessage("Niet-opgeslagen wijzigingen zijn geannuleerd.");
  }

  function updateField(key: keyof EditableSiteContent, value: string) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  function clearField(key: keyof EditableSiteContent, label: string) {
    updateField(key, "");
    setMessage(`${label} verwijderd. Klik op opslaan om dit zichtbaar te maken.`);
  }

  async function uploadPreparedFile(file: File, slot: string, logo = false) {
    const prepared = await prepareImageForUpload(file, { logo });
    const formData = new FormData();
    formData.append("file", prepared.file);
    formData.append("slot", slot);

    const response = await fetch("/api/admin/media", {
      body: formData,
      method: "POST",
    });

    if (!response.ok) {
      if (response.status === 413) {
        throw new Error(
          "Dit bestand blijft te groot, zelfs na automatisch verkleinen. Probeer een kleinere export of een foto met minder pixels."
        );
      }

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      throw new Error(payload.error ?? "Uploaden is niet gelukt.");
    }

    const payload = (await response.json()) as { url: string };

    return {
      url: payload.url,
      optimized: prepared.optimized,
    };
  }

  async function uploadMedia(
    key: keyof EditableSiteContent,
    event: ChangeEvent<HTMLInputElement>,
    logo = false
  ) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingKey(key);
    setMessage("");

    let uploaded;
    try {
      uploaded = await uploadPreparedFile(file, String(key), logo);
    } catch (error) {
      setUploadingKey(null);
      event.target.value = "";
      setMessage(
        error instanceof Error
          ? error.message
          : "Deze afbeelding kon niet voorbereid worden voor upload."
      );
      return;
    }

    setUploadingKey(null);
    event.target.value = "";
    updateField(key, uploaded.url);
    void loadMediaLibrary();
    setMessage(
      uploaded.optimized
        ? "Upload gelukt. De afbeelding werd automatisch kleiner gemaakt. Klik op opslaan."
        : "Upload gelukt. Klik op opslaan om dit zichtbaar te maken."
    );
  }

  async function uploadGalleryImages(
    theme: GalleryTheme,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const keys = getGalleryContentKeys(theme);
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    if (!keys) {
      event.target.value = "";
      return;
    }

    setUploadingKey(keys.collageKey);
    setMessage("");

    const uploadedUrls: string[] = [];
    let optimizedCount = 0;

    for (const file of files) {
      try {
        const uploaded = await uploadPreparedFile(file, `collage-${theme.slug}`);
        uploadedUrls.push(uploaded.url);
        optimizedCount += uploaded.optimized ? 1 : 0;
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Een van de foto's kon niet voorbereid worden voor upload."
        );
      }
    }

    setUploadingKey(null);
    event.target.value = "";

    if (uploadedUrls.length === 0) {
      setMessage("Uploaden is niet gelukt.");
      return;
    }

    setContent((current) => {
      const existing = parseImageListValue(current[keys.collageKey]);
      const nextImages = [...existing, ...uploadedUrls];

      return {
        ...current,
        [keys.collageKey]: stringifyImageListValue(nextImages),
        [keys.coverKey]: current[keys.coverKey] || uploadedUrls[0],
      };
    });
    setMessage(
      `${uploadedUrls.length} foto${uploadedUrls.length === 1 ? "" : "'s"} toegevoegd aan ${theme.label}.${optimizedCount > 0 ? ` ${optimizedCount} foto${optimizedCount === 1 ? "" : "'s"} automatisch verkleind.` : ""} Klik op opslaan.`
    );
    void loadMediaLibrary();
  }

  async function replaceGalleryImage(
    theme: GalleryTheme,
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const keys = getGalleryContentKeys(theme);
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!keys) {
      event.target.value = "";
      return;
    }

    setUploadingKey(keys.collageKey);
    setMessage("");

    let uploaded;
    try {
      uploaded = await uploadPreparedFile(file, `collage-${theme.slug}`);
    } catch (error) {
      setUploadingKey(null);
      event.target.value = "";
      setMessage(
        error instanceof Error
          ? error.message
          : "Deze foto kon niet voorbereid worden voor upload."
      );
      return;
    }

    setUploadingKey(null);
    event.target.value = "";
    setContent((current) => {
      const images = parseImageListValue(current[keys.collageKey]);
      images[index] = uploaded.url;

      return {
        ...current,
        [keys.collageKey]: stringifyImageListValue(images),
      };
    });
    setMessage(`Foto vervangen in ${theme.label}. Klik op opslaan.`);
    void loadMediaLibrary();
  }

  function removeGalleryImage(theme: GalleryTheme, index: number) {
    const keys = getGalleryContentKeys(theme);
    if (!keys) {
      return;
    }

    setContent((current) => {
      const images = parseImageListValue(current[keys.collageKey]);
      const removedImage = images[index];
      const nextImages = images.filter((_, itemIndex) => itemIndex !== index);

      return {
        ...current,
        [keys.collageKey]: stringifyImageListValue(nextImages),
        [keys.coverKey]:
          current[keys.coverKey] === removedImage
            ? nextImages[0] || ""
            : current[keys.coverKey],
      };
    });
    setMessage(`Foto verwijderd uit ${theme.label}. Klik op opslaan.`);
  }

  function moveGalleryImage(theme: GalleryTheme, index: number, direction: -1 | 1) {
    const keys = getGalleryContentKeys(theme);
    if (!keys) {
      return;
    }

    setContent((current) => {
      const images = parseImageListValue(current[keys.collageKey]);
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= images.length) {
        return current;
      }

      [images[index], images[targetIndex]] = [images[targetIndex], images[index]];

      return {
        ...current,
        [keys.collageKey]: stringifyImageListValue(images),
      };
    });
    setMessage(`Volgorde aangepast in ${theme.label}. Klik op opslaan.`);
  }

  function getGalleryContentKeys(theme: GalleryTheme) {
    if (!theme.coverKey || !theme.collageKey) {
      setMessage("Deze collage gebruikt geen vaste homepagevelden.");
      return null;
    }

    return {
      coverKey: theme.coverKey,
      collageKey: theme.collageKey,
    };
  }

  function updateCustomGalleryThemes(items: CustomGalleryTheme[]) {
    updateField("galleryCustomThemes", stringifyCustomGalleryThemes(items));
  }

  function getUniqueCustomGallerySlug(
    label: string,
    items: CustomGalleryTheme[],
    currentId?: string
  ) {
    const baseSlug = slugifyGalleryLabel(label, items.length);
    let slug = baseSlug;
    let counter = 2;

    while (
      items.some((item) => item.id !== currentId && item.slug === slug)
    ) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    return slug;
  }

  function addCustomGalleryTheme() {
    const items = parseCustomGalleryThemes(content.galleryCustomThemes);
    const label = `Nieuwe collage ${items.length + 1}`;
    const nextItem: CustomGalleryTheme = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `custom-${Date.now()}`,
      slug: getUniqueCustomGallerySlug(label, items),
      label,
      alt: `Sfeerbeelden van ${label}`,
      coverUrl: "",
      images: [],
    };

    updateCustomGalleryThemes([...items, nextItem]);
    setMessage("Nieuwe collage toegevoegd. Pas de naam en foto's aan en klik op opslaan.");
  }

  function updateCustomGalleryTheme(
    id: string,
    field: "label" | "alt",
    value: string
  ) {
    const items = parseCustomGalleryThemes(content.galleryCustomThemes);
    const nextItems = items.map((item) => {
      if (item.id !== id) {
        return item;
      }

      if (field === "label") {
        return {
          ...item,
          label: value,
          slug: getUniqueCustomGallerySlug(value, items, id),
          alt:
            !item.alt || item.alt.startsWith("Sfeerbeelden van ")
              ? `Sfeerbeelden van ${value}`
              : item.alt,
        };
      }

      return { ...item, [field]: value };
    });

    updateCustomGalleryThemes(nextItems);
  }

  function removeCustomGalleryTheme(id: string) {
    const items = parseCustomGalleryThemes(content.galleryCustomThemes);
    updateCustomGalleryThemes(items.filter((item) => item.id !== id));
    setMessage("Collage verwijderd. Klik op opslaan om dit zichtbaar te maken.");
  }

  async function uploadCustomGalleryCover(
    theme: CustomGalleryTheme,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingKey(`custom-cover-${theme.id}`);
    setMessage("");

    let uploaded;
    try {
      uploaded = await uploadPreparedFile(file, `custom-collage-${theme.slug}`);
    } catch (error) {
      setUploadingKey(null);
      event.target.value = "";
      setMessage(
        error instanceof Error
          ? error.message
          : "Deze hoofdfoto kon niet voorbereid worden voor upload."
      );
      return;
    }

    setUploadingKey(null);
    event.target.value = "";
    const items = parseCustomGalleryThemes(content.galleryCustomThemes);
    updateCustomGalleryThemes(
      items.map((item) =>
        item.id === theme.id ? { ...item, coverUrl: uploaded.url } : item
      )
    );
    setMessage(
      uploaded.optimized
        ? "Hoofdfoto toegevoegd en automatisch kleiner gemaakt. Klik op opslaan."
        : "Hoofdfoto toegevoegd. Klik op opslaan."
    );
    void loadMediaLibrary();
  }

  async function uploadCustomGalleryImages(
    theme: CustomGalleryTheme,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    setUploadingKey(`custom-images-${theme.id}`);
    setMessage("");

    const uploadedUrls: string[] = [];
    let optimizedCount = 0;

    for (const file of files) {
      try {
        const uploaded = await uploadPreparedFile(file, `custom-collage-${theme.slug}`);
        uploadedUrls.push(uploaded.url);
        optimizedCount += uploaded.optimized ? 1 : 0;
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Een van de foto's kon niet voorbereid worden voor upload."
        );
      }
    }

    setUploadingKey(null);
    event.target.value = "";

    if (uploadedUrls.length === 0) {
      setMessage("Uploaden is niet gelukt.");
      return;
    }

    const items = parseCustomGalleryThemes(content.galleryCustomThemes);
    updateCustomGalleryThemes(
      items.map((item) =>
        item.id === theme.id
          ? {
              ...item,
              coverUrl: item.coverUrl || uploadedUrls[0],
              images: [...item.images, ...uploadedUrls],
            }
          : item
      )
    );
    setMessage(
      `${uploadedUrls.length} foto${uploadedUrls.length === 1 ? "" : "'s"} toegevoegd.${optimizedCount > 0 ? ` ${optimizedCount} automatisch verkleind.` : ""} Klik op opslaan.`
    );
    void loadMediaLibrary();
  }

  async function replaceCustomGalleryImage(
    theme: CustomGalleryTheme,
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingKey(`custom-replace-${theme.id}-${index}`);
    setMessage("");

    let uploaded;
    try {
      uploaded = await uploadPreparedFile(file, `custom-collage-${theme.slug}`);
    } catch (error) {
      setUploadingKey(null);
      event.target.value = "";
      setMessage(
        error instanceof Error
          ? error.message
          : "Deze foto kon niet voorbereid worden voor upload."
      );
      return;
    }

    setUploadingKey(null);
    event.target.value = "";
    const items = parseCustomGalleryThemes(content.galleryCustomThemes);
    updateCustomGalleryThemes(
      items.map((item) => {
        if (item.id !== theme.id) {
          return item;
        }

        const images = [...item.images];
        images[index] = uploaded.url;

        return { ...item, images };
      })
    );
    setMessage("Foto vervangen. Klik op opslaan.");
    void loadMediaLibrary();
  }

  function removeCustomGalleryImage(theme: CustomGalleryTheme, index: number) {
    const items = parseCustomGalleryThemes(content.galleryCustomThemes);
    updateCustomGalleryThemes(
      items.map((item) => {
        if (item.id !== theme.id) {
          return item;
        }

        const removedImage = item.images[index];
        const images = item.images.filter((_, itemIndex) => itemIndex !== index);

        return {
          ...item,
          images,
          coverUrl: item.coverUrl === removedImage ? images[0] || "" : item.coverUrl,
        };
      })
    );
    setMessage("Foto verwijderd. Klik op opslaan.");
  }

  function moveCustomGalleryImage(
    theme: CustomGalleryTheme,
    index: number,
    direction: -1 | 1
  ) {
    const items = parseCustomGalleryThemes(content.galleryCustomThemes);
    updateCustomGalleryThemes(
      items.map((item) => {
        if (item.id !== theme.id) {
          return item;
        }

        const images = [...item.images];
        const targetIndex = index + direction;

        if (targetIndex < 0 || targetIndex >= images.length) {
          return item;
        }

        [images[index], images[targetIndex]] = [images[targetIndex], images[index]];

        return { ...item, images };
      })
    );
    setMessage("Volgorde aangepast. Klik op opslaan.");
  }

  function stopTextKeyPropagation(
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    event.stopPropagation();
  }

  function renderField(field: FieldConfig) {
    return (
      <label
        className={`grid gap-2 text-sm font-semibold text-slate-700 ${
          field.kind === "textarea" ? "md:col-span-2" : ""
        }`}
        key={field.key}
      >
        {field.label}
        {field.help ? (
          <span className="-mt-1 text-xs font-medium leading-5 text-slate-500">
            {field.help}
          </span>
        ) : null}
        {field.kind === "textarea" ? (
          <textarea
            className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
            onKeyDown={stopTextKeyPropagation}
            onChange={(event) => updateField(field.key, event.target.value)}
            placeholder={field.placeholder}
            value={content[field.key]}
          />
        ) : (
          <input
            className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
            onKeyDown={stopTextKeyPropagation}
            onChange={(event) => updateField(field.key, event.target.value)}
            placeholder={field.placeholder}
            value={content[field.key]}
          />
        )}
      </label>
    );
  }

  function updateCardsField(
    key: keyof EditableSiteContent,
    index: number,
    field: keyof SitePageCard,
    value: string
  ) {
    const items = parseCards(content[key]);
    items[index] = { ...items[index], [field]: value };
    updateField(key, stringifyCards(items));
  }

  function addCardField(key: keyof EditableSiteContent) {
    updateField(
      key,
      stringifyCards([...parseCards(content[key]), { title: "", text: "" }])
    );
  }

  function removeCardField(key: keyof EditableSiteContent, index: number) {
    updateField(
      key,
      stringifyCards(parseCards(content[key]).filter((_, itemIndex) => itemIndex !== index))
    );
  }

  function renderCardsManager(field: FieldConfig) {
    const items = parseCards(content[field.key]);

    return (
      <section
        className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2"
        key={field.key}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h5 className="text-lg font-black text-slate-950">{field.label}</h5>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Dit zijn de witte tekstblokken op de pagina. Elk blok heeft een
              titel en korte uitleg. Lege blokken verschijnen niet.
            </p>
          </div>
          <button
            className="rounded-full bg-[#103001] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
            onClick={() => addCardField(field.key)}
            type="button"
          >
            Tekstblok toevoegen
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-[1fr_1.4fr_auto]"
                key={`${field.key}-card-${index}`}
              >
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Titel van dit blok
                  <input
                    className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    onChange={(event) =>
                      updateCardsField(field.key, index, "title", event.target.value)
                    }
                    onKeyDown={stopTextKeyPropagation}
                    value={item.title}
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Tekst in dit blok
                  <textarea
                    className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    onChange={(event) =>
                      updateCardsField(field.key, index, "text", event.target.value)
                    }
                    onKeyDown={stopTextKeyPropagation}
                    value={item.text}
                  />
                </label>
                <button
                  className="self-end rounded-full border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
                  onClick={() => removeCardField(field.key, index)}
                  type="button"
                >
                  Verwijder blok
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#fbfdf9] p-4 text-sm text-slate-500">
              Nog geen tekstblokken toegevoegd.
            </div>
          )}
        </div>
      </section>
    );
  }

  function updateFactsField(
    key: keyof EditableSiteContent,
    index: number,
    field: keyof SitePageFact,
    value: string
  ) {
    const items = parseFacts(content[key]);
    items[index] = { ...items[index], [field]: value };
    updateField(key, stringifyFacts(items));
  }

  function renderFactsManager(field: FieldConfig) {
    const items = parseFacts(content[field.key]);

    return (
      <section
        className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2"
        key={field.key}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h5 className="text-lg font-black text-slate-950">{field.label}</h5>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Dit zijn kleine infokaartjes, bijvoorbeeld datum, prijs, locatie
              of leeftijd. De kleine nota is optioneel.
            </p>
          </div>
          <button
            className="rounded-full bg-[#103001] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
            onClick={() =>
              updateField(
                field.key,
                stringifyFacts([
                  ...items,
                  { label: "", value: "", note: "" },
                ])
              )
            }
            type="button"
          >
            Infokaart toevoegen
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-[1fr_1fr_1fr_auto]"
                key={`${field.key}-fact-${index}`}
              >
                {(["label", "value", "note"] as Array<keyof SitePageFact>).map(
                  (itemField) => (
                    <label
                      className="grid gap-2 text-sm font-semibold text-slate-700"
                      key={itemField}
                    >
                      {itemField === "label"
                        ? "Kleine titel"
                        : itemField === "value"
                          ? "Belangrijkste tekst"
                          : "Extra uitleg"}
                      <input
                        className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                        onChange={(event) =>
                          updateFactsField(
                            field.key,
                            index,
                            itemField,
                            event.target.value
                          )
                        }
                        onKeyDown={stopTextKeyPropagation}
                        value={item[itemField] ?? ""}
                      />
                    </label>
                  )
                )}
                <button
                  className="self-end rounded-full border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
                  onClick={() =>
                    updateField(
                      field.key,
                      stringifyFacts(
                        items.filter((_, itemIndex) => itemIndex !== index)
                      )
                    )
                  }
                  type="button"
                >
                  Verwijder kaart
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#fbfdf9] p-4 text-sm text-slate-500">
              Nog geen infokaarten toegevoegd.
            </div>
          )}
        </div>
      </section>
    );
  }

  function renderDocumentsManager(field: FieldConfig) {
    const items = parseDocuments(content[field.key]);

    function updateItem(
      index: number,
      itemField: keyof SitePageDocument,
      value: string
    ) {
      const nextItems = [...items];
      nextItems[index] = { ...nextItems[index], [itemField]: value };
      updateField(field.key, stringifyDocuments(nextItems));
    }

    return (
      <section
        className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2"
        key={field.key}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h5 className="text-lg font-black text-slate-950">{field.label}</h5>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Voeg documenten of externe links toe, zoals kampboekje,
              bagagelijst, medische fiche of een PDF-link.
            </p>
          </div>
          <button
            className="rounded-full bg-[#103001] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
            onClick={() =>
              updateField(
                field.key,
                stringifyDocuments([
                  ...items,
                  { label: "", href: "", description: "" },
                ])
              )
            }
            type="button"
          >
            Document toevoegen
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-2"
                key={`${field.key}-document-${index}`}
              >
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Naam van het document
                  <input
                    className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    onChange={(event) =>
                      updateItem(index, "label", event.target.value)
                    }
                    onKeyDown={stopTextKeyPropagation}
                    value={item.label}
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Link naar document
                  <input
                    className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    onChange={(event) =>
                      updateItem(index, "href", event.target.value)
                    }
                    onKeyDown={stopTextKeyPropagation}
                    value={item.href}
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
                  Korte uitleg
                  <textarea
                    className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    onChange={(event) =>
                      updateItem(index, "description", event.target.value)
                    }
                    onKeyDown={stopTextKeyPropagation}
                    value={item.description}
                  />
                </label>
                <button
                  className="w-fit rounded-full border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
                  onClick={() =>
                    updateField(
                      field.key,
                      stringifyDocuments(
                        items.filter((_, itemIndex) => itemIndex !== index)
                      )
                    )
                  }
                  type="button"
                >
                  Verwijder document
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#fbfdf9] p-4 text-sm text-slate-500">
              Nog geen documenten toegevoegd.
            </div>
          )}
        </div>
      </section>
    );
  }

  function renderProductsManager(field: FieldConfig) {
    const items = parseProducts(content[field.key]);

    function updateItem(
      index: number,
      itemField: keyof SitePageProduct,
      value: string
    ) {
      const nextItems = [...items];
      nextItems[index] = { ...nextItems[index], [itemField]: value };
      updateField(field.key, stringifyProducts(nextItems));
    }

    return (
      <section
        className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2"
        key={field.key}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h5 className="text-lg font-black text-slate-950">{field.label}</h5>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Producten die in de shop verschijnen. Vul naam, prijs, opties en
              de knoptekst in.
            </p>
          </div>
          <button
            className="rounded-full bg-[#103001] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
            onClick={() =>
              updateField(
                field.key,
                stringifyProducts([
                  ...items,
                  { name: "", price: "", sizes: "", action: "Aanvragen" },
                ])
              )
            }
            type="button"
          >
            Product toevoegen
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_1fr_0.8fr_auto]"
                key={`${field.key}-product-${index}`}
              >
                {([
                  ["name", "Productnaam"],
                  ["price", "Prijs"],
                  ["sizes", "Maten, opties of opmerkingen"],
                  ["action", "Tekst op knop"],
                ] as Array<[keyof SitePageProduct, string]>).map(
                  ([itemField, label]) => (
                    <label
                      className="grid gap-2 text-sm font-semibold text-slate-700"
                      key={itemField}
                    >
                      {label}
                      <input
                        className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                        onChange={(event) =>
                          updateItem(index, itemField, event.target.value)
                        }
                        onKeyDown={stopTextKeyPropagation}
                        value={item[itemField]}
                      />
                    </label>
                  )
                )}
                <button
                  className="self-end rounded-full border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
                  onClick={() =>
                    updateField(
                      field.key,
                      stringifyProducts(
                        items.filter((_, itemIndex) => itemIndex !== index)
                      )
                    )
                  }
                  type="button"
                >
                  Verwijder product
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#fbfdf9] p-4 text-sm text-slate-500">
              Nog geen producten toegevoegd.
            </div>
          )}
        </div>
      </section>
    );
  }

  function renderLinksManager(field: FieldConfig) {
    const items = parseLinks(content[field.key]);

    function updateItem(
      index: number,
      itemField: keyof SitePageLinkItem,
      value: string
    ) {
      const nextItems = [...items];
      nextItems[index] = { ...nextItems[index], [itemField]: value };
      updateField(field.key, stringifyLinks(nextItems));
    }

    return (
      <section
        className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2"
        key={field.key}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h5 className="text-lg font-black text-slate-950">{field.label}</h5>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Links worden per categorie gegroepeerd. Gebruik bijvoorbeeld
              &quot;Formulieren&quot;, &quot;Scouts algemeen&quot; of &quot;Sociale media&quot;.
            </p>
          </div>
          <button
            className="rounded-full bg-[#103001] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
            onClick={() =>
              updateField(
                field.key,
                stringifyLinks([
                  ...items,
                  { category: "", label: "", href: "", description: "" },
                ])
              )
            }
            type="button"
          >
            Link toevoegen
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-2"
                key={`${field.key}-link-${index}`}
              >
                {([
                  ["category", "Categorie"],
                  ["label", "Naam van de link"],
                  ["href", "Webadres"],
                ] as Array<[keyof SitePageLinkItem, string]>).map(
                  ([itemField, label]) => (
                    <label
                      className="grid gap-2 text-sm font-semibold text-slate-700"
                      key={itemField}
                    >
                      {label}
                      <input
                        className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                        onChange={(event) =>
                          updateItem(index, itemField, event.target.value)
                        }
                        onKeyDown={stopTextKeyPropagation}
                        value={item[itemField]}
                      />
                    </label>
                  )
                )}
                <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
                  Korte uitleg bij de link
                  <textarea
                    className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    onChange={(event) =>
                      updateItem(index, "description", event.target.value)
                    }
                    onKeyDown={stopTextKeyPropagation}
                    value={item.description}
                  />
                </label>
                <button
                  className="w-fit rounded-full border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
                  onClick={() =>
                    updateField(
                      field.key,
                      stringifyLinks(
                        items.filter((_, itemIndex) => itemIndex !== index)
                      )
                    )
                  }
                  type="button"
                >
                  Verwijder link
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#fbfdf9] p-4 text-sm text-slate-500">
              Nog geen links toegevoegd.
            </div>
          )}
        </div>
      </section>
    );
  }

  function renderLinesManager(field: FieldConfig) {
    const items = parseLines(content[field.key]);

    return (
      <section
        className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2"
        key={field.key}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h5 className="text-lg font-black text-slate-950">{field.label}</h5>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Voeg regels toe die op de pagina onder elkaar verschijnen,
              bijvoorbeeld namen van leden van het oudercomite.
            </p>
          </div>
          <button
            className="rounded-full bg-[#103001] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
            onClick={() =>
              updateField(field.key, stringifyLines([...items, "Nieuwe regel"]))
            }
            type="button"
          >
            Regel toevoegen
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                className="grid gap-3 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-[1fr_auto]"
                key={`${field.key}-line-${index}`}
              >
                <input
                  className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                  onChange={(event) => {
                    const nextItems = [...items];
                    nextItems[index] = event.target.value;
                    updateField(field.key, stringifyLines(nextItems));
                  }}
                  onKeyDown={stopTextKeyPropagation}
                  value={item}
                />
                <button
                  className="rounded-full border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
                  onClick={() =>
                    updateField(
                      field.key,
                      stringifyLines(
                        items.filter((_, itemIndex) => itemIndex !== index)
                      )
                    )
                  }
                  type="button"
                >
                  Verwijder
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#fbfdf9] p-4 text-sm text-slate-500">
              Nog geen regels toegevoegd.
            </div>
          )}
        </div>
      </section>
    );
  }

  function renderPageField(field: FieldConfig) {
    const key = String(field.key);

    if (key.endsWith("Cards")) {
      return renderCardsManager(field);
    }

    if (key.endsWith("Facts")) {
      return renderFactsManager(field);
    }

    if (key.endsWith("Documents")) {
      return renderDocumentsManager(field);
    }

    if (key.endsWith("Products")) {
      return renderProductsManager(field);
    }

    if (key.endsWith("Items")) {
      return renderLinksManager(field);
    }

    if (key.endsWith("Members")) {
      return renderLinesManager(field);
    }

    return renderField(field);
  }

  function parseContactPhoneEntries(value: string) {
    return value
      .split(/\r?\n/)
      .filter((line) => line.length > 0)
      .map((line) => {
        const [name = "", phone = ""] = line.split("|");

        return {
          name,
          phone,
        };
      });
  }

  function stringifyContactPhoneEntries(
    entries: Array<{ name: string; phone: string }>
  ) {
    return entries
      .map((entry) => `${entry.name}|${entry.phone}`)
      .join("\n");
  }

  function updateContactPhoneEntry(
    index: number,
    field: "name" | "phone",
    value: string
  ) {
    const entries = parseContactPhoneEntries(content.contactPhones);
    const nextEntries = entries.map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, [field]: value } : entry
    );
    updateField("contactPhones", stringifyContactPhoneEntries(nextEntries));
  }

  function addContactPhoneEntry() {
    const entries = parseContactPhoneEntries(content.contactPhones);
    updateField(
      "contactPhones",
      stringifyContactPhoneEntries([
        ...entries,
        { name: "Nieuw contact", phone: "" },
      ])
    );
    setMessage("Telefoonnummer toegevoegd. Klik op opslaan.");
  }

  function removeContactPhoneEntry(index: number) {
    const entries = parseContactPhoneEntries(content.contactPhones);
    updateField(
      "contactPhones",
      stringifyContactPhoneEntries(
        entries.filter((_, entryIndex) => entryIndex !== index)
      )
    );
    setMessage("Telefoonnummer verwijderd. Klik op opslaan.");
  }

  function renderContactPhoneManager() {
    const phoneEntries = parseContactPhoneEntries(content.contactPhones);

    return (
      <section className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200 md:col-span-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">
              Telefoonnummers groepsleiding
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Voeg hier meerdere contactpunten toe. Ze verschijnen als naam +
              telefoonnummer in het groene contactblok.
            </p>
          </div>
          <button
            className="inline-flex rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
            onClick={addContactPhoneEntry}
            type="button"
          >
            Nummer toevoegen
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {phoneEntries.length > 0 ? (
            phoneEntries.map((entry, index) => (
              <div
                className="grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-slate-200 md:grid-cols-[1fr_1fr_auto]"
                key={`contact-phone-${index}`}
              >
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Naam
                  <input
                    className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    onChange={(event) =>
                      updateContactPhoneEntry(index, "name", event.target.value)
                    }
                    onKeyDown={stopTextKeyPropagation}
                    value={entry.name}
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Telefoonnummer
                  <input
                    className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    onChange={(event) =>
                      updateContactPhoneEntry(index, "phone", event.target.value)
                    }
                    onKeyDown={stopTextKeyPropagation}
                    value={entry.phone}
                  />
                </label>
                <button
                  className="self-end rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
                  onClick={() => removeContactPhoneEntry(index)}
                  type="button"
                >
                  Verwijder
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-sm font-semibold text-slate-600">
              Nog geen telefoonnummers toegevoegd.
            </div>
          )}
        </div>
      </section>
    );
  }

  function updateProgramItem(
    key: keyof EditableSiteContent,
    index: number,
    field: keyof ProgramItem,
    value: string
  ) {
    const items = parseProgramItems(content[key]);
    const nextItems = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );
    updateField(key, stringifyProgramItems(nextItems));
  }

  function addProgramItem(key: keyof EditableSiteContent) {
    const items = parseProgramItems(content[key]);
    updateField(key, stringifyProgramItems([...items, createProgramItem()]));
    setMessage("Nieuwe vergadering toegevoegd. Vul datum, titel, uur en uitleg in.");
  }

  function removeProgramItem(key: keyof EditableSiteContent, index: number) {
    const items = parseProgramItems(content[key]);
    updateField(
      key,
      stringifyProgramItems(items.filter((_, itemIndex) => itemIndex !== index))
    );
    setMessage("Vergadering verwijderd. Klik op opslaan.");
  }

  function renderProgramManager(key: keyof EditableSiteContent) {
    const items = parseProgramItems(content[key]);

    return (
      <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">Programma</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Elke kaart is een echte vergadering. Alleen ingevulde
              vergaderingen met datum, activiteit en uur verschijnen op de
              takpagina.
            </p>
          </div>
          <button
            className="inline-flex rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
            onClick={() => addProgramItem(key)}
            type="button"
          >
            Voeg vergadering toe
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200 md:grid-cols-[0.55fr_1fr_0.55fr_auto]"
                key={`${key}-${index}`}
              >
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Datum
                  <input
                    className="min-h-11 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    onKeyDown={stopTextKeyPropagation}
                    onChange={(event) =>
                      updateProgramItem(key, index, "date", event.target.value)
                    }
                    placeholder="31/01"
                    value={item.date}
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Activiteit
                  <input
                    className="min-h-11 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    onKeyDown={stopTextKeyPropagation}
                    onChange={(event) =>
                      updateProgramItem(key, index, "title", event.target.value)
                    }
                    placeholder="Zoektocht"
                    value={item.title}
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Uur
                  <input
                    className="min-h-11 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    onKeyDown={stopTextKeyPropagation}
                    onChange={(event) =>
                      updateProgramItem(key, index, "time", event.target.value)
                    }
                    placeholder="14u-17u"
                    value={item.time}
                  />
                </label>
                <button
                  className="self-end rounded-full bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
                  onClick={() => removeProgramItem(key, index)}
                  type="button"
                >
                  Verwijder
                </button>
                <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-4">
                  Uitleg
                  <textarea
                    className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    onKeyDown={stopTextKeyPropagation}
                    onChange={(event) =>
                      updateProgramItem(
                        key,
                        index,
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Korte uitleg voor leden en ouders..."
                    value={item.description}
                  />
                </label>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm leading-6 text-slate-500">
              Nog geen vergaderingen ingevuld. Klik op &quot;Voeg vergadering
              toe&quot; om het programma op te bouwen.
            </div>
          )}
        </div>
      </div>
    );
  }

  function updateFaqItem(
    index: number,
    field: keyof FAQItem,
    value: string
  ) {
    const items = parseFaqItems(content.faqItems);
    const nextItems = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );
    updateField("faqItems", stringifyFaqItems(nextItems));
  }

  function addFaqItem() {
    const items = parseFaqItems(content.faqItems);
    updateField("faqItems", stringifyFaqItems([...items, createFaqItem()]));
    setMessage("FAQ-vraag toegevoegd. Klik op opslaan.");
  }

  function removeFaqItem(index: number) {
    const items = parseFaqItems(content.faqItems);
    updateField(
      "faqItems",
      stringifyFaqItems(items.filter((_, itemIndex) => itemIndex !== index))
    );
    setMessage("FAQ-vraag verwijderd. Klik op opslaan.");
  }

  function renderFaqManager() {
    const items = parseFaqItems(content.faqItems);

    return (
      <article className="rounded-3xl border border-slate-200 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">FAQ-vragen</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Beheer hier alle veelgestelde vragen en antwoorden op de homepage.
            </p>
          </div>
          <button
            className="inline-flex rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
            onClick={addFaqItem}
            type="button"
          >
            Vraag toevoegen
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {items.map((item, index) => (
            <div
              className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200"
              key={`faq-${index}`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black text-slate-950">
                  Vraag {index + 1}
                </h3>
                <button
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
                  onClick={() => removeFaqItem(index)}
                  type="button"
                >
                  Verwijder
                </button>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Vraag
                <input
                  className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                  onKeyDown={stopTextKeyPropagation}
                  onChange={(event) =>
                    updateFaqItem(index, "question", event.target.value)
                  }
                  value={item.question}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Antwoord
                <textarea
                  className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                  onKeyDown={stopTextKeyPropagation}
                  onChange={(event) =>
                    updateFaqItem(index, "answer", event.target.value)
                  }
                  value={item.answer}
                />
              </label>
            </div>
          ))}
        </div>
      </article>
    );
  }

  function renderImportantDatesManager(key: keyof EditableSiteContent) {
    const value = content[key] ?? "";
    const hasImportantDates = value.trim().length > 0;

    return (
      <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">
              Belangrijke data
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Voeg hier een extra kader toe dat altijd onderaan het programma
              verschijnt. Handig voor weekends, kampdata, inschrijvingsmomenten
              of deadlines.
            </p>
          </div>
          {hasImportantDates ? (
            <button
              className="inline-flex rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
              onClick={() => {
                updateField(key, "");
                setMessage("Belangrijke data verwijderd. Klik op opslaan.");
              }}
              type="button"
            >
              Verwijder kader
            </button>
          ) : (
            <button
              className="inline-flex rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
              onClick={() => {
                updateField(
                  key,
                  "Zaterdag ...: ...\nWeekend ...: ...\nKamp ...: ..."
                );
                setMessage("Belangrijke data toegevoegd. Vul aan en klik op opslaan.");
              }}
              type="button"
            >
              Voeg belangrijke data toe
            </button>
          )}
        </div>

        {hasImportantDates ? (
          <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
            Tekst in dit kader
            <textarea
              className="min-h-40 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
              onKeyDown={stopTextKeyPropagation}
              onChange={(event) => updateField(key, event.target.value)}
              value={value}
            />
          </label>
        ) : (
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-[#fbfdf9] p-6 text-sm leading-6 text-slate-500">
            Er verschijnt geen belangrijke-data-kader op de takpagina zolang dit
            leeg is.
          </div>
        )}
      </div>
    );
  }

  function renderBranchesManager() {
    const branchChoices = allowedBranches.length > 0 ? allowedBranches : branchProfiles;

    return (
      <article className="rounded-3xl border border-slate-200 p-5">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">
            Takken en takpagina&apos;s
          </p>
          <h2 className="mt-2 text-2xl font-black">Takken bewerken</h2>
          <p className="mt-2 text-slate-600">
            {isSuperAdmin
              ? "Beheer hier de algemene takkenpagina, de detailpagina's, taklogo's en de leiding per tak."
              : "Je beheert hier alleen de pagina en het programma van je eigen tak."}
          </p>
        </div>

        {isSuperAdmin ? (
          <div className="mb-6 grid gap-4 rounded-3xl bg-[#fbfdf9] p-5">
            <div className="grid gap-5 md:grid-cols-2">
              {renderField({
                key: "branchesPageTitle",
                label: "Titel overzichtspagina",
              })}
              {renderField({
                key: "branchesPageSubtitle",
                label: "Intro overzichtspagina",
                kind: "textarea",
              })}
            </div>
          </div>
        ) : null}

        <div className="mb-6 flex flex-wrap gap-2">
          {branchChoices.map((branch) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                activeBranchSlug === branch.slug
                  ? "bg-[#103001] text-white"
                  : "bg-[#edf6e8] text-[#103001] hover:bg-[#d7e8cf]"
              }`}
              key={branch.slug}
              onClick={() => setActiveBranchSlug(branch.slug)}
              type="button"
            >
              {branch.name}
            </button>
          ))}
        </div>

        <div className="grid gap-5">
          <div className="rounded-3xl bg-[#fbfdf9] p-5">
            <h3 className="text-xl font-black">{activeBranch.name}</h3>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {renderField({
                key: activeBranch.contentKeys.age,
                label: "Leeftijd",
              })}
              {renderField({
                key: activeBranch.contentKeys.shortDescription,
                label: "Korte tekst op takkenoverzicht",
                kind: "textarea",
              })}
              {renderField({
                key: activeBranch.contentKeys.intro,
                label: "Intro op detailpagina",
                kind: "textarea",
              })}
              {renderField({
                key: activeBranch.contentKeys.highlights,
                label: "Highlights, elk punt op een nieuwe regel",
                kind: "textarea",
              })}
              {renderField({
                key: activeBranch.contentKeys.leaderNames,
                label: "Leiding, 1 persoon per lijn",
                kind: "textarea",
              })}
              {renderProgramManager(activeBranch.contentKeys.program)}
              {renderImportantDatesManager(
                activeBranch.contentKeys.importantDates
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-[#fbfdf9] p-5">
            <h3 className="text-xl font-black">Planningkader</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Deze info verschijnt rechts naast het programma op de takpagina.
              Individuele vergaderingen behouden altijd hun eigen uur.
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {renderField({
                key: activeBranch.contentKeys.planning.day,
                label: "Vaste dag",
              })}
              {renderField({
                key: activeBranch.contentKeys.planning.time,
                label: "Standaarduur",
              })}
              {renderField({
                key: activeBranch.contentKeys.planning.timeNote,
                label: "Nuance bij standaarduur",
                kind: "textarea",
              })}
              {renderField({
                key: activeBranch.contentKeys.planning.location,
                label: "Locatie",
              })}
              {renderField({
                key: activeBranch.contentKeys.planning.bring,
                label: "Meenemen",
                kind: "textarea",
              })}
              {renderField({
                key: activeBranch.contentKeys.planning.bringNote,
                label: "Nuance bij meenemen/kledij",
                kind: "textarea",
              })}
              {renderField({
                key: activeBranch.contentKeys.planning.contact,
                label: "Contacttekst",
                kind: "textarea",
              })}
              {renderField({
                key: activeBranch.contentKeys.planning.countText,
                label: "Tekst bij aantal vergaderingen. Schrijf {aantal} waar het aantal moet verschijnen.",
                kind: "textarea",
              })}
              {renderField({
                key: activeBranch.contentKeys.planning.emptyText,
                label: "Tekst als er geen vergaderingen zijn",
                kind: "textarea",
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-[#fbfdf9] p-5">
            <h3 className="text-xl font-black">Detailblokken</h3>
            <div className="mt-5 grid gap-5">
              {activeBranch.contentKeys.blocks.map((block, index) => (
                <div
                  className="grid gap-5 rounded-3xl bg-white p-5 md:grid-cols-2"
                  key={`${activeBranch.slug}-${index}`}
                >
                  {renderField({
                    key: block.title,
                    label: `Blok ${index + 1} titel`,
                  })}
                  {renderField({
                    key: block.text,
                    label: `Blok ${index + 1} tekst`,
                    kind: "textarea",
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 rounded-3xl bg-[#fbfdf9] p-5 md:grid-cols-2">
            {renderMediaCard(
              activeBranch.logoKey,
              `Logo ${activeBranch.name}`,
              "PNG met transparante achtergrond werkt hier goed.",
              true
            )}
            {renderMediaCard(
              activeBranch.contentKeys.imageUrl,
              `Sfeerfoto ${activeBranch.name}`,
              "Optionele foto bovenaan de detailpagina."
            )}
            {renderMediaCard(
              activeBranch.contentKeys.leaderPhotoUrl,
              `Foto leiding ${activeBranch.name}`,
              "Groepsfoto of foto van de actieve leiding van dit jaar."
            )}
          </div>
        </div>
      </article>
    );
  }

  function renderMediaCard(
    key: keyof EditableSiteContent,
    label: string,
    description: string,
    logo = false
  ) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5" key={key}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-slate-950">{label}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
          <label className="inline-flex shrink-0 cursor-pointer justify-center rounded-full bg-white px-4 py-2 text-sm font-bold text-[#103001] ring-1 ring-slate-200 transition hover:bg-[#edf6e8]">
            {uploadingKey === key ? "Uploaden..." : "Upload"}
            <input
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              className="sr-only"
              disabled={uploadingKey === key}
              onChange={(event) => uploadMedia(key, event, logo)}
              type="file"
            />
          </label>
        </div>
        {content[key] ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <img
              alt=""
              className={`h-36 w-full ${logo ? "object-contain p-4" : "object-cover"}`}
              src={content[key]}
            />
            <button
              className="w-full border-t border-slate-200 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
              onClick={() => clearField(key, label)}
              type="button"
            >
              Verwijder uit site
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  function renderGalleryManager(theme: GalleryTheme) {
    if (!theme.coverKey || !theme.collageKey) {
      return null;
    }

    const images = parseImageListValue(content[theme.collageKey]);

    return (
      <article
        className="rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5"
        key={theme.slug}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">
              Collage {theme.label}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              De hoofdfoto bepaalt de kaart op de homepage. De collagefoto&apos;s
              verschijnen op de detailpagina <span className="font-bold">/fotos/{theme.slug}</span>.
            </p>
          </div>
          <label className="inline-flex shrink-0 cursor-pointer justify-center rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d]">
            {uploadingKey === theme.collageKey ? "Uploaden..." : "Foto's toevoegen"}
            <input
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              className="sr-only"
              disabled={uploadingKey === theme.collageKey}
              multiple
              onChange={(event) => uploadGalleryImages(theme, event)}
              type="file"
            />
          </label>
        </div>

        <div className="mt-5">
          {renderMediaCard(
            theme.coverKey,
            `Hoofdfoto ${theme.label}`,
            "Deze foto staat op de fotokaart en als eerste beeld van de collage.",
          )}
        </div>

        <div className="mt-5">
          {images.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {images.map((image, index) => (
                <div
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  key={`${image}-${index}`}
                >
                  <img
                    alt={`${theme.label} collagefoto ${index + 1}`}
                    className="h-36 w-full object-cover"
                    src={image}
                  />
                  <div className="grid grid-cols-2 gap-2 p-3">
                    <button
                      className="rounded-full bg-[#edf6e8] px-3 py-2 text-xs font-bold text-[#103001] disabled:opacity-40"
                      disabled={index === 0}
                      onClick={() => moveGalleryImage(theme, index, -1)}
                      type="button"
                    >
                      Omhoog
                    </button>
                    <button
                      className="rounded-full bg-[#edf6e8] px-3 py-2 text-xs font-bold text-[#103001] disabled:opacity-40"
                      disabled={index === images.length - 1}
                      onClick={() => moveGalleryImage(theme, index, 1)}
                      type="button"
                    >
                      Omlaag
                    </button>
                    <label className="cursor-pointer rounded-full bg-white px-3 py-2 text-center text-xs font-bold text-[#103001] ring-1 ring-slate-200 transition hover:bg-[#edf6e8]">
                      Vervang
                      <input
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        className="sr-only"
                        onChange={(event) => replaceGalleryImage(theme, index, event)}
                        type="file"
                      />
                    </label>
                    <button
                      className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                      onClick={() => removeGalleryImage(theme, index)}
                      type="button"
                    >
                      Verwijder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm leading-6 text-slate-500">
              Nog geen extra collagefoto&apos;s toegevoegd. De detailpagina gebruikt
              voorlopig nette placeholders.
            </div>
          )}
        </div>
      </article>
    );
  }

  function renderCustomGalleryManager(theme: CustomGalleryTheme) {
    return (
      <article
        className="rounded-3xl border border-slate-200 bg-white p-5"
        key={theme.id}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h3 className="text-xl font-black text-slate-950">
              Extra collage
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Deze collage krijgt een eigen fotopagina op{" "}
              <span className="font-bold">/fotos/{theme.slug}</span>.
            </p>
          </div>
          <button
            className="inline-flex justify-center rounded-full bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
            onClick={() => removeCustomGalleryTheme(theme.id)}
            type="button"
          >
            Collage verwijderen
          </button>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200">
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Naam van de collage
                <input
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                  onChange={(event) =>
                    updateCustomGalleryTheme(
                      theme.id,
                      "label",
                      event.target.value
                    )
                  }
                  onKeyDown={stopTextKeyPropagation}
                  value={theme.label}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Alt-tekst voor toegankelijkheid
                <input
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                  onChange={(event) =>
                    updateCustomGalleryTheme(
                      theme.id,
                      "alt",
                      event.target.value
                    )
                  }
                  onKeyDown={stopTextKeyPropagation}
                  value={theme.alt ?? ""}
                />
              </label>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {theme.coverUrl ? (
                <img
                  alt={theme.alt ?? theme.label}
                  className="h-40 w-full object-cover"
                  src={theme.coverUrl}
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-[#edf6e8] px-6 text-center text-sm font-semibold text-[#2f6b18]">
                  Nog geen hoofdfoto. De eerste collagefoto wordt anders gebruikt.
                </div>
              )}
              <div className="grid gap-2 p-3 sm:grid-cols-2">
                <label className="cursor-pointer rounded-full bg-[#103001] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#1e4b0d]">
                  {uploadingKey === `custom-cover-${theme.id}`
                    ? "Uploaden..."
                    : "Hoofdfoto uploaden"}
                  <input
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    className="sr-only"
                    disabled={uploadingKey === `custom-cover-${theme.id}`}
                    onChange={(event) => uploadCustomGalleryCover(theme, event)}
                    type="file"
                  />
                </label>
                <button
                  className="rounded-full bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-40"
                  disabled={!theme.coverUrl}
                  onClick={() => {
                    const items = parseCustomGalleryThemes(content.galleryCustomThemes);
                    updateCustomGalleryThemes(
                      items.map((item) =>
                        item.id === theme.id ? { ...item, coverUrl: "" } : item
                      )
                    );
                    setMessage("Hoofdfoto verwijderd. Klik op opslaan.");
                  }}
                  type="button"
                >
                  Hoofdfoto wissen
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="text-lg font-black text-slate-950">
                  Foto&apos;s in deze collage
                </h4>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Voeg meerdere foto&apos;s toe, zet ze in volgorde of verwijder
                  wat niet meer nodig is.
                </p>
              </div>
              <label className="inline-flex shrink-0 cursor-pointer justify-center rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d]">
                {uploadingKey === `custom-images-${theme.id}`
                  ? "Uploaden..."
                  : "Foto's toevoegen"}
                <input
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  className="sr-only"
                  disabled={uploadingKey === `custom-images-${theme.id}`}
                  multiple
                  onChange={(event) => uploadCustomGalleryImages(theme, event)}
                  type="file"
                />
              </label>
            </div>

            <div className="mt-5">
              {theme.images.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {theme.images.map((image, index) => (
                    <div
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                      key={`${image}-${index}`}
                    >
                      <img
                        alt={`${theme.label} collagefoto ${index + 1}`}
                        className="h-36 w-full object-cover"
                        src={image}
                      />
                      <div className="grid grid-cols-2 gap-2 p-3">
                        <button
                          className="rounded-full bg-[#edf6e8] px-3 py-2 text-xs font-bold text-[#103001] disabled:opacity-40"
                          disabled={index === 0}
                          onClick={() => moveCustomGalleryImage(theme, index, -1)}
                          type="button"
                        >
                          Omhoog
                        </button>
                        <button
                          className="rounded-full bg-[#edf6e8] px-3 py-2 text-xs font-bold text-[#103001] disabled:opacity-40"
                          disabled={index === theme.images.length - 1}
                          onClick={() => moveCustomGalleryImage(theme, index, 1)}
                          type="button"
                        >
                          Omlaag
                        </button>
                        <label className="cursor-pointer rounded-full bg-white px-3 py-2 text-center text-xs font-bold text-[#103001] ring-1 ring-slate-200 transition hover:bg-[#edf6e8]">
                          Vervang
                          <input
                            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                            className="sr-only"
                            onChange={(event) =>
                              replaceCustomGalleryImage(theme, index, event)
                            }
                            type="file"
                          />
                        </label>
                        <button
                          className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                          onClick={() => removeCustomGalleryImage(theme, index)}
                          type="button"
                        >
                          Verwijder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm leading-6 text-slate-500">
                  Nog geen foto&apos;s in deze collage.
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  function renderMediaLibrary() {
    const usageMap = getMediaUsageMap();
    const unusedCount = mediaLibrary.filter((item) => !usageMap.has(item.key)).length;

    return (
      <article className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-950">
              Mediabibliotheek
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Hier zie je alle uploads in de media-opslag. Verwijder alleen
              ongebruikte bestanden; foto&apos;s die nog in de site staan krijgen
              het label &quot;in gebruik&quot;.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-full bg-[#edf6e8] px-5 py-3 text-sm font-bold text-[#103001] transition hover:bg-[#d7e8cf]"
              onClick={loadMediaLibrary}
              type="button"
            >
              Vernieuw
            </button>
            <button
              className="rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d] disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={unusedCount === 0}
              onClick={cleanupUnusedMedia}
              type="button"
            >
              Ongebruikte uploads opruimen
            </button>
          </div>
        </div>

        <div className="mt-5">
          {mediaLibraryLoading ? (
            <div className="rounded-3xl bg-[#fbfdf9] p-6 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
              Mediabibliotheek laden...
            </div>
          ) : mediaLibrary.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {mediaLibrary.map((item) => {
                const usageLabels = usageMap.get(item.key) ?? [];
                const isUsed = usageLabels.length > 0;
                const sizeInKb = Math.max(1, Math.round(item.size / 1024));

                return (
                  <div
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-[#fbfdf9]"
                    key={item.key}
                  >
                    <img
                      alt=""
                      className="h-36 w-full bg-white object-cover"
                      src={item.url}
                    />
                    <div className="grid gap-3 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            isUsed
                              ? "bg-[#edf6e8] text-[#103001]"
                              : "bg-amber-50 text-amber-800"
                          }`}
                        >
                          {isUsed ? "In gebruik" : "Ongebruikt"}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                          {sizeInKb} KB
                        </span>
                      </div>
                      <p className="break-all text-xs leading-5 text-slate-500">
                        {item.key}
                      </p>
                      {isUsed ? (
                        <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#2f6b18]">
                            Gebruikt bij
                          </p>
                          <ul className="mt-2 grid gap-1 text-xs leading-5 text-slate-600">
                            {usageLabels.slice(0, 5).map((label) => (
                              <li key={label}>{label}</li>
                            ))}
                          </ul>
                          {usageLabels.length > 5 ? (
                            <p className="mt-2 text-xs font-semibold text-slate-500">
                              +{usageLabels.length - 5} extra plaats(en)
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                      <button
                        className="rounded-full bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        disabled={isUsed}
                        onClick={async () => {
                          if (await deleteMediaItem(item)) {
                            setMessage("Ongebruikt bestand definitief verwijderd.");
                          }
                        }}
                        type="button"
                      >
                        {isUsed ? "Eerst uit site halen" : "Bestand verwijderen"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-[#fbfdf9] p-6 text-sm leading-6 text-slate-500">
              Nog geen uploads gevonden in de mediabibliotheek.
            </div>
          )}
        </div>
      </article>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f2f8ee] px-5 py-16 text-slate-950">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
          Beheeromgeving laden...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f2f8ee] px-8 py-8 text-slate-950">
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-[#103001] p-6 text-white shadow-xl shadow-green-950/15 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-green-100">
              Beheer
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Scouts Sint-Jan Berchmans
            </h1>
            <p className="mt-2 max-w-2xl text-green-100">
              Een rustig dashboard voor desktop: kies een categorie, pas de
              inhoud aan en open daarna een voorbeeld van de publieke site.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {authenticated && adminSession ? (
              <div className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white">
                {adminSession.displayName}
              </div>
            ) : null}
            <Link
              className="rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-green-50"
              href="/"
            >
              Bekijk site
            </Link>
            {authenticated ? (
              <button
                className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                onClick={handleLogout}
                type="button"
              >
                Uitloggen
              </button>
            ) : null}
          </div>
        </div>

        {!configured ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <h2 className="text-xl font-bold">Beheer is nog niet geconfigureerd</h2>
            <p className="mt-3 leading-7">
              Maak lokaal een bestand <code>.dev.vars</code> aan in de
              projectmap en zet minstens <code>ADMIN_PASSWORD</code> en{" "}
              <code>ADMIN_SESSION_SECRET</code>. Online zet je dezelfde waarden
              als geheime hosting-variabelen.
            </p>
            {missingConfig.length > 0 ? (
              <p className="mt-3 text-sm font-bold">
                Ontbreekt nu: {missingConfig.join(", ")}
              </p>
            ) : null}
            <div className="mt-5 grid gap-2 md:grid-cols-2">
              {setupHelp.map((item) => (
                <div
                  className="rounded-2xl bg-white/70 px-4 py-3 text-sm ring-1 ring-amber-200"
                  key={item.username}
                >
                  <span className="font-black">{item.username}</span>
                  <span className="block text-amber-800">
                    {item.role}: <code>{item.env}</code>
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {!authenticated ? (
          configured ? (
            <form
            className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            onSubmit={handleLogin}
          >
            <h2 className="text-2xl font-black">Aanmelden</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Log in met je gebruikersnaam en wachtwoord. Groepsleiding kan
              alles beheren; takleiding ziet alleen de eigen tak.
            </p>
            <label className="mt-6 grid gap-2 text-sm font-semibold text-slate-700">
              Gebruikersnaam
              <input
                className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                onKeyDown={stopTextKeyPropagation}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="groepsleiding"
                type="text"
                value={username}
              />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
              Wachtwoord
              <input
                className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                onKeyDown={stopTextKeyPropagation}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </label>
            <button
              className="mt-6 w-full rounded-full bg-[#103001] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
              type="submit"
            >
              Inloggen
            </button>
            <p className="mt-4 rounded-2xl bg-[#fbfdf9] p-4 text-sm leading-6 text-slate-500">
              De wachtwoorden staan niet in de code. Ze worden gelezen uit
              geheime omgevingsvariabelen zoals <code>ADMIN_PASSWORD</code> en
              de takspecifieke wachtwoorden.
            </p>
            </form>
          ) : null
        ) : (
          <form
            className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]"
            onSubmit={handleSave}
          >
            <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-6">
              {visibleSections.map((section) => (
                <button
                  className={`mb-2 w-full rounded-3xl px-4 py-4 text-left transition ${
                    activeSectionId === section.id
                      ? "bg-[#103001] text-white shadow-lg shadow-green-950/15"
                      : "text-slate-700 hover:bg-[#edf6e8]"
                  }`}
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  type="button"
                >
                  <span className="block text-sm font-black">
                    {section.label}
                  </span>
                  <span
                    className={`mt-1 block text-xs leading-5 ${
                      activeSectionId === section.id
                        ? "text-green-100"
                        : "text-slate-500"
                    }`}
                  >
                    {section.description}
                  </span>
                </button>
              ))}
            </aside>

            <section className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-7 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                  Actieve categorie
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {activeSectionInfo.label}
                </h2>
                <p className="mt-2 text-slate-600">
                  {activeSectionInfo.description}
                </p>
              </div>
              {contentStatus?.source === "defaults" ? (
                <div className="mb-7 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                  <h3 className="text-lg font-black">
                    Databank niet bereikbaar
                  </h3>
                  <p className="mt-2 text-sm leading-6">
                    De beheeromgeving toont nu standaardinhoud omdat de
                    databank niet gelezen kon worden. Controleer dit voor je
                    verder bewerkt.
                  </p>
                  {contentStatus.error ? (
                    <p className="mt-3 rounded-2xl bg-white/70 p-3 text-xs leading-5">
                      {contentStatus.error}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {activeSectionId === "branding" ? (
                <div className="grid gap-6">
                  <article className="rounded-3xl border border-slate-200 p-5">
                    <div className="mb-6">
                      <h2 className="text-2xl font-black">Algemene gegevens</h2>
                      <p className="mt-2 max-w-2xl text-slate-600">
                        Naam, hoofdkleur en herkenbaarheid van de website.
                      </p>
                    </div>
                    <div className="mb-5 grid gap-5 md:grid-cols-2">
                      {renderField({ key: "siteName", label: "Naam van de site" })}
                      {renderField({
                        key: "sitePrimaryColor",
                        label: "Hoofdkleur / scoutskleur",
                      })}
                    </div>
                    {renderMediaCard(
                      "siteLogoUrl",
                      "Hoofdlogo website",
                      "Wordt gebruikt in de navigatie en footer. Een breed logo zoals op de oude site mag hier ook.",
                      true
                    )}
                  </article>
                </div>
              ) : null}

              {activeSectionId === "homepage" ? (
                <div className="grid gap-6">
                  <article className="rounded-3xl border border-slate-200 p-5">
                    <div className="mb-5">
                      <h2 className="text-2xl font-black">
                        Homepage onderdelen
                      </h2>
                      <p className="mt-2 text-slate-600">
                        Kies eerst welk deel van de homepage je wil aanpassen.
                        Zo hoef je niet door alle teksten te scrollen.
                      </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {homepageEditorItems.map((item) => (
                        <button
                          className={`rounded-3xl border p-5 text-left transition ${
                            activeHomepageItem.id === item.id
                              ? "border-[#d7e8cf] bg-[#edf6e8] shadow-lg shadow-green-950/8"
                              : "border-slate-200 bg-[#fbfdf9] hover:bg-[#f2f8ee]"
                          }`}
                          key={item.id}
                          onClick={() => setActiveHomepageItemId(item.id)}
                          type="button"
                        >
                          <span className="block text-lg font-black text-slate-950">
                            {item.title}
                          </span>
                          <span className="mt-2 block text-sm leading-6 text-slate-600">
                            {item.description}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                      <div className="mb-5">
                        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                          Gekozen homepageblok
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">
                          {activeHomepageItem.title}
                        </h3>
                        <p className="mt-2 text-slate-600">
                          {activeHomepageItem.description}
                        </p>
                      </div>
                      {activeHomepageItem.type === "fields" &&
                      activeHomepageItem.group ? (
                        <div className="grid gap-5 md:grid-cols-2">
                          {activeHomepageItem.group.fields.map(renderField)}
                        </div>
                      ) : (
                        <div>{renderFaqManager()}</div>
                      )}
                    </div>
                  </article>
                  <article className="rounded-3xl border border-slate-200 p-5">
                    <div className="mb-5">
                      <h2 className="text-2xl font-black">
                        Waar beheer ik de rest?
                      </h2>
                      <p className="mt-2 text-slate-600">
                        Sommige homepageblokken gebruiken inhoud uit een andere
                        categorie, zodat je die maar op een plek hoeft aan te
                        passen.
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        [
                          "Takken-preview",
                          "Logo's, leeftijden en takteksten beheer je onder Takken.",
                          "Naar Takken",
                        ],
                        [
                          "Activiteiten-preview",
                          "De aparte activiteiten- en actiepagina's beheer je onder Pagina's.",
                          "Naar Pagina's",
                        ],
                        [
                          "Fotopagina",
                          "Hoofdfoto's en collages beheer je onder Media.",
                          "Naar Media",
                        ],
                        [
                          "Contactblok",
                          "E-mail, telefoonnummers en sociale links beheer je onder Contact.",
                          "Naar Contact",
                        ],
                      ].map(([title, text, action]) => (
                        <div
                          className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200"
                          key={title}
                        >
                          <h3 className="text-lg font-black text-slate-950">
                            {title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {text}
                          </p>
                          <p className="mt-4 text-sm font-bold text-[#2f6b18]">
                            {action}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              ) : null}

              {activeSectionId === "takken" ? (
                <div>
                  <div className="mb-6">
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                      Takkenpagina
                    </p>
                    <h2 className="mt-2 text-3xl font-black">
                      Takken bewerken
                    </h2>
                    <p className="mt-2 text-slate-600">
                      Kies een tak. De preview springt mee naar de juiste
                      takpagina.
                    </p>
                  </div>

                  {isSuperAdmin ? (
                    <div className="mb-6 grid gap-4 rounded-3xl bg-[#fbfdf9] p-5">
                      <div className="grid gap-5 md:grid-cols-2">
                        {renderField({
                          key: "branchesPageTitle",
                          label: "Titel overzichtspagina",
                        })}
                        {renderField({
                          key: "branchesPageSubtitle",
                          label: "Intro overzichtspagina",
                          kind: "textarea",
                        })}
                      </div>
                    </div>
                  ) : null}

                  <div className="mb-6 flex flex-wrap gap-2">
                    {allowedBranches.map((branch) => (
                      <button
                        className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                          activeBranchSlug === branch.slug
                            ? "bg-[#103001] text-white"
                            : "bg-[#edf6e8] text-[#103001] hover:bg-[#d7e8cf]"
                        }`}
                        key={branch.slug}
                        onClick={() => setActiveBranchSlug(branch.slug)}
                        type="button"
                      >
                        {branch.name}
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-5">
                    <article className="rounded-3xl border border-slate-200 p-5">
                      <h3 className="text-xl font-black">
                        {activeBranch.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Dit zijn de teksten die bovenaan en in de korte
                        takkaarten verschijnen.
                      </p>
                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        {renderField({
                          key: activeBranch.contentKeys.age,
                          label: "Leeftijd op kaartjes en takpagina",
                        })}
                        {renderField({
                          key: activeBranch.contentKeys.shortDescription,
                          label: "Korte uitleg op takkenoverzicht",
                          kind: "textarea",
                          help: "Deze tekst staat in de grotere takkaart op /takken.",
                        })}
                        {renderField({
                          key: activeBranch.contentKeys.intro,
                          label: "Intro bovenaan de takpagina",
                          kind: "textarea",
                          help: "De eerste uitleg die ouders lezen op de aparte takpagina.",
                        })}
                        {renderField({
                          key: activeBranch.contentKeys.highlights,
                          label: "Korte tags op de takpagina",
                          kind: "textarea",
                          help: "Zet elke tag op een aparte regel, bijvoorbeeld: fantasie, spel, vrienden.",
                        })}
                        {renderField({
                          key: activeBranch.contentKeys.leaderNames,
                          label: "Leidingnamen",
                          kind: "textarea",
                          help: "Zet elke leider op een aparte regel. Functie of telefoonnummer mag erbij.",
                        })}
                      </div>
                    </article>

                    <article className="rounded-3xl border border-slate-200 p-5">
                      <h3 className="text-xl font-black">Vier tekstblokken op de takpagina</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Deze blokken staan onder de hero en geven ouders snel
                        praktische uitleg over de tak.
                      </p>
                      <div className="mt-5 grid gap-5">
                        {activeBranch.contentKeys.blocks.map((block, index) => (
                          <div
                            className="grid gap-5 rounded-3xl bg-[#fbfdf9] p-5 md:grid-cols-2"
                            key={`${activeBranch.slug}-${index}`}
                          >
                            {renderField({
                              key: block.title,
                              label: `Tekstblok ${index + 1}: titel`,
                            })}
                            {renderField({
                              key: block.text,
                              label: `Tekstblok ${index + 1}: uitleg`,
                              kind: "textarea",
                            })}
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="grid gap-5 rounded-3xl border border-slate-200 p-5 md:grid-cols-2">
                      {renderProgramManager(activeBranch.contentKeys.program)}
                      {renderImportantDatesManager(
                        activeBranch.contentKeys.importantDates
                      )}
                    </article>

                    <article className="grid gap-5 rounded-3xl border border-slate-200 p-5 md:grid-cols-2">
                      {renderMediaCard(
                        activeBranch.logoKey,
                        `Logo ${activeBranch.name}`,
                        "PNG met transparante achtergrond werkt hier goed.",
                        true
                      )}
                      {renderMediaCard(
                        activeBranch.contentKeys.imageUrl,
                        `Sfeerfoto ${activeBranch.name}`,
                        "Optionele foto bovenaan de detailpagina."
                      )}
                      {renderMediaCard(
                        activeBranch.contentKeys.leaderPhotoUrl,
                        `Foto leiding ${activeBranch.name}`,
                        "Groepsfoto of foto van de actieve leiding van dit jaar."
                      )}
                    </article>
                  </div>
                </div>
              ) : null}

              {activeSectionId === "media" ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-3xl font-black">Media bewerken</h2>
                    <p className="mt-2 text-slate-600">
                      Upload foto&apos;s voor de homepage en beheer per
                      sfeerbeeld meerdere collagefoto&apos;s. In de
                      mediabibliotheek zie je ook waar elke upload gebruikt
                      wordt.
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {mediaFields.map((field) =>
                      renderMediaCard(
                        field.key,
                        field.label,
                        field.description
                      )
                    )}
                  </div>
                  <div className="mt-8 grid gap-5">
                    {galleryThemes.map(renderGalleryManager)}
                  </div>
                  <article className="mt-8 rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-2xl font-black text-slate-950">
                          Extra collages
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                          Voeg nieuwe fotothema&apos;s toe naast de vaste
                          collages. Elke extra collage krijgt automatisch een
                          eigen pagina onder /fotos.
                        </p>
                      </div>
                      <button
                        className="inline-flex justify-center rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
                        onClick={addCustomGalleryTheme}
                        type="button"
                      >
                        Nieuwe collage toevoegen
                      </button>
                    </div>
                    <div className="mt-6 grid gap-5">
                      {customGalleryThemes.length > 0 ? (
                        customGalleryThemes.map(renderCustomGalleryManager)
                      ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm leading-6 text-slate-500">
                          Er zijn nog geen extra collages. De vaste thema&apos;s
                          hierboven blijven gewoon actief.
                        </div>
                      )}
                    </div>
                  </article>
                  <div className="mt-8">{renderMediaLibrary()}</div>
                </div>
              ) : null}

              {activeSectionId === "pages" ? (
                <div className="grid gap-6">
                  {isSuperAdmin ? (
                    <article
                      className="rounded-3xl border border-slate-200 p-5"
                    >
                      <div className="mb-6">
                        <h2 className="text-2xl font-black">
                          Activiteiten, steunacties en praktische pagina&apos;s
                        </h2>
                        <p className="mt-2 text-slate-600">
                          Kies eerst welk onderdeel je wil beheren. Zo blijft
                          het dashboard rustig en voorkom je lange formulieren.
                        </p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {pageEditorItems.map((item) => (
                          <button
                            className={`rounded-3xl border p-5 text-left transition ${
                              activePageItem.id === item.id
                                ? "border-[#d7e8cf] bg-[#edf6e8] shadow-lg shadow-green-950/8"
                                : "border-slate-200 bg-[#fbfdf9] hover:bg-[#f2f8ee]"
                            }`}
                            key={item.id}
                            onClick={() => setActivePageItemId(item.id)}
                            type="button"
                          >
                            <span className="block text-lg font-black text-slate-950">
                              {item.title}
                            </span>
                            <span className="mt-2 block text-sm leading-6 text-slate-600">
                              {item.description}
                            </span>
                            <span className="mt-4 block text-sm font-bold text-[#2f6b18]">
                              {item.href}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                              Gekozen onderdeel
                            </p>
                            <h3 className="mt-2 text-2xl font-black text-slate-950">
                              {activePageItem.title}
                            </h3>
                            <p className="mt-2 text-slate-600">
                              {activePageItem.description}
                            </p>
                          </div>
                          <Link
                            className="inline-flex rounded-full bg-[#edf6e8] px-5 py-3 text-sm font-bold text-[#103001] transition hover:bg-[#d7e8cf]"
                            href={activePageItem.href}
                            target="_blank"
                          >
                            Bekijk pagina
                          </Link>
                        </div>
                        <div className="grid gap-6">
                          {renderMediaCard(
                            activePageItem.imageKey,
                            `Hoofdbeeld ${activePageItem.title}`,
                            "Afbeelding rechts in de hero van deze pagina."
                          )}
                          <div className="rounded-3xl bg-[#edf6e8] p-5 text-sm leading-6 text-[#103001] ring-1 ring-[#d7e8cf]">
                            <p className="font-black">
                              Zo werkt deze pagina
                            </p>
                            <p className="mt-2">
                              Elk blok hieronder komt overeen met een zichtbaar
                              stuk op de pagina: bovenkant, tekstblokken,
                              infokaarten, knoppen of externe linkbalk. Bij
                              herhaalbare onderdelen kan je zelf blokken
                              toevoegen of verwijderen.
                            </p>
                          </div>
                          {activePageItem.adminGroups.map((group) => (
                            <section
                              className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200"
                              key={group.title}
                            >
                              <div className="mb-5">
                                <h4 className="text-xl font-black text-slate-950">
                                  {group.title}
                                </h4>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                  {group.description}
                                </p>
                              </div>
                              <div className="grid gap-5 md:grid-cols-2">
                                {group.fields.map(renderPageField)}
                              </div>
                            </section>
                          ))}
                        </div>
                      </div>
                    </article>
                  ) : null}
                </div>
              ) : null}

              {activeSectionId === "footer" ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-3xl font-black">Footer bewerken</h2>
                    <p className="mt-2 text-slate-600">
                      Beheer de tekst onderaan de site en de sociale links.
                      Navigatielinks volgen de bestaande sitepagina&apos;s.
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {footerFields.map(renderField)}
                  </div>
                </div>
              ) : null}

              {activeSectionId === "navigation" ? (
                <div className="grid gap-6">
                  <article className="rounded-3xl border border-slate-200 p-5">
                    <div className="mb-6">
                      <h2 className="text-2xl font-black">Hoofdmenu</h2>
                      <p className="mt-2 text-slate-600">
                        Dit overzicht toont welke menu-items bovenaan de site
                        verschijnen en naar welke pagina of sectie ze linken.
                      </p>
                    </div>
                    <div className="mb-6 grid gap-5 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200 md:grid-cols-2">
                      {navigationFields.map(renderField)}
                    </div>
                    <div className="grid gap-4">
                      <div className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200">
                        <h3 className="text-lg font-black text-slate-950">
                          Home
                        </h3>
                        <div className="mt-4 grid gap-2 md:grid-cols-2">
                          {[
                            ["Takken", "/#takken"],
                            ["Activiteiten", "/#activiteiten"],
                            ["Kamp", "/#kamp"],
                            ["Foto's", "/fotos"],
                            ["Contact", "/#contact"],
                          ].map(([label, href]) => (
                            <div
                              className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200"
                              key={href}
                            >
                              <span className="font-bold text-slate-800">
                                {label}
                              </span>
                              <span className="text-slate-500">{href}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {sitePageGroups.map((group) => (
                        <div
                          className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200"
                          key={group.label}
                        >
                          <h3 className="text-lg font-black text-slate-950">
                            {group.label}
                          </h3>
                          <div className="mt-4 grid gap-2 md:grid-cols-2">
                            {group.items.map((item) => (
                              <div
                                className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200"
                                key={item.href}
                              >
                                <span className="font-bold text-slate-800">
                                  {item.label}
                                </span>
                                <span className="text-slate-500">
                                  {item.href}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              ) : null}

              {activeSectionId === "contact" ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-3xl font-black">Contact bewerken</h2>
                    <p className="mt-2 text-slate-600">
                      Gegevens voor de contactkaart, sociale links en footer.
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {contactFields.map(renderField)}
                    {renderMediaCard(
                      "contactImageUrl",
                      "Contactfoto",
                      "Foto die de lege ruimte in het contactblok opvult."
                    )}
                    {renderContactPhoneManager()}
                  </div>
                </div>
              ) : null}

              <div className="sticky bottom-4 mt-7 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-950/10 backdrop-blur xl:flex-row xl:items-center xl:justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  {message ||
                    (saveState === "saved"
                      ? "Wijzigingen opgeslagen."
                      : "Wijzigingen worden pas zichtbaar na opslaan.")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    onClick={handleCancelChanges}
                    type="button"
                  >
                    Annuleren
                  </button>
                  <Link
                    className="rounded-full bg-[#edf6e8] px-6 py-3 text-sm font-bold text-[#103001] transition hover:bg-[#d7e8cf]"
                    href={previewPath}
                    target="_blank"
                  >
                    Voorbeeld bekijken
                  </Link>
                  <button
                    className="rounded-full bg-[#103001] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d] disabled:cursor-not-allowed disabled:bg-slate-400"
                    disabled={saveState === "saving"}
                    type="submit"
                  >
                    {saveState === "saving" ? "Opslaan..." : "Opslaan"}
                  </button>
                </div>
              </div>
            </section>

          </form>
        )}
      </div>
    </main>
  );
}
