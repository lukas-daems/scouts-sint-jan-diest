import Link from "next/link";
import IconBadge from "./IconBadge";
import type { EditableSiteContent } from "../lib/site-content-defaults";
import { images } from "../lib/image-placeholders";

type CampInfoProps = {
  content: EditableSiteContent;
};

export default function CampInfo({ content }: CampInfoProps) {
  const campImage = content.campImageUrl || images.camp;
  const imageStyle = {
    backgroundImage: `linear-gradient(180deg, rgba(16, 48, 1, 0.03), rgba(7, 26, 2, 0.58)), url("${campImage}")`,
  };

  return (
    <section className="bg-white px-5 py-12 sm:px-8 sm:py-16 lg:px-10" id="kamp">
      <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-slate-200 bg-[#fbfdf9] p-5 shadow-xl shadow-green-950/8 sm:p-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex w-fit rounded-full border border-[#d7e8cf] bg-white px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#2f6b18] shadow-sm">
            {content.campBadge}
          </p>
          <h2 className="max-w-3xl text-3xl font-black leading-tight text-slate-950 lg:text-4xl">
            {content.campTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {content.campSubtitle}
          </p>
          <div className="mt-5 max-w-2xl rounded-3xl border border-[#d7e8cf] bg-white p-4">
            <p className="text-sm font-semibold leading-6 text-[#2f6b18]">
              {content.campHomepageNote}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-[#103001] px-7 py-3 text-sm font-bold text-white shadow-xl shadow-green-950/20 transition hover:-translate-y-1 hover:bg-[#1e4b0d]"
              href="#contact"
            >
              Vraag kampinfo aan
            </a>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-[#103001] shadow-sm transition hover:-translate-y-1 hover:bg-[#f2f8ee]"
              href="/zomerkamp"
            >
              Bekijk kamp pagina
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-xl shadow-green-950/10">
          <div
            aria-label="Kampvuur tijdens een scoutsavond"
            className="camp-scene has-photo min-h-[250px] rounded-lg sm:min-h-[290px] lg:min-h-[320px]"
            role="img"
            style={imageStyle}
          >
            <span className="camp-tree" />
            <span className="camp-tree" />
            <span className="camp-tree" />
            <span className="camp-tree" />
            <span className="camp-fire" />
          </div>
          <div className="absolute inset-x-6 bottom-6 rounded-[1.25rem] border border-white/70 bg-white/95 p-3.5 shadow-xl shadow-slate-950/15 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="scale-75">
                <IconBadge icon="tent" tone="blue" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                  Kampinformatie
                </p>
                <h3 className="mt-0.5 text-lg font-black text-slate-950">
                  Zomerkamp
                </h3>
              </div>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Data, locatie en bagagelijst worden tijdig gedeeld.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
