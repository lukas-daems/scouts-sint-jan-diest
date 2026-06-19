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
    <section className="blue-pattern relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-5 inline-flex rounded-full bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-green-100 ring-1 ring-white/20">
            {content.whyJoinBadge}
          </p>
          <h2 className="max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
            {content.whyJoinTitle}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-green-50">
            {content.whyJoinText}
          </p>

          <ul className="mt-9 grid gap-4 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <li className="flex items-start gap-3 text-green-50" key={bullet}>
                <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/20">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
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
                <span className="leading-7">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              className="lift-card rounded-3xl border border-white/25 bg-white/95 p-7 shadow-2xl shadow-green-950/18 backdrop-blur"
              key={feature.title}
            >
              <IconBadge icon={feature.icon} tone="blue" />
              <h3 className="mt-5 text-xl font-bold text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
