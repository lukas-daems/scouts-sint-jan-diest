import { env } from "cloudflare:workers";
import {
  defaultSiteContent,
  editableSiteContentKeys,
  normalizeSiteContentValue,
  sanitizeSiteContent,
  type EditableSiteContent,
} from "@/app/lib/site-content-defaults";

type SiteContentRow = {
  key: keyof EditableSiteContent;
  value: string;
};

export type SiteContentStatus = {
  source: "database" | "defaults";
  error?: string;
};

const createTableSql =
  "CREATE TABLE IF NOT EXISTS site_content (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL, updated_at INTEGER NOT NULL)";

function getD1Binding() {
  const runtimeEnv = env as unknown as { DB?: D1Database };
  return runtimeEnv.DB ?? null;
}

async function ensureSiteContentTable(db: D1Database) {
  await db.prepare(createTableSql).run();
}

function overlayDefaults(rows: SiteContentRow[]) {
  const content = { ...defaultSiteContent };

  for (const row of rows) {
    if (editableSiteContentKeys.includes(row.key)) {
      content[row.key] = normalizeSiteContentValue(row.key, row.value);
    }
  }

  return content;
}

function describeDatabaseError(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Onbekende databankfout.";
}

export async function getSiteContentWithStatus(): Promise<{
  content: EditableSiteContent;
  status: SiteContentStatus;
}> {
  const db = getD1Binding();

  if (!db) {
    return {
      content: defaultSiteContent,
      status: {
        source: "defaults",
        error:
          "De databankbinding DB is niet beschikbaar. De site gebruikt nu standaardinhoud.",
      },
    };
  }

  try {
    await ensureSiteContentTable(db);
    const result = await db.prepare("SELECT key, value FROM site_content").all();
    return {
      content: overlayDefaults((result.results ?? []) as SiteContentRow[]),
      status: { source: "database" },
    };
  } catch (error) {
    return {
      content: defaultSiteContent,
      status: {
        source: "defaults",
        error: `De databank kon niet gelezen worden. De site gebruikt nu standaardinhoud. Technische fout: ${describeDatabaseError(error)}`,
      },
    };
  }
}

export async function getSiteContent(): Promise<EditableSiteContent> {
  const { content } = await getSiteContentWithStatus();
  return content;
}

export async function updateSiteContent(
  payload: Partial<Record<keyof EditableSiteContent, unknown>>
) {
  const db = getD1Binding();

  if (!db) {
    throw new Error("De databasebinding DB is niet beschikbaar.");
  }

  const content = sanitizeSiteContent(payload);
  const now = Date.now();

  await ensureSiteContentTable(db);
  await db.batch(
    editableSiteContentKeys.map((key) =>
      db
        .prepare(
          "INSERT INTO site_content (key, value, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
        )
        .bind(key, content[key], now)
    )
  );

  return content;
}
