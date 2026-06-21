import { env } from "cloudflare:workers";
import { canDeleteMediaKey, canUploadToSlot, getAdminSession } from "../auth";

type MediaEnv = {
  MEDIA?: R2Bucket;
};

const allowedImageExtensions = ["jpg", "jpeg", "png", "webp", "gif", "svg"];

function getMediaBucket() {
  const runtimeEnv = env as unknown as MediaEnv;

  try {
    return runtimeEnv.MEDIA ?? null;
  } catch {
    return null;
  }
}

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && allowedImageExtensions.includes(fromName)) {
    return fromName;
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  if (file.type === "image/gif") {
    return "gif";
  }

  return "jpg";
}

function getContentType(file: File, extension: string) {
  if (file.type?.startsWith("image/")) {
    return file.type;
  }

  const types: Record<string, string> = {
    gif: "image/gif",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    webp: "image/webp",
  };

  return types[extension] ?? "image/jpeg";
}

function normalizeMediaKey(input: unknown) {
  const value = String(input ?? "").trim();
  if (!value) {
    return "";
  }

  let withoutOrigin = value;
  if (value.startsWith("http")) {
    try {
      withoutOrigin = new URL(value).pathname;
    } catch {
      return "";
    }
  }

  const key = withoutOrigin
    .replace(/^\/api\/media\//, "")
    .replace(/^api\/media\//, "")
    .replace(/^\/+/, "");

  if (!key.startsWith("uploads/") || key.includes("..")) {
    return "";
  }

  return key;
}

async function requireMediaAccess(request: Request) {
  const session = await getAdminSession(request);

  if (!session) {
    return {
      response: Response.json({ error: "Niet aangemeld." }, { status: 401 }),
      session: null,
      bucket: null,
    };
  }

  const bucket = getMediaBucket();
  if (!bucket) {
    return {
      response: Response.json(
        { error: "MEDIA opslag is niet beschikbaar." },
        { status: 500 }
      ),
      session,
      bucket: null,
    };
  }

  return { response: null, session, bucket };
}

export async function GET(request: Request) {
  const { response, bucket } = await requireMediaAccess(request);
  if (response) {
    return response;
  }

  if (!bucket) {
    return Response.json({ media: [] });
  }

  const media: Array<{
    key: string;
    url: string;
    size: number;
    uploaded: string;
    contentType: string;
  }> = [];
  let cursor: string | undefined;

  do {
    const result = await bucket.list({
      cursor,
      limit: 500,
      prefix: "uploads/",
    });

    media.push(
      ...result.objects.map((object) => ({
        key: object.key,
        url: `/api/media/${object.key}`,
        size: object.size,
        uploaded: object.uploaded?.toISOString?.() ?? "",
        contentType: "",
      }))
    );
    cursor = result.truncated ? result.cursor : undefined;
  } while (cursor);

  media.sort((left, right) => right.uploaded.localeCompare(left.uploaded));

  return Response.json({ media });
}

export async function POST(request: Request) {
  const { response, session, bucket } = await requireMediaAccess(request);
  if (response) {
    return response;
  }

  if (!session || !bucket) {
    return Response.json({ error: "Niet aangemeld." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const slot = String(formData.get("slot") ?? "site").replace(/[^a-z0-9-]/gi, "-");

  if (!canUploadToSlot(session, slot)) {
    return Response.json(
      { error: "Je hebt geen rechten om hier een foto te uploaden." },
      { status: 403 }
    );
  }

  if (!(file instanceof File)) {
    return Response.json({ error: "Geen foto ontvangen." }, { status: 400 });
  }

  const extension = getFileExtension(file);
  const hasAllowedExtension = allowedImageExtensions.includes(extension);

  if (!file.type.startsWith("image/") && !hasAllowedExtension) {
    return Response.json(
      { error: "Upload enkel JPG, PNG, WEBP, GIF of SVG afbeeldingen." },
      { status: 400 }
    );
  }

  const key = `uploads/${slot}-${crypto.randomUUID()}.${extension}`;
  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: {
      contentType: getContentType(file, extension),
    },
  });

  return Response.json({ key, url: `/api/media/${key}` }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { response, session, bucket } = await requireMediaAccess(request);
  if (response) {
    return response;
  }

  if (!session || !bucket) {
    return Response.json({ error: "Niet aangemeld." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as {
    key?: string;
    url?: string;
  };
  const key = normalizeMediaKey(payload.key || payload.url);

  if (!key) {
    return Response.json({ error: "Ongeldige mediabestandsnaam." }, { status: 400 });
  }

  if (!canDeleteMediaKey(session, key)) {
    return Response.json(
      { error: "Je hebt geen rechten om dit bestand te verwijderen." },
      { status: 403 }
    );
  }

  await bucket.delete(key);

  return Response.json({ ok: true, key });
}
