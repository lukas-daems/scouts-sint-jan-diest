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
      className="relative z-0 isolate bg-[#eef7e9] px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-10 lg:pt-28"
      id="takken"
    >
      <div className="relative mx-auto max-w-7xl rounded-[2.25rem] border border-slate-200/80 bg-white p-5 shadow-2xl shadow-green-950/10 sm:p-8 lg:p-10">
        <SectionHeader
          subtitle={content.branchesHomeSubtitle}
          title={content.branchesHomeTitle}
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {branchProfiles.map((profile) => {
            const branch = getEditableBranchProfile(profile, content);

            return (
              <article
                className="forest-glass-light lift-card relative overflow-hidden rounded-[1.7rem] p-5 text-center shadow-lg shadow-green-950/6"
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
                  <span className="forest-glass-light rounded-full px-3.5 py-1.5 text-xs font-black text-[#103001]">
                    {branch.age}
                  </span>
                </div>
                <Link
                  className="forest-glass-light mt-5 inline-flex items-center rounded-full px-4 py-2 text-sm font-black text-[#2f6b18] transition hover:-translate-y-0.5 hover:text-[#103001]"
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
