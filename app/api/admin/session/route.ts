import { getAdminAuthStatus, getAdminSetupHelp, getAdminSession } from "../auth";

export async function GET(request: Request) {
  const authStatus = getAdminAuthStatus();
  const session = await getAdminSession(request);

  return Response.json({
    authenticated: Boolean(session),
    configured: authStatus.configured,
    missing: authStatus.missing,
    users: authStatus.users,
    setupHelp: getAdminSetupHelp(),
    session,
  });
}
