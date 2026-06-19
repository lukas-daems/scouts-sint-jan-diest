import Link from "next/link";
import IconBadge from "./IconBadge";
import type { EditableSiteContent } from "../lib/site-content-defaults";
import { images } from "../lib/image-placeholders";

type CampInfoProps = {
  content: EditableSiteContent;
};

function getTextBlocks(content: EditableSiteContent) {
  return [
    {
      title: "Wat is kamp?",
      text: content.campWhat,
    },
    {
      title: "Voor ouders",
      text: content.campForParents,
    },
    {
      title: "Voor nieuwe leden",
      text: content.campForNewMembers,
    },
  ];
}

export default function CampInfo({ content }: CampInfoProps) {
  const textBlocks = getTextBlocks(content);
  const campImage = content.campImageUrl || images.camp;
  const imageStyle = {
    backgroundImage: `linear-gradient(180deg, rgba(16, 48, 1, 0.03), rgba(7, 26, 2, 0.58)), url("${campImage}")`,
  };

  return (
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-10" id="kamp">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <div className="flex flex-col">
          <p className="mb-4 inline-flex w-fit rounded-full border border-[#d7e8cf] bg-white px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#2f6b18] shadow-sm">
            {content.campBadge}
          </p>
          <h2 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            {content.campTitle}
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            {content.campSubtitle}
          </p>

          <div className="mt-8 grid flex-1 gap-4">
            {textBlocks.map((block) => (
              <article
                className="lift-card rounded-3xl border border-slate-200 bg-[#f9fcff] p-5 shadow-sm sm:p-6"
                key={block.title}
              >
                <h3 className="text-lg font-bold text-slate-950">
                  {block.title}
                </h3>
                <p className="mt-2 leading-7 text-slate-600">{block.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-[#103001] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/20 transition hover:-translate-y-1 hover:bg-[#1e4b0d]"
              href="#contact"
            >
              Vraag kampinfo aan
            </a>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-[#103001] shadow-sm transition hover:-translate-y-1 hover:bg-[#f2f8ee]"
              href="/zomerkamp"
            >
              Bekijk kamp pagina
            </Link>
          </div>
        </div>

        <div className="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-green-950/12">
          <div
            aria-label="Kampvuur tijdens een scoutsavond"
            className="camp-scene has-photo min-h-[420px] flex-1 rounded-lg lg:min-h-[560px]"
            role="img"
            style={imageStyle}
          >
            <span className="camp-tree" />
            <span className="camp-tree" />
            <span className="camp-tree" />
            <span className="camp-tree" />
            <span className="camp-fire" />
          </div>
          <div className="relative mx-4 -mt-16 mb-4 rounded-[1.4rem] border border-white/70 bg-white/95 p-4 shadow-xl shadow-slate-950/15 backdrop-blur sm:mx-5 sm:p-5">
            <div className="flex items-center gap-3">
              <IconBadge icon="tent" tone="blue" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                  Kampinformatie
                </p>
                <h3 className="mt-1 text-xl font-black text-slate-950">
                  Zomerkamp
                </h3>
              </div>
            </div>
            <div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Data, locatie en bagagelijst worden tijdig gedeeld.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
