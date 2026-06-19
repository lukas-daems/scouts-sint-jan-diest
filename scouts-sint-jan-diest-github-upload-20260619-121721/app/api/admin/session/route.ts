import { getAdminSession } from "../auth";

export async function GET(request: Request) {
  const session = await getAdminSession(request);

  return Response.json({
    authenticated: Boolean(session),
    configured: true,
    session,
  });
}
