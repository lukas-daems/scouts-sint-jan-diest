import { env } from "cloudflare:workers";
import { branchProfiles } from "../../lib/branches";
import type { EditableSiteContent } from "../../lib/site-content-defaults";

export const ADMIN_COOKIE = "scouts_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export type AdminRole = "superadmin" | "branch";

export type AdminSession = {
  username: string;
  displayName: string;
  role: AdminRole;
  branchSlug?: string;
};

type AdminUser = AdminSession & {
  password: string;
};

function getRuntimeValue(key: string) {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const globalProcess = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  let workerValue: string | undefined;

  try {
    workerValue = runtimeEnv[key];
  } catch {
    workerValue = undefined;
  }

  return workerValue ?? globalProcess.process?.env?.[key];
}

export function getAdminPassword() {
  // Demo fallback for local testing. TODO: replace with real secure auth before publishing.
  return getRuntimeValue("ADMIN_PASSWORD") ?? "scouts-admin";
}

function getSessionSecret() {
  return (
    getRuntimeValue("ADMIN_SESSION_SECRET") ||
    getRuntimeValue("ADMIN_PASSWORD") ||
    "scouts-demo-session-secret"
  );
}

function getDemoAdminUsers(): AdminUser[] {
  // TODO: vervang deze demo-gebruikers later door echte beveiligde authenticatie.
  return [
    {
      username: "groepsleiding",
      password: getAdminPassword(),
      displayName: "Groepsleiding",
      role: "superadmin",
    },
    {
      username: "kapoenleiding",
      password: "kapoenen",
      displayName: "Kapoenleiding",
      role: "branch",
      branchSlug: "kapoenen",
    },
    {
      username: "welpenleiding",
      password: "welpen",
      displayName: "Welpenleiding",
      role: "branch",
      branchSlug: "welpen",
    },
    {
      username: "jongverkennerleiding",
      password: "jongverkenners",
      displayName: "Jongverkennerleiding",
      role: "branch",
      branchSlug: "jongverkenners",
    },
    {
      username: "verkennerleiding",
      password: "verkenners",
      displayName: "Verkennerleiding",
      role: "branch",
      branchSlug: "verkenners",
    },
    {
      username: "jinleiding",
      password: "jins",
      displayName: "Jinleiding",
      role: "branch",
      branchSlug: "jins",
    },
  ];
}

function toHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function signSession(payload: string) {
  const secret = getSessionSecret();
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return toHex(signature);
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return difference === 0;
}

function getCookieFromHeader(cookieHeader: string, name: string) {
  const cookies = cookieHeader.split(";").map((part) => part.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function getUserByUsername(username: string) {
  return getDemoAdminUsers().find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
}

export async function createAdminSessionCookie(
  request: Request,
  session: AdminSession
) {
  const expiresAt = String(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  const payload = [
    expiresAt,
    session.username,
    session.role,
    session.branchSlug ?? "",
  ].join("|");
  const signature = await signSession(payload);
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";

  return `${ADMIN_COOKIE}=${encodeURIComponent(
    `${payload}.${signature}`
  )}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure}`;
}

export function clearAdminSessionCookie() {
  return `${ADMIN_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

export async function getAdminSessionFromCookieHeader(cookieHeader: string) {
  const value = getCookieFromHeader(cookieHeader, ADMIN_COOKIE);

  if (!value) {
    return null;
  }

  const lastDotIndex = value.lastIndexOf(".");
  if (lastDotIndex < 0) {
    return null;
  }

  const payload = value.slice(0, lastDotIndex);
  const signature = value.slice(lastDotIndex + 1);
  const [expiresAt, username, role, branchSlug] = payload.split("|");

  if (!expiresAt || !username || Number(expiresAt) < Date.now()) {
    return null;
  }

  const expectedSignature = await signSession(payload);
  if (!constantTimeEqual(signature, expectedSignature)) {
    return null;
  }

  const user = getUserByUsername(username);
  if (!user || user.role !== role) {
    return null;
  }

  if (user.role === "branch" && user.branchSlug !== branchSlug) {
    return null;
  }

  return {
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    branchSlug: user.branchSlug,
  } satisfies AdminSession;
}

export async function getAdminSession(request: Request) {
  return getAdminSessionFromCookieHeader(
    request.headers.get("cookie") ?? ""
  );
}

export async function isAdminRequest(request: Request) {
  return Boolean(await getAdminSession(request));
}

export function verifyAdminLogin(username: string, password: string) {
  const normalizedUsername = username.trim() || "groepsleiding";
  const user = getUserByUsername(normalizedUsername);

  if (!user || !password) {
    return null;
  }

  if (user.password !== password) {
    return null;
  }

  return {
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    branchSlug: user.branchSlug,
  } satisfies AdminSession;
}

export function verifyAdminPassword(password: string) {
  return Boolean(verifyAdminLogin("groepsleiding", password));
}

export function canEditContentKey(
  session: AdminSession,
  key: keyof EditableSiteContent
) {
  if (session.role === "superadmin") {
    return true;
  }

  const branch = branchProfiles.find(
    (item) => item.slug === session.branchSlug
  );
  if (!branch) {
    return false;
  }

  const allowedKeys: Array<keyof EditableSiteContent> = [
    branch.logoKey,
    branch.contentKeys.age,
    branch.contentKeys.shortDescription,
    branch.contentKeys.intro,
    branch.contentKeys.highlights,
    branch.contentKeys.program,
    branch.contentKeys.imageUrl,
    branch.contentKeys.leaderNames,
    branch.contentKeys.leaderPhotoUrl,
    branch.contentKeys.planning.day,
    branch.contentKeys.planning.time,
    branch.contentKeys.planning.timeNote,
    branch.contentKeys.planning.location,
    branch.contentKeys.planning.bring,
    branch.contentKeys.planning.bringNote,
    branch.contentKeys.planning.contact,
    branch.contentKeys.planning.countText,
    branch.contentKeys.planning.emptyText,
    ...branch.contentKeys.blocks.flatMap((block) => [block.title, block.text]),
  ];

  return allowedKeys.includes(key);
}

export function canUploadToSlot(session: AdminSession, slot: string) {
  if (session.role === "superadmin") {
    return true;
  }

  const branch = branchProfiles.find(
    (item) => item.slug === session.branchSlug
  );

  if (!branch) {
    return false;
  }

  return [
    branch.logoKey,
    branch.contentKeys.imageUrl,
    branch.contentKeys.leaderPhotoUrl,
  ].includes(slot as keyof EditableSiteContent);
}
