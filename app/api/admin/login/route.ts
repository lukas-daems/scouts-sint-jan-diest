import {
  createAdminSessionCookie,
  getAdminAuthStatus,
  verifyAdminLogin,
} from "../auth";

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

  const session = verifyAdminLogin(
    payload.username ?? "groepsleiding",
    payload.password ?? ""
  );

  if (!session) {
    return Response.json(
      { error: "Ongeldige gebruikersnaam of wachtwoord." },
      { status: 401 }
    );
  }

  return Response.json(
    { ok: true, session },
    {
      headers: {
        "Set-Cookie": await createAdminSessionCookie(request, session),
      },
    }
  );
}
