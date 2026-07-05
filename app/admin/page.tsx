import AdminDashboard from "./AdminDashboard";
import AdminInterfaceCleanup from "./AdminInterfaceCleanup";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <>
      <AdminInterfaceCleanup />
      <AdminDashboard />
    </>
  );
}
