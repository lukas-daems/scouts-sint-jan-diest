import IconBadge from "./IconBadge";
import type { EditableSiteContent } from "../lib/site-content-defaults";

const features = [
  {
    title: "Veilige omgeving",
    text: "We zorgen voor duidelijke afspraken, betrokken leiding en activiteiten op maat van de groep.",
    icon: "shield" as const,
  },
  {
    title: "Sterke vriendschappen",
    text: "Leden bouwen banden op door samen te spelen, te ontdekken en uitdagingen aan te gaan.",
    icon: "heart" as const,
  },
  {
    title: "Groeien in zelfstandigheid",
    text: "Kinderen en jongeren leren keuzes maken, samenwerken en verantwoordelijkheid nemen.",
    icon: "compass" as const,
  },
  {
    title: "Lokaal verbonden",
    text: "We zijn stevig verankerd in Diest en voelen ons verbonden met de lokale scoutsfamilie, waaronder Sint-Lut, de meisjesscouts, en Poolster, de gemengde scouts.",
    icon: "home" as const,
  },
];

type WhyJoinProps = {
  content: EditableSiteContent;
};

function getBullets(content: EditableSiteContent) {
  return content.whyJoinBullets
    .split(/\r?\n|;/)
    .map((bullet) => bullet.trim())
    .filter(Boolean);
}

export default function WhyJoin({ content }: WhyJoinProps) {
  const bullets = getBullets(content);

  return (
    <section className="bg-[#fbfdf9] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-green-950/6 sm:p-7 lg:p-8">
        <div className="grid gap-7 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-[#edf6e8] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2f6b18] ring-1 ring-[#d7e8cf]">
              {content.whyJoinBadge}
            </p>
            <h2 className="max-w-2xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              {content.whyJoinTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {content.whyJoinText}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {bullets.map((bullet) => (
                <li
                  className="inline-flex items-center gap-2 rounded-full bg-[#fbfdf9] px-3.5 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
                  key={bullet}
                >
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#edf6e8] text-[#103001] ring-1 ring-[#d7e8cf]">
                    <svg
                      aria-hidden="true"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <article
                className="lift-card rounded-3xl border border-slate-200 bg-[#fbfdf9] p-4 shadow-sm transition hover:bg-white hover:shadow-lg hover:shadow-green-950/8"
                key={feature.title}
              >
                <div className="flex items-start gap-3">
                  <span className="scale-75">
                    <IconBadge icon={feature.icon} tone="blue" />
                  </span>
                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">
                      {feature.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
