"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { EditableSiteContent } from "../lib/site-content-defaults";

type SiteEditorProps = {
  initialContent?: EditableSiteContent;
};

export default function SiteEditor(props: SiteEditorProps) {
  void props.initialContent;
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
        });
        const session = (await response.json()) as { authenticated?: boolean };

        if (mounted) {
          setAuthenticated(Boolean(session.authenticated));
        }
      } catch {
        if (mounted) {
          setAuthenticated(false);
        }
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  if (!authenticated) {
    return null;
  }

  return (
    <Link
      className="fixed bottom-5 right-5 z-[70] rounded-full bg-[#103001] px-5 py-4 text-sm font-bold text-white shadow-2xl shadow-green-950/25 transition hover:-translate-y-0.5 hover:bg-[#1e4b0d] focus:outline-none focus:ring-4 focus:ring-green-200"
      href="/admin"
    >
      Beheer
    </Link>
  );
}
