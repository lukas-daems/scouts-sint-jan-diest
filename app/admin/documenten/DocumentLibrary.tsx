"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type AdminSession = {
  displayName: string;
  role: "superadmin" | "branch";
};

type MediaItem = {
  key: string;
  url: string;
  size: number;
  uploaded: string;
  contentType: string;
};

type CampDocument = {
  label: string;
  href: string;
  description: string;
};

type SessionResponse = {
  authenticated: boolean;
  session?: AdminSession | null;
};

type MediaResponse = {
  media?: MediaItem[];
  error?: string;
};

type ContentResponse = {
  content?: Record<string, string>;
  error?: string;
};

const documentPattern = /\.(pdf|doc|docx)$/i;
const acceptedDocuments = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const fallbackCampDocuments: CampDocument[] = [
  {
    label: "Medische fiche",
    href: "/#contact",
    description: "Verplicht voor kamp",
  },
  {
    label: "Kampboekje",
    href: "/#contact",
    description: "Alle praktische info",
  },
  {
    label: "Bagagelijst",
    href: "/#contact",
    description: "Wat je moet meenemen",
  },
];

function isDocument(item: MediaItem) {
  const contentType = item.contentType.toLowerCase();
  return (
    documentPattern.test(item.key) ||
    contentType.includes("pdf") ||
    contentType.includes("word")
  );
}

function parseCampDocuments(value: string) {
  const parsed = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", href = "", description = ""] = line.split("|");
      return {
        label: label.trim(),
        href: href.trim(),
        description: description.trim(),
      };
    })
    .filter((item) => item.label);

  return parsed.length ? parsed : fallbackCampDocuments;
}

function stringifyCampDocuments(items: CampDocument[]) {
  return items
    .filter((item) => item.label.trim())
    .map(
      (item) =>
        `${item.label.trim()}|${item.href.trim() || "/#contact"}|${item.description.trim()}`
    )
    .join("\n");
}

function formatBytes(size: number) {
  if (!Number.isFinite(size) || size <= 0) {
    return "Onbekende grootte";
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  if (!value) {
    return "Datum onbekend";
  }

  try {
    return new Intl.DateTimeFormat("nl-BE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "Datum onbekend";
  }
}

function shortName(key: string) {
  return key.replace(/^uploads\//, "");
}

export default function DocumentLibrary() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [content, setContent] = useState<Record<string, string> | null>(null);
  const [campDocuments, setCampDocuments] =
    useState<CampDocument[]>(fallbackCampDocuments);
  const [uploading, setUploading] = useState(false);
  const [savingCamp, setSavingCamp] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const documents = useMemo(() => media.filter(isDocument), [media]);
  const canManageDocuments = session?.role === "superadmin";

  async function loadDocuments() {
    setError("");
    const response = await fetch("/api/admin/media", { cache: "no-store" });
    const payload = (await response.json().catch(() => ({}))) as MediaResponse;

    if (!response.ok) {
      setError(payload.error || "Documenten konden niet geladen worden.");
      return;
    }

    setMedia(payload.media || []);
  }

  async function loadContent() {
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    const payload = (await response.json().catch(() => ({}))) as ContentResponse;

    if (!response.ok || !payload.content) {
      setError(payload.error || "Kampdocumenten konden niet geladen worden.");
      return;
    }

    setContent(payload.content);
    setCampDocuments(parseCampDocuments(payload.content.pageZomerkampDocuments || ""));
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      const sessionResponse = await fetch("/api/admin/session", {
        cache: "no-store",
      });
      const sessionPayload =
        (await sessionResponse.json().catch(() => ({}))) as SessionResponse;

      if (cancelled) {
        return;
      }

      if (!sessionPayload.authenticated || !sessionPayload.session) {
        setSession(null);
        setLoading(false);
        return;
      }

      setSession(sessionPayload.session);
      await Promise.all([loadDocuments(), loadContent()]);
      if (!cancelled) {
        setLoading(false);
      }
    }

    load().catch(() => {
      if (!cancelled) {
        setError("De documentbibliotheek kon niet geladen worden.");
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function updateCampDocument(
    index: number,
    key: keyof CampDocument,
    value: string
  ) {
    setCampDocuments((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    );
  }

  async function uploadDocument(file: File | undefined, campIndex?: number) {
    if (!file) {
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("slot", "documents");

    const response = await fetch("/api/admin/media", {
      body: formData,
      method: "POST",
    });
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      url?: string;
    };

    if (!response.ok || !payload.url) {
      setError(payload.error || "Uploaden is niet gelukt.");
      setUploading(false);
      return;
    }

    if (typeof campIndex === "number") {
      updateCampDocument(campIndex, "href", payload.url);
      setMessage(
        "Document toegevoegd en gekoppeld. Klik nog op 'Kampdocumenten opslaan'."
      );
    } else {
      setMessage(
        "Document toegevoegd. Je kunt de link nu gebruiken bij kampdocumenten."
      );
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
    await loadDocuments();
    setUploading(false);
  }

  async function saveCampDocuments() {
    if (!content) {
      setError("De huidige site-inhoud kon niet geladen worden.");
      return;
    }

    setSavingCamp(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/admin/content", {
      body: JSON.stringify({
        content: {
          ...content,
          pageZomerkampDocuments: stringifyCampDocuments(campDocuments),
        },
      }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });
    const payload = (await response.json().catch(() => ({}))) as ContentResponse;

    if (!response.ok || !payload.content) {
      setError(payload.error || "Kampdocumenten opslaan is niet gelukt.");
      setSavingCamp(false);
      return;
    }

    setContent(payload.content);
    setCampDocuments(parseCampDocuments(payload.content.pageZomerkampDocuments || ""));
    setMessage("Kampdocumenten opgeslagen.");
    setSavingCamp(false);
  }

  async function copyUrl(item: MediaItem) {
    const absoluteUrl = `${window.location.origin}${item.url}`;
    await navigator.clipboard.writeText(absoluteUrl);
    setMessage("Link gekopieerd.");
  }

  async function deleteDocument(item: MediaItem) {
    if (!window.confirm("Dit document verwijderen uit de bibliotheek?")) {
      return;
    }

    setMessage("");
    setError("");

    const response = await fetch("/api/admin/media", {
      body: JSON.stringify({ key: item.key }),
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    if (!response.ok) {
      setError(payload.error || "Verwijderen is niet gelukt.");
      return;
    }

    setMessage("Document verwijderd.");
    await loadDocuments();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#eef7ec] p-8 text-slate-950">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-emerald-100 bg-white p-10 shadow-xl">
          Documentbibliotheek laden...
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#eef7ec] p-8 text-slate-950">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-emerald-100 bg-white p-10 shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-800">
            Documenten
          </p>
          <h1 className="mt-4 text-4xl font-black">Eerst aanmelden</h1>
          <p className="mt-4 text-slate-600">
            Meld je aan in de beheeromgeving om documenten te beheren.
          </p>
          <Link
            className="mt-8 inline-flex rounded-full bg-[#103001] px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/20"
            href="/admin"
          >
            Naar beheer
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef7ec] p-8 text-slate-950">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-xl shadow-emerald-950/10 backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-800">
                Documentbibliotheek
              </p>
              <h1 className="mt-3 text-4xl font-black">Documenten beheren</h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Upload hier documenten zoals kampboekje, medische fiche of bagagelijst. Koppel ze daarna rechtstreeks aan de kampdocumenten die ouders op de site zien.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                className="rounded-full border border-emerald-100 bg-white px-5 py-3 text-sm font-black text-[#103001] shadow-sm"
                href="/admin"
              >
                Terug naar beheer
              </Link>
              <Link
                className="rounded-full bg-[#103001] px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/20"
                href="/"
              >
                Bekijk site
              </Link>
            </div>
          </div>
        </header>

        {!canManageDocuments && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm font-semibold text-amber-900">
            Alleen de groepsleiding kan algemene documenten uploaden, koppelen of verwijderen.
          </div>
        )}

        {message && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-900">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-900">
            {error}
          </div>
        )}

        <section className="rounded-[2rem] border border-emerald-100 bg-white p-7 shadow-lg shadow-emerald-950/5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-800">
                Zomerkamp
              </p>
              <h2 className="mt-3 text-2xl font-black">Kampdocumenten op de site</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Dit zijn de documenten die ouders op de zomerkamppagina zien. Upload of kies een document, pas de tekst aan en sla daarna op.
              </p>
            </div>
            <button
              className="rounded-full bg-[#103001] px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/20 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canManageDocuments || savingCamp}
              onClick={saveCampDocuments}
              type="button"
            >
              {savingCamp ? "Opslaan..." : "Kampdocumenten opslaan"}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {campDocuments.map((item, index) => (
              <div
                className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:grid-cols-[0.85fr_1fr]"
                key={`${item.label}-${index}`}
              >
                <div className="space-y-3">
                  <label className="block text-sm font-black text-slate-900">
                    Naam op de knop
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-700"
                      disabled={!canManageDocuments}
                      onChange={(event) =>
                        updateCampDocument(index, "label", event.target.value)
                      }
                      value={item.label}
                    />
                  </label>
                  <label className="block text-sm font-black text-slate-900">
                    Korte uitleg voor ouders
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-700"
                      disabled={!canManageDocuments}
                      onChange={(event) =>
                        updateCampDocument(
                          index,
                          "description",
                          event.target.value
                        )
                      }
                      value={item.description}
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-black text-slate-900">
                    Link of geüpload document
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-700"
                      disabled={!canManageDocuments}
                      onChange={(event) =>
                        updateCampDocument(index, "href", event.target.value)
                      }
                      placeholder="/api/media/uploads/... of externe link"
                      value={item.href}
                    />
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-700"
                      disabled={!canManageDocuments || documents.length === 0}
                      onChange={(event) => {
                        if (event.target.value) {
                          updateCampDocument(index, "href", event.target.value);
                        }
                      }}
                      value=""
                    >
                      <option value="">Kies uit bibliotheek</option>
                      {documents.map((document) => (
                        <option key={document.key} value={document.url}>
                          {shortName(document.key)}
                        </option>
                      ))}
                    </select>
                    <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-black text-[#103001]">
                      {uploading ? "Uploaden..." : "Bestand uploaden"}
                      <input
                        accept={acceptedDocuments}
                        className="sr-only"
                        disabled={!canManageDocuments || uploading}
                        onChange={(event) =>
                          uploadDocument(event.target.files?.[0], index)
                        }
                        type="file"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="mt-5 rounded-full border border-emerald-100 bg-white px-5 py-3 text-sm font-black text-[#103001]"
            disabled={!canManageDocuments}
            onClick={() =>
              setCampDocuments((items) => [
                ...items,
                { label: "Nieuw document", href: "/#contact", description: "" },
              ])
            }
            type="button"
          >
            Documentregel toevoegen
          </button>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-emerald-100 bg-white p-7 shadow-lg shadow-emerald-950/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-800">
              Upload
            </p>
            <h2 className="mt-3 text-2xl font-black">Los document toevoegen</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Ondersteund: PDF, DOC en DOCX. Voor ouders opent een PDF meestal meteen in de browser; Word-bestanden worden vaak gedownload.
            </p>
            <input
              ref={inputRef}
              accept={acceptedDocuments}
              className="mt-6 block w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[#103001] file:px-4 file:py-2 file:text-sm file:font-black file:text-white"
              disabled={!canManageDocuments || uploading}
              onChange={(event) => uploadDocument(event.target.files?.[0])}
              type="file"
            />
            <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
              Deze bibliotheek gebruikt dezelfde Cloudflare-opslag als de foto's. Later kunnen we hier extra documentplekken aan toevoegen als dat nodig is.
            </p>
          </div>

          <div className="rounded-[2rem] border border-emerald-100 bg-white p-7 shadow-lg shadow-emerald-950/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-800">
                  Bibliotheek
                </p>
                <h2 className="mt-3 text-2xl font-black">Geüploade documenten</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-900">
                {documents.length} documenten
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {documents.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center text-sm font-semibold text-slate-600">
                  Nog geen documenten geüpload.
                </div>
              ) : (
                documents.map((item) => (
                  <article
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    key={item.key}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-black text-slate-950">
                          {shortName(item.key)}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatBytes(item.size)} · {formatDate(item.uploaded)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#103001]"
                          href={item.url}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Openen
                        </a>
                        <button
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#103001]"
                          onClick={() => copyUrl(item)}
                          type="button"
                        >
                          Link kopiëren
                        </button>
                        {canManageDocuments && (
                          <button
                            className="rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-black text-red-700"
                            onClick={() => deleteDocument(item)}
                            type="button"
                          >
                            Verwijderen
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
