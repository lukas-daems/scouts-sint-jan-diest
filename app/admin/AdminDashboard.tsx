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
  | "pages"
  | "media"
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
    description: "Logo, naam en algemene stijl",
  },
  {
    id: "homepage",
    label: "Homepage",
    description: "Bovenkant en startpagina",
  },
  {
    id: "takken",
    label: "Takken",
    description: "Takinfo, leiding en programma",
  },
  {
    id: "pages",
    label: "Pagina's",
    description: "Alle aparte pagina's",
  },
  {
    id: "media",
    label: "Foto's",
    description: "Uploads, collages en fotopagina's",
  },
  {
    id: "navigation",
    label: "Menu",
    description: "Knoppen bovenaan de site",
  },
  {
    id: "footer",
    label: "Voettekst",
    description: "Onderkant van de site",
  },
  {
    id: "contact",
    label: "Contact",
    description: "E-mail, telefoons en sociale links",
  },
];

const homepageGroups: Array<{
  title: string;
  description: string;
  fields: FieldConfig[];
}> = [
  {
    title: "Bovenkant homepage",
    description:
      "De eerste indruk: kleine tekst, grote titel, knoppen, foto en vier infokaartjes.",
    fields: [
      { key: "heroEyebrow", label: "Kleine tekst boven titel" },
      { key: "heroOrgLabel", label: "Organisatie naast die tekst" },
      { key: "heroTitleLineOne", label: "Grote titel: eerste regel" },
      { key: "heroTitleLineTwo", label: "Grote titel: tweede regel" },
      {
        key: "heroSubtitle",
        label: "Korte uitleg onder de titel",
        kind: "textarea",
      },
      { key: "heroPrimaryCtaLabel", label: "Belangrijkste knop" },
      { key: "heroSecondaryCtaLabel", label: "Tweede knop" },
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
      { key: "branchesHomeSubtitle", label: "Korte uitleg", kind: "textarea" },
      { key: "branchesHomeCtaLabel", label: "Knop onder de takken" },
    ],
  },
  {
    title: "Activiteitenblok op homepage",
    description: "De titel, intro, grote zomerkampkaart en de kleine activiteitkaartjes.",
    fields: [
      { key: "activitiesTitle", label: "Titel" },
      { key: "activitiesSubtitle", label: "Korte uitleg", kind: "textarea" },
      { key: "activitiesFeaturedBadge", label: "Zomerkampkaart: label" },
      { key: "activitiesFeaturedTitle", label: "Zomerkampkaart: titel" },
      { key: "activitiesFeaturedText", label: "Zomerkampkaart: tekst", kind: "textarea" },
      { key: "activitiesFeaturedMiniTitle", label: "Fotolabel in zomerkampkaart" },
      { key: "activitiesFeaturedMiniText", label: "Korte tekst bij fotolabel", kind: "textarea" },
      { key: "activitiesFeaturedCtaLabel", label: "Knop in zomerkampkaart" },
      { key: "activitiesMoreTitle", label: "Blok onder activiteiten: titel" },
      { key: "activitiesMoreText", label: "Blok onder activiteiten: tekst", kind: "textarea" },
      { key: "activitiesMoreCtaLabel", label: "Blok onder activiteiten: knop" },
    ],
  },
  {
    title: "Praktische info",
    description: "Info die ouders snel moeten kunnen vinden.",
    fields: [
      { key: "practicalTitle", label: "Titel" },
      { key: "practicalSubtitle", label: "Korte uitleg", kind: "textarea" },
      { key: "practicalActivityMoment", label: "Activiteitenmoment" },
      { key: "practicalAddress", label: "Lokaal of adres" },
      { key: "registrationLink", label: "Inschrijvingslink" },
      { key: "practicalCardOneTitle", label: "Info kaart 1 titel" },
      { key: "practicalCardOneText", label: "Info kaart 1 hoofdtekst" },
      { key: "practicalCardOneNote", label: "Info kaart 1 kleine tekst" },
      { key: "practicalCardTwoTitle", label: "Info kaart 2 titel" },
      { key: "practicalCardTwoText", label: "Info kaart 2 hoofdtekst" },
      { key: "practicalCardTwoNote", label: "Info kaart 2 kleine tekst" },
      { key: "practicalCardThreeTitle", label: "Info kaart 3 titel" },
      { key: "practicalCardThreeText", label: "Info kaart 3 hoofdtekst" },
      { key: "practicalCardThreeNote", label: "Info kaart 3 kleine tekst" },
      { key: "practicalCardFourTitle", label: "Info kaart 4 titel" },
      { key: "practicalCardFourText", label: "Info kaart 4 hoofdtekst" },
      { key: "practicalCardFourNote", label: "Info kaart 4 kleine tekst" },
    ],
  },
  {
    title: "Fotopagina, inschrijven en FAQ",
    description: "Titels voor foto's, inschrijven en veelgestelde vragen.",
    fields: [
      { key: "galleryTitle", label: "Fotopagina titel" },
      { key: "gallerySubtitle", label: "Fotopagina intro", kind: "textarea" },
      { key: "joinTitle", label: "Inschrijven: label" },
      { key: "joinHeading", label: "Inschrijven: titel" },
      { key: "joinSubtitle", label: "Inschrijven: korte uitleg", kind: "textarea" },
      { key: "joinStepOneLabel", label: "Stap 1" },
      { key: "joinStepTwoLabel", label: "Stap 2" },
      { key: "joinStepThreeLabel", label: "Stap 3" },
      { key: "joinStepFourLabel", label: "Stap 4" },
      { key: "joinCtaLabel", label: "Inschrijfknop" },
      { key: "joinSecondaryCtaLabel", label: "Tweede knop" },
      { key: "faqBadge", label: "FAQ label" },
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
    title: "Veelgestelde vragen",
    description: "Beheer de losse vragen en antwoorden die in de FAQ verschijnen.",
    type: "faq",
  },
];

const contactFields: FieldConfig[] = [
  { key: "contactBadge", label: "Kleine tekst boven contact" },
  { key: "contactTitle", label: "Titel" },
  { key: "contactSubtitle", label: "Korte uitleg", kind: "textarea" },
  { key: "contactLocation", label: "Adres of locatie" },
  { key: "contactEmail", label: "E-mailadres" },
  { key: "contactPhone", label: "Algemeen telefoonnummer" },
  { key: "instagram", label: "Instagramnaam" },
  { key: "facebook", label: "Facebooknaam" },
  { key: "contactExternalTitle", label: "Linkblok titel" },
  { key: "contactExternalText", label: "Linkblok uitleg", kind: "textarea" },
  { key: "contactExternalButton", label: "Knoptekst linkblok" },
  { key: "contactExternalUrl", label: "Externe link" },
  { key: "contactMailCta", label: "Mailknop" },
  { key: "contactNoticeText", label: "Infotekst onder linkblok", kind: "textarea" },
  { key: "contactTrustText", label: "Vertrouwenszin", kind: "textarea" },
];

const footerFields: FieldConfig[] = [
  { key: "footerDescription", label: "Tekst onder groepsnaam", kind: "textarea" },
  { key: "instagramUrl", label: "Instagramlink" },
  { key: "facebookUrl", label: "Facebooklink" },
  { key: "footerNotice", label: "Kleine melding onderaan", kind: "textarea" },
  { key: "footerCopyright", label: "Copyrightlijn" },
];

const navigationFields: FieldConfig[] = [
  { key: "navHomeLabel", label: "Naam voor Home" },
  { key: "navBranchesLabel", label: "Naam voor Takken" },
  { key: "navActivitiesLabel", label: "Naam voor Activiteiten" },
  { key: "navSupportLabel", label: "Naam voor Steun ons" },
  { key: "navPracticalLabel", label: "Naam voor Praktisch" },
  { key: "navMoreLabel", label: "Naam voor Meer" },
  { key: "navCtaLabel", label: "Knop rechts in het menu" },
];

const mediaFields: Array<{
  key: keyof EditableSiteContent;
  label: string;
  description: string;
}> = [
  {
    key: "heroImageUrl",
    label: "Grote foto op de homepage",
    description: "De brede sfeerfoto bovenaan de startpagina.",
  },
  {
    key: "campImageUrl",
    label: "Kampfoto",
    description: "Wordt gebruikt bij kampgerichte onderdelen en als fallback voor kampbeelden.",
  },
];

const pageAdminDescriptions: Record<string, string> = {
  activiteiten: "Overzicht van wekelijkse werking, kamp, evenementen en steunacties.",
  zomerkamp: "Kampverhaal, documenten, updates en kampgerichte knoppen.",
  dropping: "Evenementpagina met praktische info en externe inschrijflink.",
  ontbijtmanden: "Verkoopactie met bestellink en uitleg rond steun.",
  "steak-en-burgerday": "Eetmoment en steunactie met steunverhaal en reservatielink.",
  shop: "Productcatalogus en externe aanvraaglink voor shopmateriaal.",
  oudercomite: "Warme infopagina over het oudercomite, werking, ledenlijst en contact.",
  verhuur: "Duidelijke pagina over lokalen, materiaal, prijzen en verhuurcontact.",
  "oud-leiding": "Rustige tekstpagina met ruimte voor latere info en contact.",
  links: "Beheerbare linkpagina met categorieen en nuttige verwijzingen.",
};

const pageEditorItems = sitePages.map((page) => ({
  id: page.slug,
  title: page.navLabel,
  description:
    pageAdminDescriptions[page.slug] ||
    `${page.navLabel} beheren: tekst, info, knoppen en beeld.`,
  href: `/${page.slug}`,
  adminGroups: getSitePageAdminGroups(page),
  imageKey: getSitePageImageKey(page),
}));

function getPreviewPath(section: AdminSection, branchSlug: string, version: number) {
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

function stopTextKeyPropagation(
  event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
) {
  event.stopPropagation();
}

function formatMediaSize(size: number) {
  return `${Math.max(1, Math.round(size / 1024))} KB`;
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
  const [contentStatus, setContentStatus] = useState<SiteContentAdminStatus | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("homepage");
  const [activeBranchSlug, setActiveBranchSlug] = useState(branchProfiles[0].slug);
  const [activeHomepageItemId, setActiveHomepageItemId] = useState(homepageEditorItems[0].id);
  const [activePageItemId, setActivePageItemId] = useState(pageEditorItems[0].id);
  const [previewVersion, setPreviewVersion] = useState(1);
  const [mediaLibrary, setMediaLibrary] = useState<MediaLibraryItem[]>([]);
  const [mediaLibraryLoading, setMediaLibraryLoading] = useState(false);

  const isSuperAdmin = adminSession?.role === "superadmin";
  const allowedBranches = useMemo(() => {
    if (!adminSession || isSuperAdmin) {
      return branchProfiles;
    }

    return branchProfiles.filter((branch) => branch.slug === adminSession.branchSlug);
  }, [adminSession, isSuperAdmin]);

  const visibleSections = useMemo(
    () =>
      !adminSession || isSuperAdmin
        ? sections
        : sections.filter((section) => section.id === "takken"),
    [adminSession, isSuperAdmin]
  );

  const activeSectionId = visibleSections.some((section) => section.id === activeSection)
    ? activeSection
    : visibleSections[0]?.id ?? "homepage";

  const activeBranch =
    allowedBranches.find((branch) => branch.slug === activeBranchSlug) ??
    allowedBranches[0] ??
    branchProfiles[0];

  const activePageItem =
    pageEditorItems.find((item) => item.id === activePageItemId) ?? pageEditorItems[0];

  const activeHomepageItem =
    homepageEditorItems.find((item) => item.id === activeHomepageItemId) ??
    homepageEditorItems[0];

  const customGalleryThemes = parseCustomGalleryThemes(content.galleryCustomThemes);
  const activeSectionInfo =
    visibleSections.find((section) => section.id === activeSectionId) ??
    visibleSections[0] ??
    sections[0];

  const previewPath =
    activeSectionId === "pages" && isSuperAdmin
      ? `${activePageItem.href}?adminPreview=${previewVersion}`
      : getPreviewPath(activeSectionId, activeBranch.slug, previewVersion);

  const saveButtonLabel =
    saveState === "saving"
      ? "Opslaan..."
      : activeSectionId === "takken"
        ? "Tak opslaan"
        : activeSectionId === "pages"
          ? "Pagina opslaan"
          : "Wijzigingen opslaan";

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
      setMessage("Kon de beheeromgeving niet laden.");
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
      setMessage("Kon de fotobibliotheek niet laden.");
      return;
    }

    const payload = (await response.json()) as { media: MediaLibraryItem[] };
    setMediaLibrary(payload.media ?? []);
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
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
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
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setSaveState("error");
      setMessage(payload.error ?? "Opslaan is niet gelukt. Ben je nog aangemeld?");
      return;
    }

    const payload = (await response.json()) as { content: EditableSiteContent };
    setContent(payload.content);
    setSaveState("saved");
    setPreviewVersion((current) => current + 1);
    setMessage("Opgeslagen. Open het voorbeeld om de site te controleren.");
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
          "Dit bestand blijft te groot. Probeer een kleinere export of foto met minder pixels."
        );
      }

      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(payload.error ?? "Uploaden is niet gelukt.");
    }

    const payload = (await response.json()) as { url: string };
    return { url: payload.url, optimized: prepared.optimized };
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

    setUploadingKey(String(key));
    setMessage("");

    try {
      const uploaded = await uploadPreparedFile(file, String(key), logo);
      updateField(key, uploaded.url);
      setMessage(
        uploaded.optimized
          ? "Upload gelukt. De afbeelding werd automatisch kleiner gemaakt. Klik op opslaan."
          : "Upload gelukt. Klik op opslaan om dit zichtbaar te maken."
      );
      void loadMediaLibrary();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Uploaden is niet gelukt.");
    } finally {
      setUploadingKey(null);
      event.target.value = "";
    }
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
            onChange={(event) => updateField(field.key, event.target.value)}
            onKeyDown={stopTextKeyPropagation}
            placeholder={field.placeholder}
            value={content[field.key]}
          />
        ) : (
          <input
            className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
            onChange={(event) => updateField(field.key, event.target.value)}
            onKeyDown={stopTextKeyPropagation}
            placeholder={field.placeholder}
            value={content[field.key]}
          />
        )}
      </label>
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
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          </div>
          <label className="inline-flex shrink-0 cursor-pointer justify-center rounded-full bg-white px-4 py-2 text-sm font-bold text-[#103001] ring-1 ring-slate-200 transition hover:bg-[#edf6e8]">
            {uploadingKey === String(key) ? "Uploaden..." : "Upload"}
            <input
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              className="sr-only"
              disabled={uploadingKey === String(key)}
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

  function renderCardList(field: FieldConfig) {
    const items = parseCards(content[field.key]);

    function updateItem(index: number, itemField: keyof SitePageCard, value: string) {
      const nextItems = [...items];
      nextItems[index] = { ...nextItems[index], [itemField]: value };
      updateField(field.key, stringifyCards(nextItems));
    }

    return (
      <section className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2" key={field.key}>
        <RepeaterHeader
          button="Tekstblok toevoegen"
          description="Elk blok heeft een titel en korte uitleg. Lege blokken verschijnen niet op de site."
          onAdd={() => updateField(field.key, stringifyCards([...items, { title: "", text: "" }]))}
          title={field.label}
        />
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-[1fr_1.5fr_auto]" key={`${field.key}-${index}`}>
                <InlineInput label="Titel" value={item.title} onChange={(value) => updateItem(index, "title", value)} />
                <InlineTextarea label="Uitleg" value={item.text} onChange={(value) => updateItem(index, "text", value)} />
                <DeleteButton onClick={() => updateField(field.key, stringifyCards(items.filter((_, itemIndex) => itemIndex !== index)))} label="Verwijder" />
              </div>
            ))
          ) : (
            <EmptyNotice text="Nog geen tekstblokken toegevoegd." />
          )}
        </div>
      </section>
    );
  }

  function renderFactList(field: FieldConfig) {
    const items = parseFacts(content[field.key]);

    function updateItem(index: number, itemField: keyof SitePageFact, value: string) {
      const nextItems = [...items];
      nextItems[index] = { ...nextItems[index], [itemField]: value };
      updateField(field.key, stringifyFacts(nextItems));
    }

    return (
      <section className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2" key={field.key}>
        <RepeaterHeader
          button="Infokaart toevoegen"
          description="Gebruik dit voor datum, locatie, prijs, leeftijd of korte praktische info."
          onAdd={() => updateField(field.key, stringifyFacts([...items, { label: "", value: "", note: "" }]))}
          title={field.label}
        />
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-[1fr_1fr_1fr_auto]" key={`${field.key}-${index}`}>
                <InlineInput label="Kleine titel" value={item.label} onChange={(value) => updateItem(index, "label", value)} />
                <InlineInput label="Belangrijkste tekst" value={item.value} onChange={(value) => updateItem(index, "value", value)} />
                <InlineInput label="Extra uitleg" value={item.note ?? ""} onChange={(value) => updateItem(index, "note", value)} />
                <DeleteButton onClick={() => updateField(field.key, stringifyFacts(items.filter((_, itemIndex) => itemIndex !== index)))} label="Verwijder" />
              </div>
            ))
          ) : (
            <EmptyNotice text="Nog geen infokaarten toegevoegd." />
          )}
        </div>
      </section>
    );
  }

  function renderDocumentList(field: FieldConfig) {
    const items = parseDocuments(content[field.key]);

    function updateItem(index: number, itemField: keyof SitePageDocument, value: string) {
      const nextItems = [...items];
      nextItems[index] = { ...nextItems[index], [itemField]: value };
      updateField(field.key, stringifyDocuments(nextItems));
    }

    return (
      <section className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2" key={field.key}>
        <RepeaterHeader
          button="Document toevoegen"
          description="Voeg documentknoppen toe, zoals kampboekje, medische fiche of bagagelijst. Bezoekers zien alleen de duidelijke knop."
          onAdd={() => updateField(field.key, stringifyDocuments([...items, { label: "", href: "", description: "" }]))}
          title={field.label}
        />
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-2" key={`${field.key}-${index}`}>
                <InlineInput label="Naam op de knop" value={item.label} onChange={(value) => updateItem(index, "label", value)} />
                <InlineInput label="Link naar document" value={item.href} onChange={(value) => updateItem(index, "href", value)} />
                <InlineTextarea label="Korte uitleg" value={item.description} onChange={(value) => updateItem(index, "description", value)} className="md:col-span-2" />
                <DeleteButton onClick={() => updateField(field.key, stringifyDocuments(items.filter((_, itemIndex) => itemIndex !== index)))} label="Verwijder document" />
              </div>
            ))
          ) : (
            <EmptyNotice text="Nog geen documenten toegevoegd." />
          )}
        </div>
      </section>
    );
  }

  function renderProductList(field: FieldConfig) {
    const items = parseProducts(content[field.key]);

    function updateItem(index: number, itemField: keyof SitePageProduct, value: string) {
      const nextItems = [...items];
      nextItems[index] = { ...nextItems[index], [itemField]: value };
      updateField(field.key, stringifyProducts(nextItems));
    }

    return (
      <section className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2" key={field.key}>
        <RepeaterHeader
          button="Product toevoegen"
          description="Producten die op de shop-pagina verschijnen. Vul naam, prijs, opties en knoptekst in."
          onAdd={() => updateField(field.key, stringifyProducts([...items, { name: "", price: "", sizes: "", action: "Aanvragen" }]))}
          title={field.label}
        />
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_1fr_0.8fr_auto]" key={`${field.key}-${index}`}>
                <InlineInput label="Productnaam" value={item.name} onChange={(value) => updateItem(index, "name", value)} />
                <InlineInput label="Prijs" value={item.price} onChange={(value) => updateItem(index, "price", value)} />
                <InlineInput label="Maten of opties" value={item.sizes} onChange={(value) => updateItem(index, "sizes", value)} />
                <InlineInput label="Knoptekst" value={item.action} onChange={(value) => updateItem(index, "action", value)} />
                <DeleteButton onClick={() => updateField(field.key, stringifyProducts(items.filter((_, itemIndex) => itemIndex !== index)))} label="Verwijder" />
              </div>
            ))
          ) : (
            <EmptyNotice text="Nog geen producten toegevoegd." />
          )}
        </div>
      </section>
    );
  }

  function renderLinkList(field: FieldConfig) {
    const items = parseLinks(content[field.key]);

    function updateItem(index: number, itemField: keyof SitePageLinkItem, value: string) {
      const nextItems = [...items];
      nextItems[index] = { ...nextItems[index], [itemField]: value };
      updateField(field.key, stringifyLinks(nextItems));
    }

    return (
      <section className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2" key={field.key}>
        <RepeaterHeader
          button="Link toevoegen"
          description="Links worden per categorie gegroepeerd, bijvoorbeeld formulieren, scouts algemeen of sociale media."
          onAdd={() => updateField(field.key, stringifyLinks([...items, { category: "", label: "", href: "", description: "" }]))}
          title={field.label}
        />
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-2" key={`${field.key}-${index}`}>
                <InlineInput label="Categorie" value={item.category} onChange={(value) => updateItem(index, "category", value)} />
                <InlineInput label="Naam van de link" value={item.label} onChange={(value) => updateItem(index, "label", value)} />
                <InlineInput label="Webadres" value={item.href} onChange={(value) => updateItem(index, "href", value)} />
                <InlineTextarea label="Korte uitleg" value={item.description} onChange={(value) => updateItem(index, "description", value)} />
                <DeleteButton onClick={() => updateField(field.key, stringifyLinks(items.filter((_, itemIndex) => itemIndex !== index)))} label="Verwijder link" />
              </div>
            ))
          ) : (
            <EmptyNotice text="Nog geen links toegevoegd." />
          )}
        </div>
      </section>
    );
  }

  function renderLinesList(field: FieldConfig) {
    const items = parseLines(content[field.key]);

    return (
      <section className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2" key={field.key}>
        <RepeaterHeader
          button="Regel toevoegen"
          description="Handig voor ledenlijsten of korte regels die onder elkaar moeten blijven staan."
          onAdd={() => updateField(field.key, stringifyLines([...items, "Nieuwe regel"]))}
          title={field.label}
        />
        <div className="mt-5 grid gap-3">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div className="grid gap-3 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-[1fr_auto]" key={`${field.key}-${index}`}>
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
                <DeleteButton onClick={() => updateField(field.key, stringifyLines(items.filter((_, itemIndex) => itemIndex !== index)))} label="Verwijder" />
              </div>
            ))
          ) : (
            <EmptyNotice text="Nog geen regels toegevoegd." />
          )}
        </div>
      </section>
    );
  }

  function renderPageField(field: FieldConfig) {
    const key = String(field.key);

    if (key.endsWith("Cards")) return renderCardList(field);
    if (key.endsWith("Facts")) return renderFactList(field);
    if (key.endsWith("Documents")) return renderDocumentList(field);
    if (key.endsWith("Products")) return renderProductList(field);
    if (key.endsWith("Items")) return renderLinkList(field);
    if (key.endsWith("Members")) return renderLinesList(field);

    return renderField(field);
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

  function renderProgramManager(key: keyof EditableSiteContent) {
    const items = parseProgramItems(content[key]);

    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <RepeaterHeader
          button="Vergadering toevoegen"
          description="Elke kaart is een echte vergadering. Lege vergaderingen verschijnen niet op de takpagina."
          onAdd={() => {
            updateField(key, stringifyProgramItems([...items, createProgramItem()]));
            setMessage("Nieuwe vergadering toegevoegd. Vul datum, titel, uur en uitleg in.");
          }}
          title="Programma"
        />
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200 md:grid-cols-[0.55fr_1fr_0.55fr_auto]" key={`${key}-${index}`}>
                <InlineInput label="Datum" placeholder="31/01" value={item.date} onChange={(value) => updateProgramItem(key, index, "date", value)} />
                <InlineInput label="Activiteit" placeholder="Zoektocht" value={item.title} onChange={(value) => updateProgramItem(key, index, "title", value)} />
                <InlineInput label="Uur" placeholder="14u-17u" value={item.time} onChange={(value) => updateProgramItem(key, index, "time", value)} />
                <DeleteButton
                  label="Verwijder"
                  onClick={() => {
                    updateField(key, stringifyProgramItems(items.filter((_, itemIndex) => itemIndex !== index)));
                    setMessage("Vergadering verwijderd. Klik op opslaan.");
                  }}
                />
                <InlineTextarea
                  className="md:col-span-4"
                  label="Uitleg"
                  placeholder="Korte uitleg voor leden en ouders..."
                  value={item.description}
                  onChange={(value) => updateProgramItem(key, index, "description", value)}
                />
              </div>
            ))
          ) : (
            <EmptyNotice text="Nog geen vergaderingen ingevuld." />
          )}
        </div>
      </div>
    );
  }

  function renderImportantDatesManager(key: keyof EditableSiteContent) {
    const value = content[key] ?? "";
    const hasImportantDates = value.trim().length > 0;

    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">Belangrijke data</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Dit kader verschijnt onderaan het programma. Handig voor weekends, kampdata of deadlines.
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
              Kader verwijderen
            </button>
          ) : (
            <button
              className="inline-flex rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
              onClick={() => {
                updateField(key, "Zaterdag ...: ...\nWeekend ...: ...\nKamp ...: ...");
                setMessage("Belangrijke data toegevoegd. Vul aan en klik op opslaan.");
              }}
              type="button"
            >
              Belangrijke data toevoegen
            </button>
          )}
        </div>
        {hasImportantDates ? (
          <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
            Tekst in dit kader
            <textarea
              className="min-h-40 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
              onChange={(event) => updateField(key, event.target.value)}
              onKeyDown={stopTextKeyPropagation}
              value={value}
            />
          </label>
        ) : (
          <EmptyNotice text="Er verschijnt geen belangrijke-data-kader zolang dit leeg is." />
        )}
      </div>
    );
  }

  function updateFaqItem(index: number, field: keyof FAQItem, value: string) {
    const items = parseFaqItems(content.faqItems);
    const nextItems = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );
    updateField("faqItems", stringifyFaqItems(nextItems));
  }

  function renderFaqManager() {
    const items = parseFaqItems(content.faqItems);

    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <RepeaterHeader
          button="Vraag toevoegen"
          description="Beheer de vragen en antwoorden die ouders op de homepage zien."
          onAdd={() => {
            updateField("faqItems", stringifyFaqItems([...items, createFaqItem()]));
            setMessage("FAQ-vraag toegevoegd. Klik op opslaan.");
          }}
          title="Veelgestelde vragen"
        />
        <div className="mt-5 grid gap-4">
          {items.map((item, index) => (
            <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200" key={`faq-${index}`}>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black text-slate-950">Vraag {index + 1}</h3>
                <DeleteButton
                  label="Verwijder"
                  onClick={() => {
                    updateField("faqItems", stringifyFaqItems(items.filter((_, itemIndex) => itemIndex !== index)));
                    setMessage("FAQ-vraag verwijderd. Klik op opslaan.");
                  }}
                />
              </div>
              <InlineInput label="Vraag" value={item.question} onChange={(value) => updateFaqItem(index, "question", value)} />
              <InlineTextarea label="Antwoord" value={item.answer} onChange={(value) => updateFaqItem(index, "answer", value)} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  function parseContactPhoneEntries(value: string) {
    return value
      .split(/\r?\n/)
      .filter((line) => line.length > 0)
      .map((line) => {
        const [name = "", phone = ""] = line.split("|");
        return { name, phone };
      });
  }

  function stringifyContactPhoneEntries(entries: Array<{ name: string; phone: string }>) {
    return entries.map((entry) => `${entry.name}|${entry.phone}`).join("\n");
  }

  function renderContactPhoneManager() {
    const phoneEntries = parseContactPhoneEntries(content.contactPhones);

    return (
      <section className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200 md:col-span-2">
        <RepeaterHeader
          button="Nummer toevoegen"
          description="Voeg contactpersonen van de groepsleiding toe. Ze verschijnen als naam + telefoonnummer in het contactblok."
          onAdd={() => {
            updateField(
              "contactPhones",
              stringifyContactPhoneEntries([...phoneEntries, { name: "Nieuw contact", phone: "" }])
            );
            setMessage("Telefoonnummer toegevoegd. Klik op opslaan.");
          }}
          title="Telefoonnummers groepsleiding"
        />
        <div className="mt-5 grid gap-3">
          {phoneEntries.length > 0 ? (
            phoneEntries.map((entry, index) => (
              <div className="grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-slate-200 md:grid-cols-[1fr_1fr_auto]" key={`contact-phone-${index}`}>
                <InlineInput
                  label="Naam"
                  value={entry.name}
                  onChange={(value) => {
                    const nextEntries = phoneEntries.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, name: value } : item
                    );
                    updateField("contactPhones", stringifyContactPhoneEntries(nextEntries));
                  }}
                />
                <InlineInput
                  label="Telefoonnummer"
                  value={entry.phone}
                  onChange={(value) => {
                    const nextEntries = phoneEntries.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, phone: value } : item
                    );
                    updateField("contactPhones", stringifyContactPhoneEntries(nextEntries));
                  }}
                />
                <DeleteButton
                  label="Verwijder"
                  onClick={() => {
                    updateField(
                      "contactPhones",
                      stringifyContactPhoneEntries(phoneEntries.filter((_, itemIndex) => itemIndex !== index))
                    );
                    setMessage("Telefoonnummer verwijderd. Klik op opslaan.");
                  }}
                />
              </div>
            ))
          ) : (
            <EmptyNotice text="Nog geen telefoonnummers toegevoegd." />
          )}
        </div>
      </section>
    );
  }

  function getGalleryContentKeys(theme: GalleryTheme) {
    if (!theme.coverKey || !theme.collageKey) {
      return null;
    }

    return { coverKey: theme.coverKey, collageKey: theme.collageKey };
  }

  async function uploadGalleryImages(theme: GalleryTheme, event: ChangeEvent<HTMLInputElement>) {
    const keys = getGalleryContentKeys(theme);
    const files = Array.from(event.target.files ?? []);
    if (!keys || files.length === 0) {
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
        setMessage(error instanceof Error ? error.message : "Een foto kon niet voorbereid worden.");
      }
    }

    setUploadingKey(null);
    event.target.value = "";

    if (uploadedUrls.length === 0) {
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
      `${uploadedUrls.length} foto${uploadedUrls.length === 1 ? "" : "'s"} toegevoegd aan ${theme.label}.${optimizedCount > 0 ? ` ${optimizedCount} automatisch verkleind.` : ""} Klik op opslaan.`
    );
    void loadMediaLibrary();
  }

  function removeGalleryImage(theme: GalleryTheme, index: number) {
    const keys = getGalleryContentKeys(theme);
    if (!keys) return;

    setContent((current) => {
      const images = parseImageListValue(current[keys.collageKey]);
      const removedImage = images[index];
      const nextImages = images.filter((_, itemIndex) => itemIndex !== index);
      return {
        ...current,
        [keys.collageKey]: stringifyImageListValue(nextImages),
        [keys.coverKey]: current[keys.coverKey] === removedImage ? nextImages[0] || "" : current[keys.coverKey],
      };
    });
    setMessage(`Foto verwijderd uit ${theme.label}. Klik op opslaan.`);
  }

  function moveGalleryImage(theme: GalleryTheme, index: number, direction: -1 | 1) {
    const keys = getGalleryContentKeys(theme);
    if (!keys) return;

    setContent((current) => {
      const images = parseImageListValue(current[keys.collageKey]);
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= images.length) return current;
      [images[index], images[targetIndex]] = [images[targetIndex], images[index]];
      return { ...current, [keys.collageKey]: stringifyImageListValue(images) };
    });
    setMessage(`Volgorde aangepast in ${theme.label}. Klik op opslaan.`);
  }

  function renderGalleryManager(theme: GalleryTheme) {
    const keys = getGalleryContentKeys(theme);
    if (!keys) return null;
    const images = parseImageListValue(content[keys.collageKey]);

    return (
      <article className="rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5" key={theme.slug}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">Collage {theme.label}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              De hoofdfoto staat op de fotokaart. De collagefoto's verschijnen op /fotos/{theme.slug}.
            </p>
          </div>
          <label className="inline-flex shrink-0 cursor-pointer justify-center rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d]">
            {uploadingKey === keys.collageKey ? "Uploaden..." : "Foto's toevoegen"}
            <input
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              className="sr-only"
              disabled={uploadingKey === keys.collageKey}
              multiple
              onChange={(event) => uploadGalleryImages(theme, event)}
              type="file"
            />
          </label>
        </div>
        <div className="mt-5">
          {renderMediaCard(keys.coverKey, `Hoofdfoto ${theme.label}`, "Deze foto staat op de fotokaart.")}
        </div>
        <GalleryImageGrid
          images={images}
          onMove={(index, direction) => moveGalleryImage(theme, index, direction)}
          onRemove={(index) => removeGalleryImage(theme, index)}
        />
      </article>
    );
  }

  function updateCustomGalleryThemes(items: CustomGalleryTheme[]) {
    updateField("galleryCustomThemes", stringifyCustomGalleryThemes(items));
  }

  function getUniqueCustomGallerySlug(label: string, items: CustomGalleryTheme[], currentId?: string) {
    const baseSlug = slugifyGalleryLabel(label, items.length);
    let slug = baseSlug;
    let counter = 2;

    while (items.some((item) => item.id !== currentId && item.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    return slug;
  }

  function addCustomGalleryTheme() {
    const items = parseCustomGalleryThemes(content.galleryCustomThemes);
    const label = `Nieuwe collage ${items.length + 1}`;
    updateCustomGalleryThemes([
      ...items,
      {
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `custom-${Date.now()}`,
        slug: getUniqueCustomGallerySlug(label, items),
        label,
        alt: `Sfeerbeelden van ${label}`,
        coverUrl: "",
        images: [],
      },
    ]);
    setMessage("Nieuwe collage toegevoegd. Pas de naam en foto's aan en klik op opslaan.");
  }

  async function uploadCustomGalleryFiles(
    theme: CustomGalleryTheme,
    event: ChangeEvent<HTMLInputElement>,
    cover = false
  ) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploadingKey(`${cover ? "custom-cover" : "custom-images"}-${theme.id}`);
    setMessage("");
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const uploaded = await uploadPreparedFile(file, `custom-collage-${theme.slug}`);
        uploadedUrls.push(uploaded.url);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Uploaden is niet gelukt.");
      }
    }

    setUploadingKey(null);
    event.target.value = "";
    if (uploadedUrls.length === 0) return;

    const items = parseCustomGalleryThemes(content.galleryCustomThemes);
    updateCustomGalleryThemes(
      items.map((item) => {
        if (item.id !== theme.id) return item;
        if (cover) return { ...item, coverUrl: uploadedUrls[0] };
        return {
          ...item,
          coverUrl: item.coverUrl || uploadedUrls[0],
          images: [...item.images, ...uploadedUrls],
        };
      })
    );
    setMessage(`${uploadedUrls.length} foto${uploadedUrls.length === 1 ? "" : "'s"} toegevoegd. Klik op opslaan.`);
    void loadMediaLibrary();
  }

  function renderCustomGalleryManager(theme: CustomGalleryTheme) {
    return (
      <article className="rounded-3xl border border-slate-200 bg-white p-5" key={theme.id}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">Extra collage</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Deze collage krijgt een eigen fotopagina op /fotos/{theme.slug}.</p>
          </div>
          <DeleteButton
            label="Collage verwijderen"
            onClick={() => {
              updateCustomGalleryThemes(customGalleryThemes.filter((item) => item.id !== theme.id));
              setMessage("Collage verwijderd. Klik op opslaan.");
            }}
          />
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200">
            <InlineInput
              label="Naam van de collage"
              value={theme.label}
              onChange={(value) => {
                updateCustomGalleryThemes(
                  customGalleryThemes.map((item) =>
                    item.id === theme.id
                      ? {
                          ...item,
                          label: value,
                          slug: getUniqueCustomGallerySlug(value, customGalleryThemes, theme.id),
                          alt: !item.alt || item.alt.startsWith("Sfeerbeelden van ") ? `Sfeerbeelden van ${value}` : item.alt,
                        }
                      : item
                  )
                );
              }}
            />
            <InlineInput
              label="Alt-tekst voor toegankelijkheid"
              value={theme.alt ?? ""}
              onChange={(value) => updateCustomGalleryThemes(customGalleryThemes.map((item) => (item.id === theme.id ? { ...item, alt: value } : item)))}
            />
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {theme.coverUrl ? (
                <img alt={theme.alt ?? theme.label} className="h-40 w-full object-cover" src={theme.coverUrl} />
              ) : (
                <div className="flex h-40 items-center justify-center bg-[#edf6e8] px-6 text-center text-sm font-semibold text-[#2f6b18]">Nog geen hoofdfoto.</div>
              )}
              <div className="grid gap-2 p-3 sm:grid-cols-2">
                <label className="cursor-pointer rounded-full bg-[#103001] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#1e4b0d]">
                  {uploadingKey === `custom-cover-${theme.id}` ? "Uploaden..." : "Hoofdfoto uploaden"}
                  <input accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" className="sr-only" onChange={(event) => uploadCustomGalleryFiles(theme, event, true)} type="file" />
                </label>
                <button
                  className="rounded-full bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-40"
                  disabled={!theme.coverUrl}
                  onClick={() => updateCustomGalleryThemes(customGalleryThemes.map((item) => (item.id === theme.id ? { ...item, coverUrl: "" } : item)))}
                  type="button"
                >
                  Hoofdfoto wissen
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200">
            <RepeaterHeader
              button="Foto's toevoegen"
              description="Voeg foto's toe, zet ze in volgorde of verwijder wat niet meer nodig is."
              onAdd={() => undefined}
              title="Foto's in deze collage"
              fileInput={{
                disabled: uploadingKey === `custom-images-${theme.id}`,
                onChange: (event) => uploadCustomGalleryFiles(theme, event, false),
              }}
            />
            <GalleryImageGrid
              images={theme.images}
              onMove={(index, direction) => {
                updateCustomGalleryThemes(
                  customGalleryThemes.map((item) => {
                    if (item.id !== theme.id) return item;
                    const images = [...item.images];
                    const targetIndex = index + direction;
                    if (targetIndex < 0 || targetIndex >= images.length) return item;
                    [images[index], images[targetIndex]] = [images[targetIndex], images[index]];
                    return { ...item, images };
                  })
                );
              }}
              onRemove={(index) => {
                updateCustomGalleryThemes(
                  customGalleryThemes.map((item) => {
                    if (item.id !== theme.id) return item;
                    const removedImage = item.images[index];
                    const images = item.images.filter((_, itemIndex) => itemIndex !== index);
                    return { ...item, images, coverUrl: item.coverUrl === removedImage ? images[0] || "" : item.coverUrl };
                  })
                );
              }}
            />
          </div>
        </div>
      </article>
    );
  }

  function extractMediaKey(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return "";

    try {
      const pathname = trimmed.startsWith("http") ? new URL(trimmed).pathname : trimmed;
      return pathname.replace(/^\/api\/media\//, "").replace(/^api\/media\//, "").replace(/^\/+/, "");
    } catch {
      return "";
    }
  }

  function getMediaUsageMap() {
    const usageMap = new Map<string, string[]>();
    const mediaPattern = /(?:\/api\/media\/)?(uploads\/[^"'\s)\\\]]+)/g;

    function addUsage(key: string, label: string) {
      if (!key) return;
      const labels = usageMap.get(key) ?? [];
      if (!labels.includes(label)) labels.push(label);
      usageMap.set(key, labels);
    }

    for (const [contentKey, value] of Object.entries(content) as Array<[keyof EditableSiteContent, string]>) {
      if (typeof value !== "string") continue;
      for (const match of value.matchAll(mediaPattern)) {
        addUsage(extractMediaKey(match[1] ?? ""), String(contentKey));
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
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setMessage(payload.error ?? "Bestand verwijderen is niet gelukt.");
      return false;
    }

    setMediaLibrary((current) => current.filter((mediaItem) => mediaItem.key !== item.key));
    return true;
  }

  function renderMediaLibrary() {
    const usageMap = getMediaUsageMap();
    const unusedCount = mediaLibrary.filter((item) => !usageMap.has(item.key)).length;

    return (
      <article className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-950">Mediabibliotheek</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Hier zie je alle geuploade foto's en logo's. Verwijder alleen ongebruikte bestanden.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-[#edf6e8] px-5 py-3 text-sm font-bold text-[#103001] transition hover:bg-[#d7e8cf]" onClick={loadMediaLibrary} type="button">
              Vernieuw
            </button>
            <button
              className="rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d] disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={unusedCount === 0}
              onClick={async () => {
                const usedKeys = new Set(usageMap.keys());
                const unusedMedia = mediaLibrary.filter((item) => !usedKeys.has(item.key));
                let deletedCount = 0;
                for (const item of unusedMedia) {
                  if (await deleteMediaItem(item)) deletedCount += 1;
                }
                setMessage(`${deletedCount} ongebruikte upload${deletedCount === 1 ? "" : "s"} verwijderd.`);
              }}
              type="button"
            >
              Ongebruikte uploads opruimen
            </button>
          </div>
        </div>
        <div className="mt-5">
          {mediaLibraryLoading ? (
            <EmptyNotice text="Mediabibliotheek laden..." />
          ) : mediaLibrary.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {mediaLibrary.map((item) => {
                const usageLabels = usageMap.get(item.key) ?? [];
                const isUsed = usageLabels.length > 0;
                return (
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#fbfdf9]" key={item.key}>
                    <img alt="" className="h-36 w-full bg-white object-cover" src={item.url} />
                    <div className="grid gap-3 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${isUsed ? "bg-[#edf6e8] text-[#103001]" : "bg-amber-50 text-amber-800"}`}>
                          {isUsed ? "In gebruik" : "Ongebruikt"}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                          {formatMediaSize(item.size)}
                        </span>
                      </div>
                      <p className="break-all text-xs leading-5 text-slate-500">{item.key}</p>
                      {isUsed ? (
                        <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#2f6b18]">Gebruikt bij</p>
                          <ul className="mt-2 grid gap-1 text-xs leading-5 text-slate-600">
                            {usageLabels.slice(0, 5).map((label) => (
                              <li key={label}>{label}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      <button
                        className="rounded-full bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        disabled={isUsed}
                        onClick={async () => {
                          if (await deleteMediaItem(item)) setMessage("Ongebruikt bestand definitief verwijderd.");
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
            <EmptyNotice text="Nog geen uploads gevonden." />
          )}
        </div>
      </article>
    );
  }

  function renderDashboardContent() {
    if (activeSectionId === "branding") {
      return (
        <article className="rounded-3xl border border-slate-200 p-5">
          <SectionIntro title="Algemene gegevens" text="Naam, hoofdkleur en herkenbaarheid van de website." />
          <div className="grid gap-5 md:grid-cols-2">
            {renderField({ key: "siteName", label: "Naam van de site" })}
            {renderField({ key: "sitePrimaryColor", label: "Hoofdkleur / scoutskleur" })}
          </div>
          <div className="mt-5">
            {renderMediaCard(
              "siteLogoUrl",
              "Hoofdlogo website",
              "Wordt gebruikt in de navigatie, contactkaart en voettekst. Een breed logo zoals op de oude site mag ook.",
              true
            )}
          </div>
        </article>
      );
    }

    if (activeSectionId === "homepage") {
      return (
        <div className="grid gap-6">
          <article className="rounded-3xl border border-slate-200 p-5">
            <SectionIntro title="Homepage onderdelen" text="Kies eerst welk deel van de startpagina je wil aanpassen." />
            <ChoiceGrid
              items={homepageEditorItems}
              activeId={activeHomepageItem.id}
              onSelect={setActiveHomepageItemId}
            />
            <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
              <SectionIntro title={activeHomepageItem.title} text={activeHomepageItem.description} eyebrow="Gekozen homepageblok" />
              {activeHomepageItem.type === "fields" && activeHomepageItem.group ? (
                <div className="grid gap-5 md:grid-cols-2">{activeHomepageItem.group.fields.map(renderField)}</div>
              ) : (
                renderFaqManager()
              )}
            </div>
          </article>
          <article className="rounded-3xl border border-slate-200 p-5">
            <SectionIntro title="Waar beheer ik de rest?" text="Sommige inhoud staat in een andere categorie, zodat je die maar op een plek hoeft aan te passen." />
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Takken-preview", "Logo's, leeftijden en takteksten beheer je onder Takken.", "Naar Takken"],
                ["Activiteiten-preview", "De aparte activiteiten- en actiepagina's beheer je onder Pagina's.", "Naar Pagina's"],
                ["Fotopagina", "Hoofdfoto's en collages beheer je onder Foto's.", "Naar Foto's"],
                ["Contactblok", "E-mail, telefoonnummers en sociale links beheer je onder Contact.", "Naar Contact"],
              ].map(([title, text, action]) => (
                <div className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200" key={title}>
                  <h3 className="text-lg font-black text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                  <p className="mt-4 text-sm font-bold text-[#2f6b18]">{action}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      );
    }

    if (activeSectionId === "takken") {
      return (
        <div>
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">
              {isSuperAdmin ? "Takken beheren" : "Mijn tak"}
            </p>
            <h2 className="mt-2 text-3xl font-black">
              {isSuperAdmin ? "Takken bewerken" : `${activeBranch.name} bewerken`}
            </h2>
            <p className="mt-2 text-slate-600">
              {isSuperAdmin
                ? "Kies een tak om de tekst, leiding, foto's, programma en belangrijke data aan te passen."
                : "Beheer de tekst, leiding, foto's, programma en belangrijke data van je eigen tak."}
            </p>
          </div>
          {isSuperAdmin ? (
            <div className="mb-6 grid gap-5 rounded-3xl bg-[#fbfdf9] p-5 md:grid-cols-2">
              {renderField({ key: "branchesPageTitle", label: "Titel overzichtspagina" })}
              {renderField({ key: "branchesPageSubtitle", label: "Intro overzichtspagina", kind: "textarea" })}
            </div>
          ) : null}
          <div className="mb-6 flex flex-wrap gap-2">
            {allowedBranches.map((branch) => (
              <button
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  activeBranch.slug === branch.slug ? "bg-[#103001] text-white" : "bg-[#edf6e8] text-[#103001] hover:bg-[#d7e8cf]"
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
              <SectionIntro title={activeBranch.name} text="Teksten die bovenaan en in de takkaarten verschijnen." />
              <div className="grid gap-5 md:grid-cols-2">
                {renderField({ key: activeBranch.contentKeys.age, label: "Leeftijd" })}
                {renderField({ key: activeBranch.contentKeys.shortDescription, label: "Korte uitleg op takkenoverzicht", kind: "textarea" })}
                {renderField({ key: activeBranch.contentKeys.intro, label: "Intro bovenaan de takpagina", kind: "textarea" })}
                {renderField({ key: activeBranch.contentKeys.highlights, label: "Korte tags, elke tag op een nieuwe regel", kind: "textarea" })}
                {renderField({ key: activeBranch.contentKeys.leaderNames, label: "Leidingnamen, elke persoon op een nieuwe regel", kind: "textarea" })}
              </div>
            </article>
            <article className="rounded-3xl border border-slate-200 p-5">
              <SectionIntro title="Vier tekstblokken op de takpagina" text="Deze blokken geven ouders snel praktische uitleg over de tak." />
              <div className="grid gap-5">
                {activeBranch.contentKeys.blocks.map((block, index) => (
                  <div className="grid gap-5 rounded-3xl bg-[#fbfdf9] p-5 md:grid-cols-2" key={`${activeBranch.slug}-${index}`}>
                    {renderField({ key: block.title, label: `Tekstblok ${index + 1}: titel` })}
                    {renderField({ key: block.text, label: `Tekstblok ${index + 1}: uitleg`, kind: "textarea" })}
                  </div>
                ))}
              </div>
            </article>
            <article className="grid gap-5 rounded-3xl border border-slate-200 p-5">
              {renderProgramManager(activeBranch.contentKeys.program)}
              {renderImportantDatesManager(activeBranch.contentKeys.importantDates)}
            </article>
            <article className="grid gap-5 rounded-3xl border border-slate-200 p-5 md:grid-cols-2">
              {renderMediaCard(activeBranch.logoKey, `Logo ${activeBranch.name}`, "PNG met transparante achtergrond werkt hier goed.", true)}
              {renderMediaCard(activeBranch.contentKeys.imageUrl, `Sfeerfoto ${activeBranch.name}`, "Optionele foto bovenaan de detailpagina.")}
              {renderMediaCard(activeBranch.contentKeys.leaderPhotoUrl, `Foto leiding ${activeBranch.name}`, "Groepsfoto of foto van de actieve leiding van dit jaar.")}
            </article>
          </div>
        </div>
      );
    }

    if (activeSectionId === "pages") {
      return isSuperAdmin ? (
        <article className="rounded-3xl border border-slate-200 p-5">
          <SectionIntro title="Aparte pagina's" text="Kies eerst welke pagina of actie je wil beheren. Daarna verschijnen alleen de velden voor dat onderdeel." />
          <ChoiceGrid items={pageEditorItems} activeId={activePageItem.id} onSelect={setActivePageItemId} />
          <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <SectionIntro title={activePageItem.title} text={activePageItem.description} eyebrow="Gekozen pagina" />
              <Link className="inline-flex rounded-full bg-[#edf6e8] px-5 py-3 text-sm font-bold text-[#103001] transition hover:bg-[#d7e8cf]" href={activePageItem.href} target="_blank">
                Bekijk pagina
              </Link>
            </div>
            <div className="grid gap-6">
              {renderMediaCard(activePageItem.imageKey, `Hoofdbeeld ${activePageItem.title}`, "Afbeelding rechts in de hero van deze pagina.")}
              {activePageItem.adminGroups.map((group) => (
                <section className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200" key={group.title}>
                  <SectionIntro title={group.title} text={group.description} />
                  <div className="grid gap-5 md:grid-cols-2">{group.fields.map(renderPageField)}</div>
                </section>
              ))}
            </div>
          </div>
        </article>
      ) : null;
    }

    if (activeSectionId === "media") {
      return (
        <div>
          <SectionIntro title="Foto's beheren" text="Beheer foto's, logo's en collages die op de site verschijnen." />
          <div className="grid gap-5 md:grid-cols-2">{mediaFields.map((field) => renderMediaCard(field.key, field.label, field.description))}</div>
          <div className="mt-8 grid gap-5">{galleryThemes.map(renderGalleryManager)}</div>
          <article className="mt-8 rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5">
            <RepeaterHeader button="Nieuwe collage toevoegen" description="Elke extra collage krijgt automatisch een eigen fotopagina onder /fotos." onAdd={addCustomGalleryTheme} title="Extra collages" />
            <div className="mt-6 grid gap-5">
              {customGalleryThemes.length > 0 ? customGalleryThemes.map(renderCustomGalleryManager) : <EmptyNotice text="Er zijn nog geen extra collages." />}
            </div>
          </article>
          <div className="mt-8">{renderMediaLibrary()}</div>
        </div>
      );
    }

    if (activeSectionId === "navigation") {
      return (
        <article className="rounded-3xl border border-slate-200 p-5">
          <SectionIntro title="Hoofdmenu" text="Pas de namen van de belangrijkste menu-items aan en bekijk welke links de site gebruikt." />
          <div className="mb-6 grid gap-5 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200 md:grid-cols-2">
            {navigationFields.map(renderField)}
          </div>
          <div className="grid gap-4">
            <MenuOverview title="Home" items={[["Takken", "/#takken"], ["Activiteiten", "/#activiteiten"], ["Kamp", "/zomerkamp"], ["Foto's", "/fotos"], ["Contact", "/#contact"]]} />
            {sitePageGroups.map((group) => (
              <MenuOverview key={group.label} title={group.label} items={group.items.map((item) => [item.label, item.href])} />
            ))}
          </div>
        </article>
      );
    }

    if (activeSectionId === "footer") {
      return (
        <div>
          <SectionIntro title="Voettekst bewerken" text="Beheer de tekst onderaan de site en de sociale links." />
          <div className="grid gap-5 md:grid-cols-2">{footerFields.map(renderField)}</div>
        </div>
      );
    }

    if (activeSectionId === "contact") {
      return (
        <div>
          <SectionIntro title="Contact bewerken" text="Gegevens voor de contactkaart, sociale links en het groene contactblok." />
          <div className="grid gap-5 md:grid-cols-2">
            {contactFields.map(renderField)}
            {renderMediaCard("contactImageUrl", "Contactfoto", "Foto die de lege ruimte in het contactblok opvult.")}
            {renderContactPhoneManager()}
          </div>
        </div>
      );
    }

    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f2f8ee] px-5 py-16 text-slate-950">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">Beheeromgeving laden...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f2f8ee] px-8 py-8 text-slate-950">
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-[#103001] p-6 text-white shadow-xl shadow-green-950/15 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-green-100">Beheer</p>
            <h1 className="mt-2 text-3xl font-black">Scouts Sint-Jan Berchmans</h1>
            <p className="mt-2 max-w-2xl text-green-100">
              Kies links wat je wil aanpassen. Takleiding ziet alleen de eigen tak; groepsleiding ziet alles.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {authenticated && adminSession ? (
              <div className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white">{adminSession.displayName}</div>
            ) : null}
            <Link className="rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-green-50" href="/">
              Bekijk site
            </Link>
            {authenticated ? (
              <button className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10" onClick={handleLogout} type="button">
                Uitloggen
              </button>
            ) : null}
          </div>
        </div>

        {!configured ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <h2 className="text-xl font-bold">Beheer is nog niet geconfigureerd</h2>
            <p className="mt-3 leading-7">
              Er ontbreken nog geheime instellingen voor de login. Online stel je die in bij de hosting-variabelen.
            </p>
            {missingConfig.length > 0 ? <p className="mt-3 text-sm font-bold">Ontbreekt nu: {missingConfig.join(", ")}</p> : null}
            <div className="mt-5 grid gap-2 md:grid-cols-2">
              {setupHelp.map((item) => (
                <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm ring-1 ring-amber-200" key={item.username}>
                  <span className="font-black">{item.username}</span>
                  <span className="block text-amber-800">{item.role}: {item.env}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {!authenticated ? (
          configured ? (
            <form className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleLogin}>
              <h2 className="text-2xl font-black">Aanmelden</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Log in met je gebruikersnaam en wachtwoord. Groepsleiding kan alles beheren; takleiding ziet alleen de eigen tak.
              </p>
              <label className="mt-6 grid gap-2 text-sm font-semibold text-slate-700">
                Gebruikersnaam
                <input className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]" onChange={(event) => setUsername(event.target.value)} onKeyDown={stopTextKeyPropagation} placeholder="groepsleiding" type="text" value={username} />
              </label>
              <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
                Wachtwoord
                <input className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]" onChange={(event) => setPassword(event.target.value)} onKeyDown={stopTextKeyPropagation} type="password" value={password} />
              </label>
              <button className="mt-6 w-full rounded-full bg-[#103001] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#1e4b0d]" type="submit">
                Inloggen
              </button>
              <p className="mt-4 rounded-2xl bg-[#fbfdf9] p-4 text-sm leading-6 text-slate-500">
                De wachtwoorden staan niet in de code. Ze worden gelezen uit geheime omgevingsvariabelen.
              </p>
              {message ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{message}</p> : null}
            </form>
          ) : null
        ) : (
          <form className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]" onSubmit={handleSave}>
            <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-6">
              {visibleSections.map((section) => (
                <button
                  className={`mb-2 w-full rounded-3xl px-4 py-4 text-left transition ${
                    activeSectionId === section.id ? "bg-[#103001] text-white shadow-lg shadow-green-950/15" : "text-slate-700 hover:bg-[#edf6e8]"
                  }`}
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  type="button"
                >
                  <span className="block text-sm font-black">{!isSuperAdmin && section.id === "takken" ? "Mijn tak" : section.label}</span>
                  <span className={`mt-1 block text-xs leading-5 ${activeSectionId === section.id ? "text-green-100" : "text-slate-500"}`}>
                    {!isSuperAdmin && section.id === "takken" ? "Tekst, foto's en programma" : section.description}
                  </span>
                </button>
              ))}
            </aside>
            <section className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-7 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">Actieve categorie</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {!isSuperAdmin && activeSectionId === "takken" ? "Mijn tak" : activeSectionInfo.label}
                </h2>
                <p className="mt-2 text-slate-600">
                  {!isSuperAdmin && activeSectionId === "takken"
                    ? "Beheer de info, foto's, leiding en programma van jouw tak."
                    : activeSectionInfo.description}
                </p>
              </div>
              {contentStatus?.source === "defaults" ? (
                <div className="mb-7 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                  <h3 className="text-lg font-black">Databank niet bereikbaar</h3>
                  <p className="mt-2 text-sm leading-6">
                    De beheeromgeving toont nu standaardinhoud omdat de databank niet gelezen kon worden. Controleer dit voor je verder bewerkt.
                  </p>
                  {contentStatus.error ? <p className="mt-3 rounded-2xl bg-white/70 p-3 text-xs leading-5">{contentStatus.error}</p> : null}
                </div>
              ) : null}
              {renderDashboardContent()}
              <div className="sticky bottom-4 mt-7 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-950/10 backdrop-blur xl:flex-row xl:items-center xl:justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  {message || (saveState === "saved" ? "Wijzigingen opgeslagen." : "Wijzigingen worden pas zichtbaar na opslaan.")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50" onClick={handleCancelChanges} type="button">
                    Annuleren
                  </button>
                  <Link className="rounded-full bg-[#edf6e8] px-6 py-3 text-sm font-bold text-[#103001] transition hover:bg-[#d7e8cf]" href={previewPath} target="_blank">
                    Voorbeeld bekijken
                  </Link>
                  <button className="rounded-full bg-[#103001] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d] disabled:cursor-not-allowed disabled:bg-slate-400" disabled={saveState === "saving"} type="submit">
                    {saveButtonLabel}
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

function SectionIntro({
  title,
  text,
  eyebrow,
}: {
  title: string;
  text?: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-5">
      {eyebrow ? (
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      {text ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{text}</p> : null}
    </div>
  );
}

function ChoiceGrid({
  items,
  activeId,
  onSelect,
}: {
  items: Array<{ id: string; title: string; description: string; href?: string }>;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <button
          className={`rounded-3xl border p-5 text-left transition ${
            activeId === item.id
              ? "border-[#d7e8cf] bg-[#edf6e8] shadow-lg shadow-green-950/8"
              : "border-slate-200 bg-[#fbfdf9] hover:bg-[#f2f8ee]"
          }`}
          key={item.id}
          onClick={() => onSelect(item.id)}
          type="button"
        >
          <span className="block text-lg font-black text-slate-950">{item.title}</span>
          <span className="mt-2 block text-sm leading-6 text-slate-600">{item.description}</span>
          {item.href ? <span className="mt-4 block text-sm font-bold text-[#2f6b18]">{item.href}</span> : null}
        </button>
      ))}
    </div>
  );
}

function RepeaterHeader({
  title,
  description,
  button,
  onAdd,
  fileInput,
}: {
  title: string;
  description: string;
  button: string;
  onAdd: () => void;
  fileInput?: {
    disabled?: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  };
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h5 className="text-lg font-black text-slate-950">{title}</h5>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {fileInput ? (
        <label className="inline-flex shrink-0 cursor-pointer justify-center rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d]">
          {button}
          <input
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="sr-only"
            disabled={fileInput.disabled}
            multiple
            onChange={fileInput.onChange}
            type="file"
          />
        </label>
      ) : (
        <button
          className="rounded-full bg-[#103001] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e4b0d]"
          onClick={onAdd}
          type="button"
        >
          {button}
        </button>
      )}
    </div>
  );
}

function InlineInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input
        className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={stopTextKeyPropagation}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function InlineTextarea({
  label,
  value,
  onChange,
  className = "",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-slate-700 ${className}`}>
      {label}
      <textarea
        className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={stopTextKeyPropagation}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function DeleteButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="self-end rounded-full border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function EmptyNotice({ text }: { text: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-[#fbfdf9] p-5 text-sm leading-6 text-slate-500">
      {text}
    </div>
  );
}

function GalleryImageGrid({
  images,
  onMove,
  onRemove,
}: {
  images: string[];
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="mt-5">
      {images.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white" key={`${image}-${index}`}>
              <img alt="" className="h-36 w-full object-cover" src={image} />
              <div className="grid grid-cols-3 gap-2 p-3">
                <button
                  className="rounded-full bg-[#edf6e8] px-3 py-2 text-xs font-bold text-[#103001] disabled:opacity-40"
                  disabled={index === 0}
                  onClick={() => onMove(index, -1)}
                  type="button"
                >
                  Omhoog
                </button>
                <button
                  className="rounded-full bg-[#edf6e8] px-3 py-2 text-xs font-bold text-[#103001] disabled:opacity-40"
                  disabled={index === images.length - 1}
                  onClick={() => onMove(index, 1)}
                  type="button"
                >
                  Omlaag
                </button>
                <button
                  className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                  onClick={() => onRemove(index)}
                  type="button"
                >
                  Verwijder
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyNotice text="Nog geen foto's toegevoegd." />
      )}
    </div>
  );
}

function MenuOverview({ title, items }: { title: string; items: string[][] }) {
  return (
    <div className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200">
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {items.map(([label, href]) => (
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200" key={href}>
            <span className="font-bold text-slate-800">{label}</span>
            <span className="text-slate-500">{href}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
