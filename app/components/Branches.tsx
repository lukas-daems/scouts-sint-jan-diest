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
      className="relative z-0 isolate bg-[#eef7e9] px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pt-22"
      id="takken"
    >
      <div className="relative mx-auto max-w-7xl rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-2xl shadow-green-950/8 sm:p-7 lg:p-8">
        <SectionHeader
          subtitle={content.branchesHomeSubtitle}
          title={content.branchesHomeTitle}
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {branchProfiles.map((profile) => {
            const branch = getEditableBranchProfile(profile, content);

            return (
              <article
                className="forest-glass-light lift-card relative overflow-hidden rounded-[1.45rem] p-4 text-center shadow-md shadow-green-950/5"
                key={branch.name}
              >
                <div className="flex justify-center">
                  <BranchLogo
                    branch={branch}
                    content={content}
                    tone="green"
                  />
                </div>
                <h3 className="mt-4 text-base font-black tracking-tight text-slate-950">
                  {branch.name}
                </h3>
                <div className="mt-2 flex justify-center">
                  <span className="rounded-full bg-[#edf6e8] px-3 py-1 text-xs font-black text-[#103001] ring-1 ring-[#d7e8cf]">
                    {branch.age}
                  </span>
                </div>
                <Link
                  className="mt-4 inline-flex items-center rounded-full bg-white px-3.5 py-2 text-xs font-black text-[#2f6b18] ring-1 ring-[#d7e8cf] transition hover:-translate-y-0.5 hover:bg-[#f2f8ee] hover:text-[#103001]"
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

        <div className="mt-8 text-center">
          <Link
            className="inline-flex rounded-full bg-[#103001] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-green-950/12 transition hover:-translate-y-0.5 hover:bg-[#1e4b0d]"
            href="/takken"
          >
            {content.branchesHomeCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
