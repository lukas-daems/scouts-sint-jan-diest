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
      className="relative isolate overflow-hidden bg-[#eef7e9] px-5 pb-16 pt-24 sm:px-8 sm:pb-24 sm:pt-32 lg:px-10 lg:pt-36"
      id="takken"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#103001] via-[#2c5c1b] to-[#eef7e9]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-12 h-24 w-[min(1120px,calc(100%-2.5rem))] -translate-x-1/2 rounded-[2rem] border border-white/45 bg-white/28 shadow-2xl shadow-green-950/18 backdrop-blur-2xl"
      />
      <div className="relative mx-auto max-w-7xl rounded-[2.25rem] border border-white/70 bg-white/72 p-5 shadow-2xl shadow-green-950/10 backdrop-blur-xl sm:p-8 lg:p-10">
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
