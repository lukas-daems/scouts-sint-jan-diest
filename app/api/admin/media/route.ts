import { env } from "cloudflare:workers";
import { canDeleteMediaKey, canUploadToSlot, getAdminSession } from "../auth";

type MediaEnv = {
  MEDIA?: R2Bucket;
};

const allowedImageExtensions = ["jpg", "jpeg", "png", "webp", "gif", "svg"];
const allowedDocumentExtensions = ["pdf", "doc", "docx"];
const allowedUploadExtensions = [
  ...allowedImageExtensions,
  ...allowedDocumentExtensions,
];

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
  if (fromName && allowedUploadExtensions.includes(fromName)) {
    return fromName;
  }

  if (file.type === "image/jpeg") {
    return "jpg";
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

  if (file.type === "image/svg+xml") {
    return "svg";
  }

  if (file.type === "application/pdf") {
    return "pdf";
  }

  if (file.type === "application/msword") {
    return "doc";
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "docx";
  }

  return "";
}

function getContentType(file: File, extension: string) {
  if (file.type?.startsWith("image/")) {
    return file.type;
  }

  if (file.type && !file.type.startsWith("application/octet-stream")) {
    return file.type;
  }

  const types: Record<string, string> = {
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    gif: "image/gif",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    pdf: "application/pdf",
    png: "image/png",
    svg: "image/svg+xml",
    webp: "image/webp",
  };

  return types[extension] ?? "application/octet-stream";
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
      { error: "Je hebt geen rechten om hier een bestand te uploaden." },
      { status: 403 }
    );
  }

  if (!(file instanceof File)) {
    return Response.json({ error: "Geen bestand ontvangen." }, { status: 400 });
  }

  const extension = getFileExtension(file);
  const hasAllowedExtension = allowedUploadExtensions.includes(extension);
  const isImage = file.type.startsWith("image/") || allowedImageExtensions.includes(extension);
  const isDocument = allowedDocumentExtensions.includes(extension);

  if (!hasAllowedExtension || (!isImage && !isDocument)) {
    return Response.json(
      {
        error:
          "Upload enkel afbeeldingen of documenten als JPG, PNG, WEBP, GIF, SVG, PDF, DOC of DOCX.",
      },
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
