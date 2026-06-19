import { clearAdminSessionCookie } from "../auth";

export async function POST() {
  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": clearAdminSessionCookie(),
      },
    }
  );
}
