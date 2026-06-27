import type { ReactNode } from "react";

export type IconName =
  | "tree"
  | "users"
  | "spark"
  | "compass"
  | "campfire"
  | "map"
  | "tent"
  | "shield"
  | "heart"
  | "route"
  | "calendar"
  | "flag"
  | "mail"
  | "home"
  | "check";

const iconPaths: Record<IconName, ReactNode> = {
  tree: (
    <>
      <path d="M12 3 5 14h4l-3 5h12l-3-5h4L12 3Z" />
      <path d="M12 18v3" />
    </>
  ),
  users: (
    <>
      <path d="M16 11a4 4 0 1 0-8 0" />
      <path d="M5 21a7 7 0 0 1 14 0" />
      <path d="M18 8a3 3 0 0 1 2.5 4.6" />
      <path d="M6 8a3 3 0 0 0-2.5 4.6" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v5" />
      <path d="M12 16v5" />
      <path d="M3 12h5" />
      <path d="M16 12h5" />
      <path d="m6.5 6.5 3 3" />
      <path d="m14.5 14.5 3 3" />
      <path d="m17.5 6.5-3 3" />
      <path d="m9.5 14.5-3 3" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="m15 9-2 6-4 2 2-6 4-2Z" />
    </>
  ),
  campfire: (
    <>
      <path d="M12 3c3 3 4 5 2 8 2-1 3-3 3-5 3 4 3 9-1 11a7 7 0 0 1-8 0c-3-3-2-7 1-10 0 2 1 4 3 4-1-3 0-5 0-8Z" />
      <path d="m5 21 14-5" />
      <path d="m19 21-14-5" />
    </>
  ),
  map: (
    <>
      <path d="m9 18-6 2V6l6-2 6 2 6-2v14l-6 2-6-2Z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </>
  ),
  tent: (
    <>
      <path d="M3 20 12 4l9 16H3Z" />
      <path d="M12 4v16" />
      <path d="m8 20 4-7 4 7" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </>
  ),
  heart: (
    <path d="M20 8.5c0 5.5-8 10.5-8 10.5S4 14 4 8.5A4.3 4.3 0 0 1 12 6a4.3 4.3 0 0 1 8 2.5Z" />
  ),
  route: (
    <>
      <path d="M5 6a3 3 0 1 0 0 .1" />
      <path d="M19 18a3 3 0 1 0 0 .1" />
      <path d="M8 6h5a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h7" />
    </>
  ),
  calendar: (
    <>
      <path d="M7 3v4" />
      <path d="M17 3v4" />
      <path d="M4 8h16" />
      <path d="M5 5h14v16H5Z" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V4" />
      <path d="M5 4h11l-2 4 2 4H5" />
    </>
  ),
  mail: (
    <>
      <path d="M4 6h16v12H4Z" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  home: (
    <>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
};

type IconBadgeProps = {
  icon: IconName;
  tone?: "blue" | "green" | "sand" | "light";
};

const tones = {
  blue: "bg-[#edf6e8] text-[#103001] ring-[#d7e8cf] shadow-green-950/5",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100 shadow-emerald-950/5",
  sand: "bg-amber-50 text-amber-700 ring-amber-100 shadow-amber-950/5",
  light: "bg-white/15 text-white ring-white/25 shadow-blue-950/10",
};

export default function IconBadge({ icon, tone = "blue" }: IconBadgeProps) {
  const glassClass = tone === "light" ? "forest-glass-pill" : "forest-glass-light";

  return (
    <span
      className={`${glassClass} inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ring-1 ${tones[tone]}`}
    >
      <svg
        aria-hidden="true"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        {iconPaths[icon]}
      </svg>
    </span>
  );
}
