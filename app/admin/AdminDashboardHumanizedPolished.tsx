import Link from "next/link";
import AdminDashboardHumanized from "./AdminDashboardHumanized";

export default function AdminDashboardHumanizedPolished() {
  return (
    <div className="admin-humanized-polish bg-[#eef7ec]">
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
      <div className="mx-auto max-w-[1400px] px-6 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-emerald-100 bg-white/80 px-5 py-4 text-sm shadow-sm shadow-emerald-950/5 backdrop-blur-xl">
          <div>
            <p className="font-black text-slate-950">Documenten nodig voor ouders?</p>
            <p className="text-slate-500">
              Upload hier kampboekjes, medische fiches en bagagelijsten als PDF of Word-bestand.
            </p>
          </div>
          <Link
            className="rounded-full bg-[#103001] px-5 py-3 font-black text-white shadow-lg shadow-emerald-950/20"
            href="/admin/documenten"
          >
            Documentbibliotheek
          </Link>
        </div>
      </div>
      <AdminDashboardHumanized />
    </div>
  );
}
