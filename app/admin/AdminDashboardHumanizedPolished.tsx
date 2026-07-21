import AdminDashboardHumanized from "./AdminDashboardHumanized";

export default function AdminDashboardHumanizedPolished() {
  return (
    <div className="admin-humanized-polish">
      <style>{`
        .admin-humanized-polish div[class*="flex"][class*="flex-wrap"][class*="gap-2"] {
          align-items: flex-start;
          justify-content: flex-start;
        }

        .admin-humanized-polish div[class*="flex"][class*="flex-wrap"][class*="gap-2"] > button[class*="rounded-full"] {
          flex: 0 0 auto;
          width: auto;
          max-width: max-content;
          white-space: nowrap;
        }

        .admin-humanized-polish div[class*="grid"][class*="gap-3"]:has(> button:nth-child(7)) {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .admin-humanized-polish div[class*="grid"][class*="gap-3"]:has(> button:nth-child(7)) > button[class*="rounded-2xl"] {
          display: inline-flex;
          flex: 0 0 auto;
          width: auto;
          max-width: max-content;
          align-items: center;
          gap: 0.65rem;
          border-radius: 999px;
          padding: 0.65rem 1rem;
          text-align: left;
          white-space: nowrap;
        }

        .admin-humanized-polish div[class*="grid"][class*="gap-3"]:has(> button:nth-child(7)) > button[class*="rounded-2xl"] span:first-child {
          font-size: 0.875rem;
          line-height: 1.2;
        }

        .admin-humanized-polish div[class*="grid"][class*="gap-3"]:has(> button:nth-child(7)) > button[class*="rounded-2xl"] span:nth-child(2),
        .admin-humanized-polish div[class*="grid"][class*="gap-3"]:has(> button:nth-child(7)) > button[class*="rounded-2xl"] span:nth-child(3) {
          display: none;
        }
      `}</style>
      <AdminDashboardHumanized />
    </div>
  );
}
