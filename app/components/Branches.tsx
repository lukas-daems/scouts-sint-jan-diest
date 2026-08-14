import Link from "next/link";
import BranchLogo from "./BranchLogo";
import { branchProfiles, getEditableBranchProfile } from "../lib/branches";
import type { EditableSiteContent } from "../lib/site-content-defaults";

type BranchesProps = {
  content: EditableSiteContent;
};

export default function Branches({ content }: BranchesProps) {
  return (
    <section
      className="border-t border-slate-200 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-10"
      id="takken"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2f6b18]">
              Takken
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {content.branchesHomeTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              {content.branchesHomeSubtitle}
            </p>
          </div>
          <Link
            className="inline-flex w-fit rounded-full bg-[#103001] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-950/12 transition hover:-translate-y-0.5 hover:bg-[#1e4b0d]"
            href="/takken"
          >
            {content.branchesHomeCtaLabel}
          </Link>
        </div>

        <div className="mt-8 grid overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
          {branchProfiles.map((profile) => {
            const branch = getEditableBranchProfile(profile, content);

            return (
              <article
                className="group bg-white p-5 text-left transition hover:bg-[#f7fbf4]"
                key={branch.name}
              >
                <div className="flex items-start justify-between gap-4">
                  <BranchLogo
                    branch={branch}
                    content={content}
                    tone="green"
                  />
                  <span className="rounded-full bg-[#edf6e8] px-3 py-1 text-xs font-black text-[#103001] ring-1 ring-[#d7e8cf]">
                    {branch.age}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950">
                  {branch.name}
                </h3>
                <Link
                  className="mt-6 inline-flex items-center text-sm font-black text-[#2f6b18] transition group-hover:text-[#103001]"
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
      </div>
    </section>
  );
}
