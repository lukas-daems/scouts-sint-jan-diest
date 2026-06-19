import { env } from "cloudflare:workers";

type MediaEnv = {
  MEDIA?: R2Bucket;
};

function getMediaBucket() {
  const runtimeEnv = env as unknown as MediaEnv;

  try {
    return runtimeEnv.MEDIA ?? null;
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string[] }> }
) {
  const bucket = getMediaBucket();
  const { key } = await context.params;
  const objectKey = key.join("/");

  if (!bucket || !objectKey) {
    return new Response("Not found", { status: 404 });
  }

  const object = await bucket.get(objectKey);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type":
        object.httpMetadata?.contentType ?? "application/octet-stream",
    },
  });
}
