import Link from "next/link";
import BranchLogo from "./BranchLogo";
import SectionHeader from "./SectionHeader";
import { branchProfiles, getEditableBranchProfile } from "../lib/branches";
import type { EditableSiteContent } from "../lib/site-content-defaults";

type BranchesProps = {
  content: EditableSiteContent;
};

export default function Branches({ content }: BranchesProps) {
  return (
    <section
      className="bg-[#f2f8ee] px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:px-10 lg:pt-44"
      id="takken"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          subtitle={content.branchesHomeSubtitle}
          title={content.branchesHomeTitle}
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {branchProfiles.map((profile) => {
            const branch = getEditableBranchProfile(profile, content);

            return (
              <article
                className="lift-card relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white p-5 text-center shadow-lg shadow-green-950/6"
                key={branch.name}
              >
                <div className="flex justify-center">
                  <BranchLogo
                    branch={branch}
                    content={content}
                    tone="green"
                  />
                </div>
                <h3 className="mt-5 text-lg font-black tracking-tight text-slate-950">
                  {branch.name}
                </h3>
                <div className="mt-3 flex justify-center">
                  <span className="rounded-full bg-[#edf6e8] px-3.5 py-1.5 text-xs font-black text-[#103001] ring-1 ring-[#d7e8cf]">
                    {branch.age}
                  </span>
                </div>
                <Link
                  className="mt-5 inline-flex items-center rounded-full bg-[#f2f8ee] px-4 py-2 text-sm font-black text-[#2f6b18] transition hover:bg-[#edf6e8] hover:text-[#103001]"
                  href={`/takken/${branch.slug}`}
                >
                  Meer over deze tak
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            className="inline-flex rounded-full bg-[#103001] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/15 transition hover:-translate-y-0.5 hover:bg-[#1e4b0d]"
            href="/takken"
          >
            {content.branchesHomeCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
