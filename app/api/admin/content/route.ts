import {
  getSiteContent,
  getSiteContentWithStatus,
  updateSiteContent,
} from "@/db/site-content";
import {
  canEditContentKey,
  getAdminSession,
  type AdminSession,
} from "../auth";
import type { EditableSiteContent } from "@/app/lib/site-content-defaults";

async function requireAdmin(request: Request) {
  const session = await getAdminSession(request);

  if (!session) {
    return {
      response: Response.json({ error: "Niet aangemeld." }, { status: 401 }),
      session: null,
    };
  }

  return { response: null, session };
}

function mergeAllowedContent(
  currentContent: EditableSiteContent,
  payload: Record<string, unknown>,
  session: AdminSession
) {
  if (session.role === "superadmin") {
    return payload;
  }

  const nextContent: Partial<Record<keyof EditableSiteContent, unknown>> = {
    ...currentContent,
  };

  for (const [key, value] of Object.entries(payload)) {
    const contentKey = key as keyof EditableSiteContent;
    if (canEditContentKey(session, contentKey)) {
      nextContent[contentKey] = value;
    }
  }

  return nextContent;
}

export async function GET(request: Request) {
  const { response } = await requireAdmin(request);
  if (response) {
    return response;
  }

  const { content, status } = await getSiteContentWithStatus();
  return Response.json({ content, status });
}

export async function PUT(request: Request) {
  const { response, session } = await requireAdmin(request);
  if (response) {
    return response;
  }
  if (!session) {
    return Response.json({ error: "Niet aangemeld." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as {
    content?: Record<string, unknown>;
  };
  try {
    const currentContent = await getSiteContent();
    const allowedContent = mergeAllowedContent(
      currentContent,
      payload.content ?? {},
      session
    );
    const content = await updateSiteContent(allowedContent);

    return Response.json({ content });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Opslaan is niet gelukt door een databankfout.",
      },
      { status: 500 }
    );
  }
}
