/* eslint-disable @next/next/no-img-element */

import IconBadge from "./IconBadge";
import type { BranchProfile } from "../lib/branches";
import type { EditableSiteContent } from "../lib/site-content-defaults";

type BranchLogoProps = {
  branch: Pick<BranchProfile, "icon" | "logoKey" | "name">;
  content: EditableSiteContent;
  size?: "card" | "hero";
  tone?: "blue" | "green" | "sand";
};

export default function BranchLogo({
  branch,
  content,
  size = "card",
  tone = "blue",
}: BranchLogoProps) {
  const logoUrl = content[branch.logoKey];
  const sizeClass = size === "hero" ? "h-24 w-24" : "h-14 w-14";

  if (logoUrl) {
    return (
      <span
        className={`forest-glass-light ${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-2xl p-2 shadow-lg shadow-green-950/8 ring-1 ring-white/70`}
      >
        <img
          alt={`Logo van de ${branch.name}`}
          className="h-full w-full object-contain"
          src={logoUrl}
        />
      </span>
    );
  }

  return <IconBadge icon={branch.icon} tone={tone} />;
}
