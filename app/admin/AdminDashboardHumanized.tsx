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
  | "dashboard"
  | "homepage"
  | "branches"
  | "programs"
  | "photos"
  | "pages"
  | "contact"
  | "site";

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

type ChoiceItem = {
  id: string;
  title: string;
  description: string;
  href?: string;
};

const sections: Array<{
  id: AdminSection;
  label: string;
  description: string;
}> = [
  { id: "dashboard", label: "Start", description: "Kies wat je wil doen" },
  { id: "homepage", label: "Homepage", description: "Tekst en blokken op de startpagina" },
  { id: "branches", label: "Takken", description: "Info, leiding en foto's per tak" },
  { id: "programs", label: "Programma", description: "Vergaderingen en belangrijke data" },
  { id: "photos", label: "Foto's", description: "Uploads, collages en fotopagina" },
  { id: "pages", label: "Pagina's", description: "Activiteiten, acties en infopagina's" },
  { id: "contact", label: "Contact", description: "Mail, telefoons en contactblok" },
  { id: "site", label: "Site-instellingen", description: "Logo, menu en voettekst" },
];

const homepageGroups: Array<{
  title: string;
  description: string;
  fields: FieldConfig[];
  type?: "fields" | "faq";
}> = [
  {
    title: "Bovenkant homepage",
    description: "De eerste foto, titel, knoppen en vier kleine infokaartjes.",
    fields: [
      { key: "heroEyebrow", label: "Kleine tekst boven de titel" },
      { key: "heroOrgLabel", label: "Tekst naast die kleine tekst" },
      { key: "heroTitleLineOne", label: "Titel regel 1" },
      { key: "heroTitleLineTwo", label: "Titel regel 2" },
      { key: "heroSubtitle", label: "Korte uitleg onder de titel", kind: "textarea" },
      { key: "heroPrimaryCtaLabel", label: "Tekst op de groene knop" },
      { key: "heroSecondaryCtaLabel", label: "Tekst op de tweede knop" },
      { key: "heroStatOneTitle", label: "Kaartje 1: hoofdtekst" },
      { key: "heroStatOneLabel", label: "Kaartje 1: kleine tekst" },
      { key: "heroStatTwoTitle", label: "Kaartje 2: hoofdtekst" },
      { key: "heroStatTwoLabel", label: "Kaartje 2: kleine tekst" },
      { key: "heroStatThreeTitle", label: "Kaartje 3: hoofdtekst" },
      { key: "heroStatThreeLabel", label: "Kaartje 3: kleine tekst" },
      { key: "heroStatFourTitle", label: "Kaartje 4: hoofdtekst" },
      { key: "heroStatFourLabel", label: "Kaartje 4: kleine tekst" },
    ],
  },
  {
    title: "Takkenblok",
    description: "De compacte preview van Kapoenen tot Jins op de homepage.",
    fields: [
      { key: "branchesHomeTitle", label: "Titel boven de takken" },
      { key: "branchesHomeSubtitle", label: "Korte uitleg onder de titel", kind: "textarea" },
      { key: "branchesHomeCtaLabel", label: "Knop onder de takken" },
    ],
  },
  {
    title: "Activiteitenblok",
    description: "De titel, uitleg, zomerkampkaart en CTA onder de activiteiten.",
    fields: [
      { key: "activitiesTitle", label: "Titel boven activiteiten" },
      { key: "activitiesSubtitle", label: "Korte uitleg onder de titel", kind: "textarea" },
      { key: "activitiesFeaturedBadge", label: "Label op de zomerkampkaart" },
      { key: "activitiesFeaturedTitle", label: "Titel op de zomerkampkaart" },
      { key: "activitiesFeaturedText", label: "Tekst op de zomerkampkaart", kind: "textarea" },
      { key: "activitiesFeaturedMiniTitle", label: "Kleine titel bij de foto" },
      { key: "activitiesFeaturedMiniText", label: "Korte tekst bij de foto", kind: "textarea" },
      { key: "activitiesFeaturedCtaLabel", label: "Knop op de zomerkampkaart" },
      { key: "activitiesMoreTitle", label: "CTA-balk onderaan: titel" },
      { key: "activitiesMoreText", label: "CTA-balk onderaan: uitleg", kind: "textarea" },
      { key: "activitiesMoreCtaLabel", label: "CTA-balk onderaan: knop" },
    ],
  },
  {
    title: "Praktische info en inschrijven",
    description: "Belangrijke ouderinfo en de stappen om lid te worden.",
    fields: [
      { key: "practicalTitle", label: "Titel praktische info" },
      { key: "practicalSubtitle", label: "Korte uitleg praktische info", kind: "textarea" },
      { key: "practicalActivityMoment", label: "Wanneer is het scouts?" },
      { key: "practicalAddress", label: "Lokaal of adres" },
      { key: "registrationLink", label: "Externe inschrijvingslink" },
      { key: "practicalCardOneTitle", label: "Praktische kaart 1: titel" },
      { key: "practicalCardOneText", label: "Praktische kaart 1: hoofdtekst" },
      { key: "practicalCardOneNote", label: "Praktische kaart 1: kleine tekst" },
      { key: "practicalCardTwoTitle", label: "Praktische kaart 2: titel" },
      { key: "practicalCardTwoText", label: "Praktische kaart 2: hoofdtekst" },
      { key: "practicalCardTwoNote", label: "Praktische kaart 2: kleine tekst" },
      { key: "practicalCardThreeTitle", label: "Praktische kaart 3: titel" },
      { key: "practicalCardThreeText", label: "Praktische kaart 3: hoofdtekst" },
      { key: "practicalCardThreeNote", label: "Praktische kaart 3: kleine tekst" },
      { key: "practicalCardFourTitle", label: "Praktische kaart 4: titel" },
      { key: "practicalCardFourText", label: "Praktische kaart 4: hoofdtekst" },
      { key: "practicalCardFourNote", label: "Praktische kaart 4: kleine tekst" },
      { key: "joinTitle", label: "Label boven inschrijven" },
      { key: "joinHeading", label: "Titel inschrijven" },
      { key: "joinSubtitle", label: "Korte uitleg inschrijven", kind: "textarea" },
      { key: "joinStepOneLabel", label: "Stap 1" },
      { key: "joinStepTwoLabel", label: "Stap 2" },
      { key: "joinStepThreeLabel", label: "Stap 3" },
      { key: "joinStepFourLabel", label: "Stap 4" },
      { key: "joinCtaLabel", label: "Inschrijfknop" },
      { key: "joinSecondaryCtaLabel", label: "Tweede knop" },
    ],
  },
  {
    title: "Fotopagina en FAQ-titels",
    description: "De titels rond sfeerbeelden en veelgestelde vragen.",
    fields: [
      { key: "galleryTitle", label: "Titel fotopagina" },
      { key: "gallerySubtitle", label: "Intro fotopagina", kind: "textarea" },
      { key: "faqBadge", label: "Label boven veelgestelde vragen" },
      { key: "faqTitle", label: "Titel veelgestelde vragen" },
      { key: "faqSubtitle", label: "Intro veelgestelde vragen", kind: "textarea" },
      { key: "faqCtaLabel", label: "Knop bij veelgestelde vragen" },
    ],
  },
  {
    title: "Veelgestelde vragen",
    description: "Losse vragen en antwoorden die ouders op de homepage zien.",
    fields: [],
    type: "faq",
  },
];

const contactFields: FieldConfig[] = [
  { key: "contactBadge", label: "Kleine tekst boven contact" },
  { key: "contactTitle", label: "Titel contactblok" },
  { key: "contactSubtitle", label: "Korte uitleg boven contact", kind: "textarea" },
  { key: "contactLocation", label: "Adres of locatie" },
  { key: "contactEmail", label: "E-mailadres" },
  { key: "contactPhone", label: "Algemeen telefoonnummer" },
  { key: "instagram", label: "Instagramnaam" },
  { key: "facebook", label: "Facebooknaam" },
];

const contactLinkFields: FieldConfig[] = [
  { key: "contactExternalTitle", label: "Titel van de linkkaart" },
  { key: "contactExternalText", label: "Uitleg in de linkkaart", kind: "textarea" },
  { key: "contactExternalButton", label: "Tekst op de knop" },
  { key: "contactExternalUrl", label: "Link achter de knop" },
  { key: "contactMailCta", label: "Tekst op de mailknop" },
  { key: "contactNoticeText", label: "Infotekst onder de linkkaart", kind: "textarea" },
  { key: "contactTrustText", label: "Vertrouwenszin onderaan", kind: "textarea" },
];

const siteGeneralFields: FieldConfig[] = [
  { key: "siteName", label: "Naam van de scouts" },
  { key: "sitePrimaryColor", label: "Hoofdkleur" },
];

const navigationFields: FieldConfig[] = [
  { key: "navHomeLabel", label: "Menu: Home" },
  { key: "navBranchesLabel", label: "Menu: Takken" },
  { key: "navActivitiesLabel", label: "Menu: Activiteiten" },
  { key: "navSupportLabel", label: "Menu: Steun ons" },
  { key: "navPracticalLabel", label: "Menu: Praktisch" },
  { key: "navMoreLabel", label: "Menu: Meer" },
  { key: "navCtaLabel", label: "Knop rechts in het menu" },
];

const footerFields: FieldConfig[] = [
  { key: "footerDescription", label: "Tekst onder de groepsnaam", kind: "textarea" },
  { key: "instagramUrl", label: "Instagramlink" },
  { key: "facebookUrl", label: "Facebooklink" },
  { key: "footerNotice", label: "Kleine melding onderaan", kind: "textarea" },
  { key: "footerCopyright", label: "Copyrightlijn" },
];

const mediaFields: Array<{ key: keyof EditableSiteContent; label: string; description: string }> = [
  { key: "heroImageUrl", label: "Grote foto op de homepage", description: "De brede sfeerfoto bovenaan de startpagina." },
  { key: "campImageUrl", label: "Kampfoto", description: "Wordt gebruikt bij kampgerichte onderdelen en als fallback voor kampbeelden." },
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
  description: pageAdminDescriptions[page.slug] || `${page.navLabel} beheren.`,
  href: `/${page.slug}`,
  adminGroups: getSitePageAdminGroups(page),
  imageKey: getSitePageImageKey(page),
}));

const branchBlockNames = ["Wat doen ze?", "Begeleiding", "Kom eens proberen", "Extra tekst"];

function stopTextKeyPropagation(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
  event.stopPropagation();
}

function formatMediaSize(size: number) {
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function getPreviewPath(section: AdminSection, branchSlug: string, version: number, pageHref?: string) {
  const marker = `adminPreview=${version}`;
  if (section === "branches" || section === "programs") return `/takken/${branchSlug}?${marker}`;
  if (section === "photos") return `/fotos?${marker}`;
  if (section === "pages" && pageHref) return `${pageHref}?${marker}`;
  if (section === "contact") return `/?${marker}#contact`;
  return `/?${marker}#home`;
}

export default function AdminDashboardHumanized() {
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
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [activeHomepageId, setActiveHomepageId] = useState(homepageGroups[0].title);
  const [activeBranchSlug, setActiveBranchSlug] = useState(branchProfiles[0].slug);
  const [activeBranchTab, setActiveBranchTab] = useState("basis");
  const [activePageId, setActivePageId] = useState(pageEditorItems[0].id);
  const [activePageGroupIndex, setActivePageGroupIndex] = useState(0);
  const [activePhotoTab, setActivePhotoTab] = useState("basis");
  const [activeGallerySlug, setActiveGallerySlug] = useState(galleryThemes[0]?.slug ?? "");
  const [activeContactTab, setActiveContactTab] = useState("gegevens");
  const [activeSiteTab, setActiveSiteTab] = useState("algemeen");
  const [previewVersion, setPreviewVersion] = useState(1);
  const [mediaLibrary, setMediaLibrary] = useState<MediaLibraryItem[]>([]);
  const [mediaLibraryLoading, setMediaLibraryLoading] = useState(false);

  const isSuperAdmin = adminSession?.role === "superadmin";
  const allowedBranches = useMemo(() => {
    if (!adminSession || isSuperAdmin) return branchProfiles;
    return branchProfiles.filter((branch) => branch.slug === adminSession.branchSlug);
  }, [adminSession, isSuperAdmin]);

  const visibleSections = useMemo(() => {
    if (!adminSession || isSuperAdmin) return sections;
    return sections.filter((section) => ["dashboard", "branches", "programs"].includes(section.id));
  }, [adminSession, isSuperAdmin]);

  const activeSectionId = visibleSections.some((section) => section.id === activeSection)
    ? activeSection
    : visibleSections[0]?.id ?? "dashboard";

  const activeBranch =
    allowedBranches.find((branch) => branch.slug === activeBranchSlug) ?? allowedBranches[0] ?? branchProfiles[0];
  const activeHomepageGroup = homepageGroups.find((group) => group.title === activeHomepageId) ?? homepageGroups[0];
  const activePageItem = pageEditorItems.find((item) => item.id === activePageId) ?? pageEditorItems[0];
  const activePageGroups = activePageItem.adminGroups;
  const activePageGroup = activePageGroups[Math.min(activePageGroupIndex, Math.max(activePageGroups.length - 1, 0))];
  const activeGalleryTheme = galleryThemes.find((theme) => theme.slug === activeGallerySlug) ?? galleryThemes[0];
  const customGalleryThemes = parseCustomGalleryThemes(content.galleryCustomThemes);
  const activeSectionInfo = visibleSections.find((section) => section.id === activeSectionId) ?? visibleSections[0] ?? sections[0];
  const previewPath = getPreviewPath(activeSectionId, activeBranch.slug, previewVersion, activePageItem.href);
  const showSaveBar = authenticated && activeSectionId !== "dashboard";

  const saveButtonLabel =
    saveState === "saving"
      ? "Opslaan..."
      : activeSectionId === "branches"
        ? "Tak opslaan"
        : activeSectionId === "programs"
          ? "Programma opslaan"
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
        setActiveBranchSlug(session.session.branchSlug);
      }

      setLoading(false);
      if (session.authenticated) await loadContent();
    }

    loadSession().catch(() => {
      setMessage("Kon de beheeromgeving niet laden.");
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (authenticated && activeSectionId === "photos" && activePhotoTab === "bibliotheek") {
      void loadMediaLibrary();
    }
  }, [authenticated, activeSectionId, activePhotoTab]);

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
    setActiveSection("dashboard");
    if (payload.session.role === "branch" && payload.session.branchSlug) setActiveBranchSlug(payload.session.branchSlug);
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
    setMessage("Opgeslagen. Je kan het voorbeeld openen om te controleren.");
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

    const response = await fetch("/api/admin/media", { body: formData, method: "POST" });
    if (!response.ok) {
      if (response.status === 413) {
        throw new Error("Dit bestand blijft te groot. Probeer een kleinere foto of export.");
      }
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(payload.error ?? "Uploaden is niet gelukt.");
    }

    const payload = (await response.json()) as { url: string };
    return { url: payload.url, optimized: prepared.optimized };
  }

  async function uploadMedia(key: keyof EditableSiteContent, event: ChangeEvent<HTMLInputElement>, logo = false) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingKey(String(key));
    setMessage("");

    try {
      const uploaded = await uploadPreparedFile(file, String(key), logo);
      updateField(key, uploaded.url);
      setMessage(uploaded.optimized ? "Upload gelukt en automatisch kleiner gemaakt. Klik op opslaan." : "Upload gelukt. Klik op opslaan.");
      void loadMediaLibrary();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Uploaden is niet gelukt.");
    } finally {
      setUploadingKey(null);
      event.target.value = "";
    }
  }

  function selectSection(section: AdminSection) {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderField(field: FieldConfig) {
    const value = content[field.key] ?? "";
    return (
      <label className={`grid gap-2 text-sm font-semibold text-slate-700 ${field.kind === "textarea" ? "md:col-span-2" : ""}`} key={field.key}>
        {field.label}
        {field.help ? <span className="-mt-1 text-xs font-medium leading-5 text-slate-500">{field.help}</span> : null}
        {field.kind === "textarea" ? (
          <textarea
            className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
            onChange={(event) => updateField(field.key, event.target.value)}
            onKeyDown={stopTextKeyPropagation}
            placeholder={field.placeholder}
            value={value}
          />
        ) : (
          <input
            className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
            onChange={(event) => updateField(field.key, event.target.value)}
            onKeyDown={stopTextKeyPropagation}
            placeholder={field.placeholder}
            value={value}
          />
        )}
      </label>
    );
  }

  function renderMediaCard(key: keyof EditableSiteContent, label: string, description: string, logo = false) {
    const value = content[key] ?? "";
    return (
      <div className="rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5" key={key}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-slate-950">{label}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          </div>
          <label className="inline-flex shrink-0 cursor-pointer justify-center rounded-full bg-white px-4 py-2 text-sm font-bold text-[#103001] ring-1 ring-slate-200 transition hover:bg-[#edf6e8]">
            {uploadingKey === String(key) ? "Uploaden..." : "Uploaden"}
            <input
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              className="sr-only"
              disabled={uploadingKey === String(key)}
              onChange={(event) => uploadMedia(key, event, logo)}
              type="file"
            />
          </label>
        </div>
        {value ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <img alt="" className={`h-36 w-full ${logo ? "object-contain p-4" : "object-cover"}`} src={value} />
            <button className="w-full border-t border-slate-200 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50" onClick={() => clearField(key, label)} type="button">
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
        <RepeaterHeader button="Tekstblok toevoegen" description="Een titel met korte uitleg. Lege blokken verschijnen niet op de site." onAdd={() => updateField(field.key, stringifyCards([...items, { title: "", text: "" }]))} title={field.label} />
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? items.map((item, index) => (
            <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-[1fr_1.5fr_auto]" key={`${field.key}-${index}`}>
              <InlineInput label="Titel" value={item.title} onChange={(value) => updateItem(index, "title", value)} />
              <InlineTextarea label="Uitleg" value={item.text} onChange={(value) => updateItem(index, "text", value)} />
              <DeleteButton onClick={() => updateField(field.key, stringifyCards(items.filter((_, itemIndex) => itemIndex !== index)))} label="Verwijder" />
            </div>
          )) : <EmptyNotice text="Nog geen tekstblokken toegevoegd." />}
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
        <RepeaterHeader button="Infokaart toevoegen" description="Gebruik dit voor datum, locatie, prijs of korte praktische info." onAdd={() => updateField(field.key, stringifyFacts([...items, { label: "", value: "", note: "" }]))} title={field.label} />
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? items.map((item, index) => (
            <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-[1fr_1fr_1fr_auto]" key={`${field.key}-${index}`}>
              <InlineInput label="Kleine titel" value={item.label} onChange={(value) => updateItem(index, "label", value)} />
              <InlineInput label="Belangrijkste tekst" value={item.value} onChange={(value) => updateItem(index, "value", value)} />
              <InlineInput label="Extra uitleg" value={item.note ?? ""} onChange={(value) => updateItem(index, "note", value)} />
              <DeleteButton onClick={() => updateField(field.key, stringifyFacts(items.filter((_, itemIndex) => itemIndex !== index)))} label="Verwijder" />
            </div>
          )) : <EmptyNotice text="Nog geen infokaarten toegevoegd." />}
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
        <RepeaterHeader button="Document toevoegen" description="Ouders zien enkel duidelijke knoppen, bijvoorbeeld kampboekje of medische fiche." onAdd={() => updateField(field.key, stringifyDocuments([...items, { label: "", href: "", description: "" }]))} title={field.label} />
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? items.map((item, index) => (
            <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-2" key={`${field.key}-${index}`}>
              <InlineInput label="Naam op de knop" value={item.label} onChange={(value) => updateItem(index, "label", value)} />
              <InlineInput label="Link naar document" value={item.href} onChange={(value) => updateItem(index, "href", value)} />
              <InlineTextarea label="Korte uitleg" value={item.description} onChange={(value) => updateItem(index, "description", value)} className="md:col-span-2" />
              <DeleteButton onClick={() => updateField(field.key, stringifyDocuments(items.filter((_, itemIndex) => itemIndex !== index)))} label="Verwijder document" />
            </div>
          )) : <EmptyNotice text="Nog geen documenten toegevoegd." />}
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
        <RepeaterHeader button="Product toevoegen" description="Producten op de shop-pagina: naam, prijs, opties en knoptekst." onAdd={() => updateField(field.key, stringifyProducts([...items, { name: "", price: "", sizes: "", action: "Aanvragen" }]))} title={field.label} />
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? items.map((item, index) => (
            <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_1fr_0.8fr_auto]" key={`${field.key}-${index}`}>
              <InlineInput label="Productnaam" value={item.name} onChange={(value) => updateItem(index, "name", value)} />
              <InlineInput label="Prijs" value={item.price} onChange={(value) => updateItem(index, "price", value)} />
              <InlineInput label="Maten of opties" value={item.sizes} onChange={(value) => updateItem(index, "sizes", value)} />
              <InlineInput label="Knoptekst" value={item.action} onChange={(value) => updateItem(index, "action", value)} />
              <DeleteButton onClick={() => updateField(field.key, stringifyProducts(items.filter((_, itemIndex) => itemIndex !== index)))} label="Verwijder" />
            </div>
          )) : <EmptyNotice text="Nog geen producten toegevoegd." />}
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
        <RepeaterHeader button="Link toevoegen" description="Links worden per categorie gegroepeerd." onAdd={() => updateField(field.key, stringifyLinks([...items, { category: "", label: "", href: "", description: "" }]))} title={field.label} />
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? items.map((item, index) => (
            <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 md:grid-cols-2" key={`${field.key}-${index}`}>
              <InlineInput label="Categorie" value={item.category} onChange={(value) => updateItem(index, "category", value)} />
              <InlineInput label="Naam van de link" value={item.label} onChange={(value) => updateItem(index, "label", value)} />
              <InlineInput label="Webadres" value={item.href} onChange={(value) => updateItem(index, "href", value)} />
              <InlineTextarea label="Korte uitleg" value={item.description} onChange={(value) => updateItem(index, "description", value)} />
              <DeleteButton onClick={() => updateField(field.key, stringifyLinks(items.filter((_, itemIndex) => itemIndex !== index)))} label="Verwijder link" />
            </div>
          )) : <EmptyNotice text="Nog geen links toegevoegd." />}
        </div>
      </section>
    );
  }

  function renderLinesList(field: FieldConfig) {
    const items = parseLines(content[field.key]);
    return (
      <section className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 md:col-span-2" key={field.key}>
        <RepeaterHeader button="Regel toevoegen" description="Handig voor ledenlijsten of korte regels onder elkaar." onAdd={() => updateField(field.key, stringifyLines([...items, "Nieuwe regel"]))} title={field.label} />
        <div className="mt-5 grid gap-3">
          {items.length > 0 ? items.map((item, index) => (
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
          )) : <EmptyNotice text="Nog geen regels toegevoegd." />}
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

  function updateProgramItem(key: keyof EditableSiteContent, index: number, field: keyof ProgramItem, value: string) {
    const items = parseProgramItems(content[key]);
    const nextItems = items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item));
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
          title="Vergaderingen"
        />
        <div className="mt-5 grid gap-4">
          {items.length > 0 ? items.map((item, index) => (
            <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200 md:grid-cols-[0.55fr_1fr_0.55fr_auto]" key={`${key}-${index}`}>
              <InlineInput label="Datum" placeholder="31/01" value={item.date} onChange={(value) => updateProgramItem(key, index, "date", value)} />
              <InlineInput label="Activiteit" placeholder="Zoektocht" value={item.title} onChange={(value) => updateProgramItem(key, index, "title", value)} />
              <InlineInput label="Uur" placeholder="14u-17u" value={item.time} onChange={(value) => updateProgramItem(key, index, "time", value)} />
              <DeleteButton label="Verwijder" onClick={() => updateField(key, stringifyProgramItems(items.filter((_, itemIndex) => itemIndex !== index)))} />
              <InlineTextarea className="md:col-span-4" label="Uitleg voor leden en ouders" placeholder="Korte uitleg..." value={item.description} onChange={(value) => updateProgramItem(key, index, "description", value)} />
            </div>
          )) : <EmptyNotice text="Nog geen vergaderingen ingevuld." />}
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
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Dit kader verschijnt onder het programma. Handig voor weekends, kampdata of deadlines.</p>
          </div>
          {hasImportantDates ? (
            <button className="inline-flex rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100" onClick={() => updateField(key, "")} type="button">
              Kader verwijderen
            </button>
          ) : (
            <button className="inline-flex rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d]" onClick={() => updateField(key, "Zaterdag ...: ...\nWeekend ...: ...\nKamp ...: ...")} type="button">
              Belangrijke data toevoegen
            </button>
          )}
        </div>
        {hasImportantDates ? (
          <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
            Tekst in het belangrijke-data-kader
            <textarea className="min-h-40 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]" onChange={(event) => updateField(key, event.target.value)} onKeyDown={stopTextKeyPropagation} value={value} />
          </label>
        ) : <EmptyNotice text="Er verschijnt geen belangrijke-data-kader zolang dit leeg is." />}
      </div>
    );
  }

  function updateFaqItem(index: number, field: keyof FAQItem, value: string) {
    const items = parseFaqItems(content.faqItems);
    const nextItems = items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item));
    updateField("faqItems", stringifyFaqItems(nextItems));
  }

  function renderFaqManager() {
    const items = parseFaqItems(content.faqItems);
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <RepeaterHeader button="Vraag toevoegen" description="Beheer de vragen en antwoorden die ouders op de homepage zien." onAdd={() => updateField("faqItems", stringifyFaqItems([...items, createFaqItem()]))} title="Veelgestelde vragen" />
        <div className="mt-5 grid gap-4">
          {items.map((item, index) => (
            <div className="grid gap-4 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200" key={`faq-${index}`}>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black text-slate-950">Vraag {index + 1}</h3>
                <DeleteButton label="Verwijder" onClick={() => updateField("faqItems", stringifyFaqItems(items.filter((_, itemIndex) => itemIndex !== index)))} />
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
    return value.split(/\r?\n/).filter((line) => line.length > 0).map((line) => {
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
        <RepeaterHeader button="Nummer toevoegen" description="Voeg contactpersonen van de groepsleiding toe. Ze verschijnen als naam + telefoonnummer." onAdd={() => updateField("contactPhones", stringifyContactPhoneEntries([...phoneEntries, { name: "Nieuw contact", phone: "" }]))} title="Telefoonnummers groepsleiding" />
        <div className="mt-5 grid gap-3">
          {phoneEntries.length > 0 ? phoneEntries.map((entry, index) => (
            <div className="grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-slate-200 md:grid-cols-[1fr_1fr_auto]" key={`contact-phone-${index}`}>
              <InlineInput label="Naam" value={entry.name} onChange={(value) => {
                const nextEntries = phoneEntries.map((item, itemIndex) => (itemIndex === index ? { ...item, name: value } : item));
                updateField("contactPhones", stringifyContactPhoneEntries(nextEntries));
              }} />
              <InlineInput label="Telefoonnummer" value={entry.phone} onChange={(value) => {
                const nextEntries = phoneEntries.map((item, itemIndex) => (itemIndex === index ? { ...item, phone: value } : item));
                updateField("contactPhones", stringifyContactPhoneEntries(nextEntries));
              }} />
              <DeleteButton label="Verwijder" onClick={() => updateField("contactPhones", stringifyContactPhoneEntries(phoneEntries.filter((_, itemIndex) => itemIndex !== index)))} />
            </div>
          )) : <EmptyNotice text="Nog geen telefoonnummers toegevoegd." />}
        </div>
      </section>
    );
  }

  function getGalleryContentKeys(theme: GalleryTheme) {
    if (!theme.coverKey || !theme.collageKey) return null;
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
    if (uploadedUrls.length === 0) return;

    setContent((current) => {
      const existing = parseImageListValue(current[keys.collageKey]);
      const nextImages = [...existing, ...uploadedUrls];
      return { ...current, [keys.collageKey]: stringifyImageListValue(nextImages), [keys.coverKey]: current[keys.coverKey] || uploadedUrls[0] };
    });
    setMessage(`${uploadedUrls.length} foto${uploadedUrls.length === 1 ? "" : "'s"} toegevoegd.${optimizedCount > 0 ? ` ${optimizedCount} automatisch verkleind.` : ""} Klik op opslaan.`);
    void loadMediaLibrary();
  }

  function removeGalleryImage(theme: GalleryTheme, index: number) {
    const keys = getGalleryContentKeys(theme);
    if (!keys) return;
    setContent((current) => {
      const images = parseImageListValue(current[keys.collageKey]);
      const removedImage = images[index];
      const nextImages = images.filter((_, itemIndex) => itemIndex !== index);
      return { ...current, [keys.collageKey]: stringifyImageListValue(nextImages), [keys.coverKey]: current[keys.coverKey] === removedImage ? nextImages[0] || "" : current[keys.coverKey] };
    });
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
  }

  function renderGalleryManager(theme: GalleryTheme) {
    const keys = getGalleryContentKeys(theme);
    if (!keys) return null;
    const images = parseImageListValue(content[keys.collageKey]);
    return (
      <article className="rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5" key={theme.slug}>
        <SectionIntro title={`Collage ${theme.label}`} text={`Deze foto's verschijnen op /fotos/${theme.slug}.`} />
        {renderMediaCard(keys.coverKey, `Hoofdfoto ${theme.label}`, "Deze foto staat op de fotokaart.")}
        <div className="mt-5 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <RepeaterHeader button="Foto's toevoegen" description="Voeg meerdere foto's toe, zet ze in volgorde of verwijder wat niet meer nodig is." onAdd={() => undefined} title="Foto's in deze collage" fileInput={{ disabled: uploadingKey === keys.collageKey, onChange: (event) => uploadGalleryImages(theme, event) }} />
          <GalleryImageGrid images={images} onMove={(index, direction) => moveGalleryImage(theme, index, direction)} onRemove={(index) => removeGalleryImage(theme, index)} />
        </div>
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
    updateCustomGalleryThemes([...items, {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `custom-${Date.now()}`,
      slug: getUniqueCustomGallerySlug(label, items),
      label,
      alt: `Sfeerbeelden van ${label}`,
      coverUrl: "",
      images: [],
    }]);
  }

  async function uploadCustomGalleryFiles(theme: CustomGalleryTheme, event: ChangeEvent<HTMLInputElement>, cover = false) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setUploadingKey(`${cover ? "custom-cover" : "custom-images"}-${theme.id}`);
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
    updateCustomGalleryThemes(items.map((item) => {
      if (item.id !== theme.id) return item;
      if (cover) return { ...item, coverUrl: uploadedUrls[0] };
      return { ...item, coverUrl: item.coverUrl || uploadedUrls[0], images: [...item.images, ...uploadedUrls] };
    }));
  }

  function renderCustomGalleryManager(theme: CustomGalleryTheme) {
    return (
      <article className="rounded-3xl border border-slate-200 bg-white p-5" key={theme.id}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <SectionIntro title={theme.label || "Extra collage"} text={`Eigen fotopagina: /fotos/${theme.slug}`} />
          <DeleteButton label="Collage verwijderen" onClick={() => updateCustomGalleryThemes(customGalleryThemes.filter((item) => item.id !== theme.id))} />
        </div>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200">
            <InlineInput label="Naam van de collage" value={theme.label} onChange={(value) => updateCustomGalleryThemes(customGalleryThemes.map((item) => item.id === theme.id ? { ...item, label: value, slug: getUniqueCustomGallerySlug(value, customGalleryThemes, theme.id), alt: !item.alt || item.alt.startsWith("Sfeerbeelden van ") ? `Sfeerbeelden van ${value}` : item.alt } : item))} />
            <InlineInput label="Alt-tekst" value={theme.alt ?? ""} onChange={(value) => updateCustomGalleryThemes(customGalleryThemes.map((item) => item.id === theme.id ? { ...item, alt: value } : item))} />
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {theme.coverUrl ? <img alt={theme.alt ?? theme.label} className="h-40 w-full object-cover" src={theme.coverUrl} /> : <div className="flex h-40 items-center justify-center bg-[#edf6e8] px-6 text-center text-sm font-semibold text-[#2f6b18]">Nog geen hoofdfoto.</div>}
              <div className="grid gap-2 p-3 sm:grid-cols-2">
                <label className="cursor-pointer rounded-full bg-[#103001] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#1e4b0d]">
                  {uploadingKey === `custom-cover-${theme.id}` ? "Uploaden..." : "Hoofdfoto uploaden"}
                  <input accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" className="sr-only" onChange={(event) => uploadCustomGalleryFiles(theme, event, true)} type="file" />
                </label>
                <button className="rounded-full bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-40" disabled={!theme.coverUrl} onClick={() => updateCustomGalleryThemes(customGalleryThemes.map((item) => item.id === theme.id ? { ...item, coverUrl: "" } : item))} type="button">Hoofdfoto wissen</button>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200">
            <RepeaterHeader button="Foto's toevoegen" description="Voeg foto's toe, zet ze in volgorde of verwijder wat niet meer nodig is." onAdd={() => undefined} title="Foto's in deze collage" fileInput={{ disabled: uploadingKey === `custom-images-${theme.id}`, onChange: (event) => uploadCustomGalleryFiles(theme, event, false) }} />
            <GalleryImageGrid images={theme.images} onMove={(index, direction) => updateCustomGalleryThemes(customGalleryThemes.map((item) => {
              if (item.id !== theme.id) return item;
              const images = [...item.images];
              const targetIndex = index + direction;
              if (targetIndex < 0 || targetIndex >= images.length) return item;
              [images[index], images[targetIndex]] = [images[targetIndex], images[index]];
              return { ...item, images };
            }))} onRemove={(index) => updateCustomGalleryThemes(customGalleryThemes.map((item) => {
              if (item.id !== theme.id) return item;
              const removedImage = item.images[index];
              const images = item.images.filter((_, itemIndex) => itemIndex !== index);
              return { ...item, images, coverUrl: item.coverUrl === removedImage ? images[0] || "" : item.coverUrl };
            }))} />
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
      for (const match of value.matchAll(mediaPattern)) addUsage(extractMediaKey(match[1] ?? ""), String(contentKey));
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
          <SectionIntro title="Mediabibliotheek" text="Alle geuploade foto's en logo's. Verwijder alleen ongebruikte bestanden." />
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-[#edf6e8] px-5 py-3 text-sm font-bold text-[#103001] transition hover:bg-[#d7e8cf]" onClick={loadMediaLibrary} type="button">Vernieuw</button>
            <button className="rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d] disabled:cursor-not-allowed disabled:bg-slate-300" disabled={unusedCount === 0} onClick={async () => {
              const usedKeys = new Set(usageMap.keys());
              const unusedMedia = mediaLibrary.filter((item) => !usedKeys.has(item.key));
              let deletedCount = 0;
              for (const item of unusedMedia) if (await deleteMediaItem(item)) deletedCount += 1;
              setMessage(`${deletedCount} ongebruikte upload${deletedCount === 1 ? "" : "s"} verwijderd.`);
            }} type="button">Ongebruikte uploads opruimen</button>
          </div>
        </div>
        {mediaLibraryLoading ? <EmptyNotice text="Mediabibliotheek laden..." /> : mediaLibrary.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mediaLibrary.map((item) => {
              const usageLabels = usageMap.get(item.key) ?? [];
              const isUsed = usageLabels.length > 0;
              return (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#fbfdf9]" key={item.key}>
                  <img alt="" className="h-36 w-full bg-white object-cover" src={item.url} />
                  <div className="grid gap-3 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${isUsed ? "bg-[#edf6e8] text-[#103001]" : "bg-amber-50 text-amber-800"}`}>{isUsed ? "In gebruik" : "Ongebruikt"}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200">{formatMediaSize(item.size)}</span>
                    </div>
                    <p className="break-all text-xs leading-5 text-slate-500">{item.key}</p>
                    {isUsed ? <p className="rounded-2xl bg-white p-3 text-xs leading-5 text-slate-600 ring-1 ring-slate-200">Gebruikt bij: {usageLabels.slice(0, 5).join(", ")}</p> : null}
                    <button className="rounded-full bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400" disabled={isUsed} onClick={async () => { if (await deleteMediaItem(item)) setMessage("Ongebruikt bestand definitief verwijderd."); }} type="button">
                      {isUsed ? "Eerst uit site halen" : "Bestand verwijderen"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : <EmptyNotice text="Nog geen uploads gevonden." />}
      </article>
    );
  }

  function renderDashboardContent() {
    if (activeSectionId === "dashboard") return renderStartDashboard();
    if (activeSectionId === "homepage") return renderHomepageEditor();
    if (activeSectionId === "branches") return renderBranchesEditor();
    if (activeSectionId === "programs") return renderProgramsEditor();
    if (activeSectionId === "photos") return renderPhotosEditor();
    if (activeSectionId === "pages") return isSuperAdmin ? renderPagesEditor() : null;
    if (activeSectionId === "contact") return isSuperAdmin ? renderContactEditor() : null;
    if (activeSectionId === "site") return isSuperAdmin ? renderSiteEditor() : null;
    return null;
  }

  function renderStartDashboard() {
    const cards = isSuperAdmin
      ? [
          { id: "homepage", title: "Homepage aanpassen", description: "Hero, takkenblok, activiteiten en praktische info.", section: "homepage" as AdminSection },
          { id: "branches", title: "Takken beheren", description: "Teksten, leeftijden, logo's en leidingfoto's per tak.", section: "branches" as AdminSection },
          { id: "programs", title: "Programma invullen", description: "Vergaderingen en belangrijke data per tak.", section: "programs" as AdminSection },
          { id: "photos", title: "Foto's beheren", description: "Homepagefoto, collages, extra fotopagina's en uploads.", section: "photos" as AdminSection },
          { id: "pages", title: "Aparte pagina's", description: "Activiteiten, acties, verhuur, oudercomite, links en shop.", section: "pages" as AdminSection },
          { id: "contact", title: "Contactgegevens", description: "E-mail, telefoonnummers, sociale links en contactknoppen.", section: "contact" as AdminSection },
          { id: "site", title: "Site-instellingen", description: "Logo, naam, menu en voettekst.", section: "site" as AdminSection },
        ]
      : [
          { id: "branches", title: `${activeBranch.name} aanpassen`, description: "Tekst, logo, sfeerfoto en leidingfoto van jouw tak.", section: "branches" as AdminSection },
          { id: "programs", title: "Programma invullen", description: "Vergaderingen en belangrijke data voor jouw tak.", section: "programs" as AdminSection },
        ];

    return (
      <div className="grid gap-6">
        <section className="rounded-[2rem] bg-[#fbfdf9] p-6 ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">Welkom</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Wat wil je aanpassen?</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Kies eerst een onderdeel. Daarna krijg je alleen de velden die bij dat onderdeel horen.
          </p>
        </section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <button className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-950/10" key={card.id} onClick={() => selectSection(card.section)} type="button">
              <span className="block text-lg font-black text-slate-950">{card.title}</span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">{card.description}</span>
              <span className="mt-4 inline-flex rounded-full bg-[#edf6e8] px-4 py-2 text-sm font-bold text-[#103001]">Openen</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  function renderHomepageEditor() {
    return (
      <div className="grid gap-6">
        <SectionIntro title="Homepage" text="Kies het deel van de startpagina dat je wil aanpassen." />
        <ChoiceGrid items={homepageGroups.map((group) => ({ id: group.title, title: group.title, description: group.description }))} activeId={activeHomepageGroup.title} onSelect={setActiveHomepageId} />
        <article className="rounded-[2rem] border border-slate-200 bg-[#fbfdf9] p-5">
          <SectionIntro title={activeHomepageGroup.title} text={activeHomepageGroup.description} eyebrow="Gekozen onderdeel" />
          {activeHomepageGroup.type === "faq" ? renderFaqManager() : <div className="grid gap-5 md:grid-cols-2">{activeHomepageGroup.fields.map(renderField)}</div>}
        </article>
      </div>
    );
  }

  function renderBranchSelector() {
    if (!isSuperAdmin) return null;
    return (
      <div className="mb-6 flex flex-wrap gap-2">
        {allowedBranches.map((branch) => (
          <button className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeBranch.slug === branch.slug ? "bg-[#103001] text-white" : "bg-[#edf6e8] text-[#103001] hover:bg-[#d7e8cf]"}`} key={branch.slug} onClick={() => setActiveBranchSlug(branch.slug)} type="button">
            {branch.name}
          </button>
        ))}
      </div>
    );
  }

  function renderBranchesEditor() {
    return (
      <div className="grid gap-6">
        <SectionIntro title={isSuperAdmin ? "Takken" : "Mijn tak"} text={isSuperAdmin ? "Kies een tak en daarna wat je wil aanpassen." : `Beheer de informatie van ${activeBranch.name}.`} />
        {isSuperAdmin ? (
          <article className="rounded-3xl border border-slate-200 bg-[#fbfdf9] p-5">
            <SectionIntro title="Algemene takkenpagina" text="Titel en intro van /takken." />
            <div className="grid gap-5 md:grid-cols-2">
              {renderField({ key: "branchesPageTitle", label: "Titel takkenpagina" })}
              {renderField({ key: "branchesPageSubtitle", label: "Intro takkenpagina", kind: "textarea" })}
            </div>
          </article>
        ) : null}
        <article className="rounded-[2rem] border border-slate-200 bg-white p-5">
          {renderBranchSelector()}
          <PillNav activeId={activeBranchTab} items={[{ id: "basis", label: "Basisinfo" }, { id: "blokken", label: "Tekstblokken" }, { id: "fotos", label: "Foto's en logo" }]} onSelect={setActiveBranchTab} />
          <div className="mt-6">
            {activeBranchTab === "basis" ? (
              <div className="grid gap-5 md:grid-cols-2">
                {renderField({ key: activeBranch.contentKeys.age, label: "Leeftijd" })}
                {renderField({ key: activeBranch.contentKeys.shortDescription, label: "Korte tekst op het takkenoverzicht", kind: "textarea" })}
                {renderField({ key: activeBranch.contentKeys.intro, label: "Intro op de takpagina", kind: "textarea" })}
                {renderField({ key: activeBranch.contentKeys.highlights, label: "Korte tags, elke tag op een nieuwe regel", kind: "textarea" })}
                {renderField({ key: activeBranch.contentKeys.leaderNames, label: "Leidingnamen, elke persoon op een nieuwe regel", kind: "textarea" })}
              </div>
            ) : null}
            {activeBranchTab === "blokken" ? (
              <div className="grid gap-5">
                {activeBranch.contentKeys.blocks.map((block, index) => (
                  <div className="grid gap-5 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200 md:grid-cols-2" key={`${activeBranch.slug}-${index}`}>
                    {renderField({ key: block.title, label: `${branchBlockNames[index] ?? `Blok ${index + 1}`}: titel` })}
                    {renderField({ key: block.text, label: `${branchBlockNames[index] ?? `Blok ${index + 1}`}: uitleg`, kind: "textarea" })}
                  </div>
                ))}
              </div>
            ) : null}
            {activeBranchTab === "fotos" ? (
              <div className="grid gap-5 md:grid-cols-2">
                {renderMediaCard(activeBranch.logoKey, `Logo ${activeBranch.name}`, "PNG of SVG met transparante achtergrond werkt hier goed.", true)}
                {renderMediaCard(activeBranch.contentKeys.imageUrl, `Sfeerfoto ${activeBranch.name}`, "Foto bovenaan de takpagina.")}
                {renderMediaCard(activeBranch.contentKeys.leaderPhotoUrl, `Foto van de leiding`, "Groepsfoto of foto van de actieve leiding van dit jaar.")}
              </div>
            ) : null}
          </div>
        </article>
      </div>
    );
  }

  function renderProgramsEditor() {
    return (
      <div className="grid gap-6">
        <SectionIntro title="Programma" text={isSuperAdmin ? "Kies een tak en vul vergaderingen of belangrijke data aan." : `Beheer het programma van ${activeBranch.name}.`} />
        <article className="rounded-[2rem] border border-slate-200 bg-white p-5">
          {renderBranchSelector()}
          <div className="grid gap-5">
            {renderProgramManager(activeBranch.contentKeys.program)}
            {renderImportantDatesManager(activeBranch.contentKeys.importantDates)}
          </div>
        </article>
      </div>
    );
  }

  function renderPhotosEditor() {
    return (
      <div className="grid gap-6">
        <SectionIntro title="Foto's" text="Beheer de belangrijkste foto's, collages en uploads." />
        <PillNav activeId={activePhotoTab} items={[{ id: "basis", label: "Belangrijke foto's" }, { id: "collages", label: "Vaste collages" }, { id: "extra", label: "Extra collages" }, { id: "bibliotheek", label: "Mediabibliotheek" }]} onSelect={setActivePhotoTab} />
        {activePhotoTab === "basis" ? <div className="grid gap-5 md:grid-cols-2">{mediaFields.map((field) => renderMediaCard(field.key, field.label, field.description))}</div> : null}
        {activePhotoTab === "collages" ? (
          <article className="rounded-[2rem] border border-slate-200 bg-white p-5">
            <ChoiceGrid items={galleryThemes.map((theme) => ({ id: theme.slug, title: theme.label, description: `Foto's voor de collage ${theme.label}.` }))} activeId={activeGalleryTheme.slug} onSelect={setActiveGallerySlug} />
            <div className="mt-6">{renderGalleryManager(activeGalleryTheme)}</div>
          </article>
        ) : null}
        {activePhotoTab === "extra" ? (
          <article className="rounded-[2rem] border border-slate-200 bg-[#fbfdf9] p-5">
            <RepeaterHeader button="Nieuwe collage toevoegen" description="Elke extra collage krijgt automatisch een eigen fotopagina onder /fotos." onAdd={addCustomGalleryTheme} title="Extra collages" />
            <div className="mt-6 grid gap-5">{customGalleryThemes.length > 0 ? customGalleryThemes.map(renderCustomGalleryManager) : <EmptyNotice text="Er zijn nog geen extra collages." />}</div>
          </article>
        ) : null}
        {activePhotoTab === "bibliotheek" ? renderMediaLibrary() : null}
      </div>
    );
  }

  function renderPagesEditor() {
    return (
      <div className="grid gap-6">
        <SectionIntro title="Pagina's" text="Kies eerst een pagina. Daarna kies je welk onderdeel van die pagina je wil bewerken." />
        <ChoiceGrid items={pageEditorItems} activeId={activePageItem.id} onSelect={(id) => { setActivePageId(id); setActivePageGroupIndex(0); }} />
        <article className="rounded-[2rem] border border-slate-200 bg-white p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <SectionIntro title={activePageItem.title} text={activePageItem.description} eyebrow="Gekozen pagina" />
            <Link className="inline-flex rounded-full bg-[#edf6e8] px-5 py-3 text-sm font-bold text-[#103001] transition hover:bg-[#d7e8cf]" href={activePageItem.href} target="_blank">Bekijk pagina</Link>
          </div>
          <div className="mb-6">{renderMediaCard(activePageItem.imageKey, `Hoofdbeeld ${activePageItem.title}`, "Afbeelding rechts in de hero van deze pagina.")}</div>
          <PillNav activeId={String(Math.min(activePageGroupIndex, Math.max(activePageGroups.length - 1, 0)))} items={activePageGroups.map((group, index) => ({ id: String(index), label: group.title }))} onSelect={(id) => setActivePageGroupIndex(Number(id))} />
          {activePageGroup ? (
            <section className="mt-6 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200">
              <SectionIntro title={activePageGroup.title} text={activePageGroup.description} />
              <div className="grid gap-5 md:grid-cols-2">{activePageGroup.fields.map(renderPageField)}</div>
            </section>
          ) : null}
        </article>
      </div>
    );
  }

  function renderContactEditor() {
    return (
      <div className="grid gap-6">
        <SectionIntro title="Contact" text="Beheer wat ouders onderaan de site zien om jullie te bereiken." />
        <PillNav activeId={activeContactTab} items={[{ id: "gegevens", label: "Gegevens" }, { id: "telefoons", label: "Telefoons" }, { id: "knoppen", label: "Knoppen en tekst" }]} onSelect={setActiveContactTab} />
        {activeContactTab === "gegevens" ? <div className="grid gap-5 md:grid-cols-2">{contactFields.map(renderField)}{renderMediaCard("contactImageUrl", "Contactfoto", "Foto die de lege ruimte in het contactblok opvult.")}</div> : null}
        {activeContactTab === "telefoons" ? renderContactPhoneManager() : null}
        {activeContactTab === "knoppen" ? <div className="grid gap-5 md:grid-cols-2">{contactLinkFields.map(renderField)}</div> : null}
      </div>
    );
  }

  function renderSiteEditor() {
    return (
      <div className="grid gap-6">
        <SectionIntro title="Site-instellingen" text="Algemene zaken die op meerdere plekken op de website terugkomen." />
        <PillNav activeId={activeSiteTab} items={[{ id: "algemeen", label: "Logo en naam" }, { id: "menu", label: "Menu" }, { id: "footer", label: "Voettekst" }]} onSelect={setActiveSiteTab} />
        {activeSiteTab === "algemeen" ? <div className="grid gap-5 md:grid-cols-2">{siteGeneralFields.map(renderField)}{renderMediaCard("siteLogoUrl", "Hoofdlogo website", "Wordt gebruikt in de navigatie, contactkaart en voettekst.", true)}</div> : null}
        {activeSiteTab === "menu" ? <div className="grid gap-5 md:grid-cols-2">{navigationFields.map(renderField)}<div className="md:col-span-2 grid gap-4"><MenuOverview title="Home" items={[["Takken", "/#takken"], ["Activiteiten", "/#activiteiten"], ["Kamp", "/zomerkamp"], ["Foto's", "/fotos"], ["Contact", "/#contact"]]} />{sitePageGroups.map((group) => <MenuOverview key={group.label} title={group.label} items={group.items.map((item) => [item.label, item.href])} />)}</div></div> : null}
        {activeSiteTab === "footer" ? <div className="grid gap-5 md:grid-cols-2">{footerFields.map(renderField)}</div> : null}
      </div>
    );
  }

  if (loading) {
    return <main className="min-h-screen bg-[#f2f8ee] px-5 py-16 text-slate-950"><div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">Beheeromgeving laden...</div></main>;
  }

  return (
    <main className="min-h-screen bg-[#f2f8ee] px-6 py-8 text-slate-950 lg:px-8">
      <div className="mx-auto max-w-[1540px]">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-[#103001] p-6 text-white shadow-xl shadow-green-950/15 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-green-100">Beheerbureau</p>
            <h1 className="mt-2 text-3xl font-black">Scouts Sint-Jan Berchmans</h1>
            <p className="mt-2 max-w-2xl text-green-100">Kies eerst wat je wil aanpassen. Daarna zie je alleen de velden die daarbij horen.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {authenticated && adminSession ? <div className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white">{adminSession.displayName}</div> : null}
            <Link className="rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-green-50" href="/">Bekijk site</Link>
            {authenticated ? <button className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10" onClick={handleLogout} type="button">Uitloggen</button> : null}
          </div>
        </div>

        {!configured ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <h2 className="text-xl font-bold">Beheer is nog niet geconfigureerd</h2>
            <p className="mt-3 leading-7">Er ontbreken nog geheime instellingen voor de login. Online stel je die in bij de hosting-variabelen.</p>
            {missingConfig.length > 0 ? <p className="mt-3 text-sm font-bold">Ontbreekt nu: {missingConfig.join(", ")}</p> : null}
            <div className="mt-5 grid gap-2 md:grid-cols-2">{setupHelp.map((item) => <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm ring-1 ring-amber-200" key={item.username}><span className="font-black">{item.username}</span><span className="block text-amber-800">{item.role}: {item.env}</span></div>)}</div>
          </section>
        ) : null}

        {!authenticated ? (
          configured ? (
            <form className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleLogin}>
              <h2 className="text-2xl font-black">Aanmelden</h2>
              <p className="mt-3 leading-7 text-slate-600">Log in als groepsleiding of takleiding. Iedereen ziet alleen wat nodig is.</p>
              <label className="mt-6 grid gap-2 text-sm font-semibold text-slate-700">Gebruikersnaam<input className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]" onChange={(event) => setUsername(event.target.value)} onKeyDown={stopTextKeyPropagation} placeholder="groepsleiding" type="text" value={username} /></label>
              <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">Wachtwoord<input className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]" onChange={(event) => setPassword(event.target.value)} onKeyDown={stopTextKeyPropagation} type="password" value={password} /></label>
              <button className="mt-6 w-full rounded-full bg-[#103001] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#1e4b0d]" type="submit">Inloggen</button>
              {message ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{message}</p> : null}
            </form>
          ) : null
        ) : (
          <form className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]" onSubmit={handleSave}>
            <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm xl:sticky xl:top-6">
              {visibleSections.map((section) => (
                <button className={`mb-1.5 w-full rounded-2xl px-4 py-3 text-left transition ${activeSectionId === section.id ? "bg-[#103001] text-white shadow-lg shadow-green-950/15" : "text-slate-700 hover:bg-[#edf6e8]"}`} key={section.id} onClick={() => selectSection(section.id)} type="button">
                  <span className="block text-sm font-black">{!isSuperAdmin && section.id === "branches" ? "Mijn tak" : section.label}</span>
                  <span className={`mt-1 block text-xs leading-5 ${activeSectionId === section.id ? "text-green-100" : "text-slate-500"}`}>{!isSuperAdmin && section.id === "branches" ? "Info en foto's" : section.description}</span>
                </button>
              ))}
            </aside>
            <section className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
              {activeSectionId !== "dashboard" ? (
                <div className="mb-7 rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200">
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">Je bewerkt nu</p>
                  <h2 className="mt-2 text-3xl font-black text-slate-950">{!isSuperAdmin && activeSectionId === "branches" ? "Mijn tak" : activeSectionInfo.label}</h2>
                  <p className="mt-2 text-slate-600">{!isSuperAdmin && activeSectionId === "branches" ? `Info en foto's van ${activeBranch.name}.` : activeSectionInfo.description}</p>
                </div>
              ) : null}
              {contentStatus?.source === "defaults" ? (
                <div className="mb-7 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                  <h3 className="text-lg font-black">Databank niet bereikbaar</h3>
                  <p className="mt-2 text-sm leading-6">De beheeromgeving toont nu standaardinhoud omdat de databank niet gelezen kon worden. Controleer dit voor je verder bewerkt.</p>
                  {contentStatus.error ? <p className="mt-3 rounded-2xl bg-white/70 p-3 text-xs leading-5">{contentStatus.error}</p> : null}
                </div>
              ) : null}
              {renderDashboardContent()}
              {showSaveBar ? (
                <div className="sticky bottom-4 mt-7 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-950/10 backdrop-blur xl:flex-row xl:items-center xl:justify-between">
                  <p className="text-sm font-semibold text-slate-600">{message || (saveState === "saved" ? "Wijzigingen opgeslagen." : "Wijzigingen worden pas zichtbaar na opslaan.")}</p>
                  <div className="flex flex-wrap gap-3">
                    <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50" onClick={handleCancelChanges} type="button">Annuleren</button>
                    <Link className="rounded-full bg-[#edf6e8] px-6 py-3 text-sm font-bold text-[#103001] transition hover:bg-[#d7e8cf]" href={previewPath} target="_blank">Voorbeeld bekijken</Link>
                    <button className="rounded-full bg-[#103001] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d] disabled:cursor-not-allowed disabled:bg-slate-400" disabled={saveState === "saving"} type="submit">{saveButtonLabel}</button>
                  </div>
                </div>
              ) : null}
            </section>
          </form>
        )}
      </div>
    </main>
  );
}

function SectionIntro({ title, text, eyebrow }: { title: string; text?: string; eyebrow?: string }) {
  return (
    <div className="mb-5">
      {eyebrow ? <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">{eyebrow}</p> : null}
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      {text ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{text}</p> : null}
    </div>
  );
}

function ChoiceGrid({ items, activeId, onSelect }: { items: ChoiceItem[]; activeId: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <button className={`rounded-2xl border p-4 text-left transition ${activeId === item.id ? "border-[#d7e8cf] bg-[#edf6e8] shadow-md shadow-green-950/10" : "border-slate-200 bg-[#fbfdf9] hover:bg-[#f2f8ee]"}`} key={item.id} onClick={() => onSelect(item.id)} type="button">
          <span className="block text-base font-black text-slate-950">{item.title}</span>
          <span className="mt-1 block text-sm leading-5 text-slate-600">{item.description}</span>
          {item.href ? <span className="mt-3 block text-xs font-bold text-[#2f6b18]">{item.href}</span> : null}
        </button>
      ))}
    </div>
  );
}

function PillNav({ items, activeId, onSelect }: { items: Array<{ id: string; label: string }>; activeId: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeId === item.id ? "bg-[#103001] text-white" : "bg-[#edf6e8] text-[#103001] hover:bg-[#d7e8cf]"}`} key={item.id} onClick={() => onSelect(item.id)} type="button">
          {item.label}
        </button>
      ))}
    </div>
  );
}

function RepeaterHeader({ title, description, button, onAdd, fileInput }: { title: string; description: string; button: string; onAdd: () => void; fileInput?: { disabled?: boolean; onChange: (event: ChangeEvent<HTMLInputElement>) => void } }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h5 className="text-lg font-black text-slate-950">{title}</h5>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {fileInput ? (
        <label className="inline-flex shrink-0 cursor-pointer justify-center rounded-full bg-[#103001] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e4b0d]">
          {button}
          <input accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" className="sr-only" disabled={fileInput.disabled} multiple onChange={fileInput.onChange} type="file" />
        </label>
      ) : (
        <button className="rounded-full bg-[#103001] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e4b0d]" onClick={onAdd} type="button">{button}</button>
      )}
    </div>
  );
}

function InlineInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]" onChange={(event) => onChange(event.target.value)} onKeyDown={stopTextKeyPropagation} placeholder={placeholder} value={value} />
    </label>
  );
}

function InlineTextarea({ label, value, onChange, className = "", placeholder }: { label: string; value: string; onChange: (value: string) => void; className?: string; placeholder?: string }) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-slate-700 ${className}`}>
      {label}
      <textarea className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]" onChange={(event) => onChange(event.target.value)} onKeyDown={stopTextKeyPropagation} placeholder={placeholder} value={value} />
    </label>
  );
}

function DeleteButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button className="self-end rounded-full border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50" onClick={onClick} type="button">{label}</button>;
}

function EmptyNotice({ text }: { text: string }) {
  return <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-[#fbfdf9] p-5 text-sm leading-6 text-slate-500">{text}</div>;
}

function GalleryImageGrid({ images, onMove, onRemove }: { images: string[]; onMove: (index: number, direction: -1 | 1) => void; onRemove: (index: number) => void }) {
  return (
    <div className="mt-5">
      {images.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white" key={`${image}-${index}`}>
              <img alt="" className="h-36 w-full object-cover" src={image} />
              <div className="grid grid-cols-3 gap-2 p-3">
                <button className="rounded-full bg-[#edf6e8] px-3 py-2 text-xs font-bold text-[#103001] disabled:opacity-40" disabled={index === 0} onClick={() => onMove(index, -1)} type="button">Omhoog</button>
                <button className="rounded-full bg-[#edf6e8] px-3 py-2 text-xs font-bold text-[#103001] disabled:opacity-40" disabled={index === images.length - 1} onClick={() => onMove(index, 1)} type="button">Omlaag</button>
                <button className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100" onClick={() => onRemove(index)} type="button">Verwijder</button>
              </div>
            </div>
          ))}
        </div>
      ) : <EmptyNotice text="Nog geen foto's toegevoegd." />}
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
