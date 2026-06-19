import { env } from "cloudflare:workers";
import { canUploadToSlot, getAdminSession } from "../auth";

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

export async function POST(request: Request) {
  const session = await getAdminSession(request);

  if (!session) {
    return Response.json({ error: "Niet aangemeld." }, { status: 401 });
  }

  const bucket = getMediaBucket();
  if (!bucket) {
    return Response.json(
      { error: "MEDIA opslag is niet beschikbaar." },
      { status: 500 }
    );
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
