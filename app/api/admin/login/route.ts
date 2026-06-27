import {
  createAdminSessionCookie,
  getAdminAuthStatus,
  verifyAdminLogin,
} from "../auth";

type LoginAttempt = {
  count: number;
  firstAttemptAt: number;
  lockedUntil: number;
};

const attemptWindowMs = 15 * 60 * 1000;
const lockoutMs = 15 * 60 * 1000;
const maxFailedAttempts = 8;
const loginAttempts = new Map<string, LoginAttempt>();

function getClientIdentifier(request: Request, username: string) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const clientIp =
    request.headers.get("cf-connecting-ip") ??
    forwardedFor.split(",")[0]?.trim() ??
    "local";

  return `${clientIp}:${username.trim().toLowerCase() || "groepsleiding"}`;
}

function getAttemptState(identifier: string) {
  const now = Date.now();
  const current = loginAttempts.get(identifier);

  if (!current || now - current.firstAttemptAt > attemptWindowMs) {
    const fresh = { count: 0, firstAttemptAt: now, lockedUntil: 0 };
    loginAttempts.set(identifier, fresh);
    return fresh;
  }

  return current;
}

function recordFailedAttempt(identifier: string) {
  const attempt = getAttemptState(identifier);
  attempt.count += 1;

  if (attempt.count >= maxFailedAttempts) {
    attempt.lockedUntil = Date.now() + lockoutMs;
  }

  loginAttempts.set(identifier, attempt);
  return attempt;
}

function clearFailedAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}

export async function POST(request: Request) {
  const authStatus = getAdminAuthStatus();
  if (!authStatus.configured) {
    return Response.json(
      {
        error:
          "Beheer is nog niet geconfigureerd. Stel ADMIN_PASSWORD en ADMIN_SESSION_SECRET in.",
        missing: authStatus.missing,
      },
      { status: 503 }
    );
  }

  const payload = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };

  const username = payload.username ?? "groepsleiding";
  const identifier = getClientIdentifier(request, username);
  const attempt = getAttemptState(identifier);

  if (attempt.lockedUntil > Date.now()) {
    const minutesLeft = Math.max(
      1,
      Math.ceil((attempt.lockedUntil - Date.now()) / 60000)
    );

    return Response.json(
      {
        error: `Te veel foute aanmeldpogingen. Probeer opnieuw over ongeveer ${minutesLeft} minuten.`,
      },
      {
        headers: { "Retry-After": String(minutesLeft * 60) },
        status: 429,
      }
    );
  }

  const session = verifyAdminLogin(
    username,
    payload.password ?? ""
  );

  if (!session) {
    recordFailedAttempt(identifier);
    return Response.json(
      { error: "Ongeldige gebruikersnaam of wachtwoord." },
      { status: 401 }
    );
  }

  clearFailedAttempts(identifier);

  return Response.json(
    { ok: true, session },
    {
      headers: {
        "Set-Cookie": await createAdminSessionCookie(request, session),
      },
    }
  );
}
