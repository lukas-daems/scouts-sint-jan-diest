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
  parseImageListValue,
  stringifyImageListValue,
  type GalleryTheme,
} from "../lib/gallery";
import {
  getSitePageAdminGroups,
  getSitePageImageKey,
  sitePageGroups,
  sitePages,
} from "../lib/site-pages";
import { prepareImageForUpload } from "../lib/prepare-image-upload";
import {
  createProgramItem,
  parseProgramItems,
  stringifyProgramItems,
  type ProgramItem,
} from "../lib/program";

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
};

type AdminSession = {
  username: string;
  displayName: string;
  role: "superadmin" | "branch";
  branchSlug?: string;
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
    id: "pages",
    label: "Pagina's",
    description: "Takken en infopagina's",
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
    title: "Hero",
    description: "De eerste indruk bovenaan de homepage.",
    fields: [
      { key: "heroEyebrow", label: "Kleine tekst boven titel" },
      { key: "heroOrgLabel", label: "Organisatiebadge naast kleine tekst" },
      { key: "heroTitleLineOne", label: "Titel regel 1" },
      { key: "heroTitleLineTwo", label: "Titel regel 2" },
      { key: "heroSubtitle", label: "Intro tekst", kind: "textarea" },
      { key: "heroPrimaryCtaLabel", label: "Primaire knop" },
      { key: "heroSecondaryCtaLabel", label: "Secundaire knop" },
      { key: "heroStatOneTitle", label: "Infokaart 1 titel" },
      { key: "heroStatOneLabel", label: "Infokaart 1 tekst" },
      { key: "heroStatTwoTitle", label: "Infokaart 2 titel" },
      { key: "heroStatTwoLabel", label: "Infokaart 2 tekst" },
      { key: "heroStatThreeTitle", label: "Infokaart 3 titel" },
      { key: "heroStatThreeLabel", label: "Infokaart 3 tekst" },
      { key: "heroStatFourTitle", label: "Infokaart 4 titel" },
      { key: "heroStatFourLabel", label: "Infokaart 4 tekst" },
    ],
  },
  {
    title: "Takken-preview",
    description: "Korte takkenblok op de homepage.",
    fields: [
      { key: "branchesHomeTitle", label: "Titel" },
      { key: "branchesHomeSubtitle", label: "Intro tekst", kind: "textarea" },
      { key: "branchesHomeCtaLabel", label: "Knoptekst" },
    ],
  },
  {
    title: "Activiteiten-preview",
    description: "Homepageblok met de grote zomerkampkaart.",
    fields: [
      { key: "activitiesTitle", label: "Titel" },
      { key: "activitiesSubtitle", label: "Intro tekst", kind: "textarea" },
      { key: "activitiesFeaturedBadge", label: "Badge grote kaart" },
      { key: "activitiesFeaturedTitle", label: "Titel grote kaart" },
      { key: "activitiesFeaturedText", label: "Tekst grote kaart", kind: "textarea" },
      { key: "activitiesFeaturedMiniTitle", label: "Fotoblok titel" },
      { key: "activitiesFeaturedMiniText", label: "Fotoblok tekst", kind: "textarea" },
      { key: "activitiesFeaturedCtaLabel", label: "Knop grote kaart" },
      { key: "activitiesMoreTitle", label: "Extra kaart titel" },
      { key: "activitiesMoreText", label: "Extra kaart tekst", kind: "textarea" },
      { key: "activitiesMoreCtaLabel", label: "Extra kaart knop" },
    ],
  },
  {
    title: "Waarom kiezen ouders?",
    description: "Blauwe overtuigingssectie.",
    fields: [
      { key: "whyJoinBadge", label: "Badge" },
      { key: "whyJoinTitle", label: "Titel" },
      { key: "whyJoinText", label: "Intro tekst", kind: "textarea" },
      { key: "whyJoinBullets", label: "Bulletpoints, 1 per lijn", kind: "textarea" },
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
      { key: "joinSubtitle", label: "Inschrijven intro", kind: "textarea" },
      { key: "joinCtaLabel", label: "Inschrijfknop" },
      { key: "faqBadge", label: "FAQ badge" },
      { key: "faqTitle", label: "FAQ titel" },
      { key: "faqSubtitle", label: "FAQ intro", kind: "textarea" },
      { key: "faqCtaLabel", label: "FAQ knop" },
    ],
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
  { key: "contactTrustText", label: "Vertrouwenszin", kind: "textarea" },
];

const footerFields: FieldConfig[] = [
  { key: "footerDescription", label: "Tekst onder groepsnaam", kind: "textarea" },
  { key: "instagramUrl", label: "Instagramlink" },
  { key: "facebookUrl", label: "Facebooklink" },
  { key: "footerNotice", label: "Footer melding", kind: "textarea" },
  { key: "footerCopyright", label: "Copyrightlijn" },
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
  description: `${page.navLabel} pagina beheren: inhoud, praktische info, functies en CTA's.`,
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
    return `/?${marker}#fotos`;
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
  const [authenticated, setAuthenticated] = useState(false);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("groepsleiding");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<EditableSiteContent>(defaultSiteContent);
  const [message, setMessage] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [uploadingKey, setUploadingKey] =
    useState<keyof EditableSiteContent | null>(null);
  const [activeSection, setActiveSection] =
    useState<AdminSection>("homepage");
  const [activeBranchSlug, setActiveBranchSlug] = useState(
    branchProfiles[0].slug
  );
  const [activePageItemId, setActivePageItemId] = useState(pageEditorItems[0].id);
  const [previewVersion, setPreviewVersion] = useState(1);

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
        : sections.filter((section) => section.id === "pages"),
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
        session: AdminSession | null;
      };

      setConfigured(session.configured);
      setAuthenticated(session.authenticated);
      setAdminSession(session.session);
      if (session.session?.role === "branch" && session.session.branchSlug) {
        setActiveSection("pages");
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

  async function loadContent() {
    const response = await fetch("/api/admin/content");
    if (!response.ok) {
      setMessage("Kon de site-inhoud niet laden.");
      return;
    }

    const payload = (await response.json()) as { content: EditableSiteContent };
    setContent(payload.content);
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
      setActiveSection("pages");
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
      setSaveState("error");
      setMessage("Opslaan is niet gelukt. Ben je nog aangemeld?");
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

    let prepared;
    try {
      prepared = await prepareImageForUpload(file, { logo });
    } catch {
      setUploadingKey(null);
      setMessage("Deze afbeelding kon niet voorbereid worden voor upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", prepared.file);
    formData.append("slot", key);

    const response = await fetch("/api/admin/media", {
      body: formData,
      method: "POST",
    });

    setUploadingKey(null);

    if (!response.ok) {
      if (response.status === 413) {
        setMessage(
          "Dit bestand is nog te groot. Probeer het logo kleiner te exporteren of gebruik een compactere PNG."
        );
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setMessage(payload.error ?? "Uploaden is niet gelukt.");
      return;
    }

    const payload = (await response.json()) as { url: string };
    updateField(key, payload.url);
    setMessage(
      prepared.optimized
        ? "Upload gelukt. De afbeelding werd automatisch verkleind zodat ze lokaal past. Klik op opslaan."
        : "Upload gelukt. Klik op opslaan om dit zichtbaar te maken."
    );
  }

  async function uploadGalleryImages(
    theme: GalleryTheme,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    setUploadingKey(theme.collageKey);
    setMessage("");

    const uploadedUrls: string[] = [];

    for (const file of files) {
      let prepared;
      try {
        prepared = await prepareImageForUpload(file);
      } catch {
        setMessage("Een van de foto's kon niet voorbereid worden voor upload.");
        continue;
      }

      const formData = new FormData();
      formData.append("file", prepared.file);
      formData.append("slot", `collage-${theme.slug}`);

      const response = await fetch("/api/admin/media", {
        body: formData,
        method: "POST",
      });

      if (response.ok) {
        const payload = (await response.json()) as { url: string };
        uploadedUrls.push(payload.url);
      }
    }

    setUploadingKey(null);
    event.target.value = "";

    if (uploadedUrls.length === 0) {
      setMessage("Uploaden is niet gelukt.");
      return;
    }

    setContent((current) => {
      const existing = parseImageListValue(current[theme.collageKey]);
      const nextImages = [...existing, ...uploadedUrls];

      return {
        ...current,
        [theme.collageKey]: stringifyImageListValue(nextImages),
        [theme.coverKey]: current[theme.coverKey] || uploadedUrls[0],
      };
    });
    setMessage(
      `${uploadedUrls.length} foto${uploadedUrls.length === 1 ? "" : "'s"} toegevoegd aan ${theme.label}. Klik op opslaan.`
    );
  }

  async function replaceGalleryImage(
    theme: GalleryTheme,
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingKey(theme.collageKey);
    setMessage("");

    let prepared;
    try {
      prepared = await prepareImageForUpload(file);
    } catch {
      setUploadingKey(null);
      setMessage("Deze foto kon niet voorbereid worden voor upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", prepared.file);
    formData.append("slot", `collage-${theme.slug}`);

    const response = await fetch("/api/admin/media", {
      body: formData,
      method: "POST",
    });

    setUploadingKey(null);
    event.target.value = "";

    if (!response.ok) {
      setMessage("Vervangen is niet gelukt.");
      return;
    }

    const payload = (await response.json()) as { url: string };
    setContent((current) => {
      const images = parseImageListValue(current[theme.collageKey]);
      images[index] = payload.url;

      return {
        ...current,
        [theme.collageKey]: stringifyImageListValue(images),
      };
    });
    setMessage(`Foto vervangen in ${theme.label}. Klik op opslaan.`);
  }

  function removeGalleryImage(theme: GalleryTheme, index: number) {
    setContent((current) => {
      const images = parseImageListValue(current[theme.collageKey]);
      const removedImage = images[index];
      const nextImages = images.filter((_, itemIndex) => itemIndex !== index);

      return {
        ...current,
        [theme.collageKey]: stringifyImageListValue(nextImages),
        [theme.coverKey]:
          current[theme.coverKey] === removedImage
            ? nextImages[0] || ""
            : current[theme.coverKey],
      };
    });
    setMessage(`Foto verwijderd uit ${theme.label}. Klik op opslaan.`);
  }

  function moveGalleryImage(theme: GalleryTheme, index: number, direction: -1 | 1) {
    setContent((current) => {
      const images = parseImageListValue(current[theme.collageKey]);
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= images.length) {
        return current;
      }

      [images[index], images[targetIndex]] = [images[targetIndex], images[index]];

      return {
        ...current,
        [theme.collageKey]: stringifyImageListValue(images),
      };
    });
    setMessage(`Volgorde aangepast in ${theme.label}. Klik op opslaan.`);
  }

  function stopTextKeyPropagation(
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation?.();
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
        {field.kind === "textarea" ? (
          <textarea
            className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal leading-7 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
            onKeyDown={stopTextKeyPropagation}
            onChange={(event) => updateField(field.key, event.target.value)}
            value={content[field.key]}
          />
        ) : (
          <input
            className="min-h-12 rounded-2xl border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
            onKeyDown={stopTextKeyPropagation}
            onChange={(event) => updateField(field.key, event.target.value)}
            value={content[field.key]}
          />
        )}
      </label>
    );
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
                label: "Highlights, 1 per lijn",
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
                label: "Tekst bij ingevulde vergaderingen, gebruik {aantal}",
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
            "Deze foto staat op de homepagekaart.",
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
              inhoud aan en controleer rechts meteen het voorbeeld.
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
            <h2 className="text-xl font-bold">Nog geen beheerwachtwoord</h2>
            <p className="mt-3 leading-7">
              Maak lokaal een bestand <code>.dev.vars</code> aan in de
              projectmap en zet daarin ADMIN_PASSWORD en ADMIN_SESSION_SECRET.
            </p>
          </section>
        ) : null}

        {!authenticated ? (
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
              Demo-authenticatie: vervang deze tijdelijke gebruikers later door
              echte beveiligde accounts voordat de site publiek gebruikt wordt.
            </p>
          </form>
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
                      "Wordt gebruikt in de navigatie en footer.",
                      true
                    )}
                  </article>
                </div>
              ) : null}

              {activeSectionId === "homepage" ? (
                <div className="grid gap-6">
                  {homepageGroups.map((group) => (
                    <article
                      className="rounded-3xl border border-slate-200 p-5"
                      key={group.title}
                    >
                      <div className="mb-6">
                        <h2 className="text-2xl font-black">{group.title}</h2>
                        <p className="mt-2 text-slate-600">
                          {group.description}
                        </p>
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        {group.fields.map(renderField)}
                      </div>
                    </article>
                  ))}
                  <article className="rounded-3xl border border-slate-200 p-5">
                    <div className="mb-5">
                      <h2 className="text-2xl font-black">
                        Homepagina onderdelen
                      </h2>
                      <p className="mt-2 text-slate-600">
                        Deze blokken staan op de homepagina, maar hun inhoud
                        wordt op logischere plekken beheerd.
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        [
                          "Intro",
                          "De algemene intro onder de hero staat vast in de sitecode.",
                          "Bekijk homepage",
                        ],
                        [
                          "Takken-preview",
                          "Logo's, leeftijden en takpagina's beheer je onder Pagina's.",
                          "Naar Pagina's",
                        ],
                        [
                          "Activiteiten-preview",
                          "Intro's voor activiteiten en steunacties beheer je onder Pagina's.",
                          "Naar Pagina's",
                        ],
                        [
                          "Sfeerbeelden",
                          "Hoofdfoto's en collages beheer je onder Media.",
                          "Naar Media",
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

                  <div className="mb-6 flex flex-wrap gap-2">
                    {branchProfiles.map((branch) => (
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
                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        {renderField({
                          key: activeBranch.contentKeys.age,
                          label: "Leeftijd",
                        })}
                        {renderField({
                          key: activeBranch.contentKeys.shortDescription,
                          label: "Korte tekst op homepage",
                          kind: "textarea",
                        })}
                        {renderField({
                          key: activeBranch.contentKeys.intro,
                          label: "Intro op detailpagina",
                          kind: "textarea",
                        })}
                        {renderField({
                          key: activeBranch.contentKeys.highlights,
                          label: "Highlights, 1 per lijn",
                          kind: "textarea",
                        })}
                        {renderField({
                          key: activeBranch.contentKeys.leaderNames,
                          label: "Namen leiding, 1 per lijn",
                          kind: "textarea",
                        })}
                      </div>
                    </article>

                    <article className="rounded-3xl border border-slate-200 p-5">
                      <h3 className="text-xl font-black">Detailblokken</h3>
                      <div className="mt-5 grid gap-5">
                        {activeBranch.contentKeys.blocks.map((block, index) => (
                          <div
                            className="grid gap-5 rounded-3xl bg-[#fbfdf9] p-5 md:grid-cols-2"
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
                      sfeerbeeld meerdere collagefoto&apos;s. Bestanden worden
                      via de media-endpoint opgeslagen; de gebruikte URL-lijsten
                      staan in de site-content.
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
                </div>
              ) : null}

              {activeSectionId === "pages" ? (
                <div className="grid gap-6">
                  {renderBranchesManager()}
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
                                {group.fields.map(renderField)}
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
                            ["Foto's", "/#fotos"],
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
