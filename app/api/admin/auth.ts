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

type AdminUserConfig = Omit<AdminSession, "username" | "displayName"> & {
  username: string;
  displayName: string;
  passwordKeys: string[];
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

function getFirstRuntimeValue(keys: string[]) {
  for (const key of keys) {
    const value = getRuntimeValue(key)?.trim();
    if (value) {
      return value;
    }
  }

  return "";
}

export function getAdminPassword() {
  return getFirstRuntimeValue(["ADMIN_SUPERADMIN_PASSWORD", "ADMIN_PASSWORD"]);
}

function getSessionSecret() {
  return getFirstRuntimeValue(["ADMIN_SESSION_SECRET"]);
}

const adminUserConfigs: AdminUserConfig[] = [
  {
    username: "groepsleiding",
    displayName: "Groepsleiding",
    role: "superadmin",
    passwordKeys: ["ADMIN_SUPERADMIN_PASSWORD", "ADMIN_PASSWORD"],
  },
  {
    username: "kapoenleiding",
    displayName: "Kapoenleiding",
    role: "branch",
    branchSlug: "kapoenen",
    passwordKeys: ["KAPOENLEIDING_PASSWORD", "KAPOENEN_PASSWORD"],
  },
  {
    username: "welpenleiding",
    displayName: "Welpenleiding",
    role: "branch",
    branchSlug: "welpen",
    passwordKeys: ["WELPENLEIDING_PASSWORD", "WELPEN_PASSWORD"],
  },
  {
    username: "jongverkennerleiding",
    displayName: "Jongverkennerleiding",
    role: "branch",
    branchSlug: "jongverkenners",
    passwordKeys: [
      "JONGVERKENNERLEIDING_PASSWORD",
      "JONGVERKENNERS_PASSWORD",
    ],
  },
  {
    username: "verkennerleiding",
    displayName: "Verkennerleiding",
    role: "branch",
    branchSlug: "verkenners",
    passwordKeys: ["VERKENNERLEIDING_PASSWORD", "VERKENNERS_PASSWORD"],
  },
  {
    username: "jinleiding",
    displayName: "Jinleiding",
    role: "branch",
    branchSlug: "jins",
    passwordKeys: ["JINLEIDING_PASSWORD", "JINS_PASSWORD"],
  },
];

function getAdminUsers(): AdminUser[] {
  return adminUserConfigs
    .map((user) => ({
      ...user,
      password: getFirstRuntimeValue(user.passwordKeys),
    }))
    .filter((user) => user.password);
}

export function getAdminAuthStatus() {
  const hasSessionSecret = Boolean(getSessionSecret());
  const hasSuperAdmin = Boolean(getAdminPassword());

  return {
    configured: hasSessionSecret && hasSuperAdmin,
    missing: [
      hasSuperAdmin ? "" : "ADMIN_PASSWORD",
      hasSessionSecret ? "" : "ADMIN_SESSION_SECRET",
    ].filter(Boolean),
    users: getAdminUsers().map((user) => ({
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      branchSlug: user.branchSlug,
    })),
  };
}

function getConfiguredAdminUsers(): AdminUser[] {
  if (!getAdminAuthStatus().configured) {
    return [];
  }

  return getAdminUsers();
}

export function getAdminSetupHelp() {
  return [
    {
      username: "groepsleiding",
      env: "ADMIN_PASSWORD",
      role: "Hoofdadmin",
    },
    {
      username: "kapoenleiding",
      env: "KAPOENLEIDING_PASSWORD",
      role: "Kapoenen",
    },
    {
      username: "welpenleiding",
      env: "WELPENLEIDING_PASSWORD",
      role: "Welpen",
    },
    {
      username: "jongverkennerleiding",
      env: "JONGVERKENNERLEIDING_PASSWORD",
      role: "Jongverkenners",
    },
    {
      username: "verkennerleiding",
      env: "VERKENNERLEIDING_PASSWORD",
      role: "Verkenners",
    },
    {
      username: "jinleiding",
      env: "JINLEIDING_PASSWORD",
      role: "Jins",
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
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET ontbreekt.");
  }
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
  return getConfiguredAdminUsers().find(
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
  if (!getAdminAuthStatus().configured) {
    return null;
  }

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
  if (!getAdminAuthStatus().configured) {
    return null;
  }

  const normalizedUsername = username.trim() || "groepsleiding";
  const user = getUserByUsername(normalizedUsername);

  if (!user || !password) {
    return null;
  }

  if (!constantTimeEqual(user.password, password)) {
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
    branch.contentKeys.importantDates,
    branch.contentKeys.imageUrl,
    branch.contentKeys.leaderNames,
    branch.contentKeys.leaderPhotoUrl,
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

export function canDeleteMediaKey(session: AdminSession, key: string) {
  if (session.role === "superadmin") {
    return true;
  }

  const branch = branchProfiles.find(
    (item) => item.slug === session.branchSlug
  );

  if (!branch) {
    return false;
  }

  const allowedPrefixes = [
    branch.logoKey,
    branch.contentKeys.imageUrl,
    branch.contentKeys.leaderPhotoUrl,
  ].map((slot) => `uploads/${slot}-`);

  return allowedPrefixes.some((prefix) => key.startsWith(prefix));
}
