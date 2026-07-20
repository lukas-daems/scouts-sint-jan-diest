import Link from "next/link";
import IconBadge from "./IconBadge";
import SectionHeader from "./SectionHeader";
import type { EditableSiteContent } from "../lib/site-content-defaults";
import {
  getGalleryThemeBySlug,
  parseImageListValue,
} from "../lib/gallery";
import { images } from "../lib/image-placeholders";

const smallActivities = [
  {
    title: "Bosspelen",
    text: "Grote spelen in het bos, vol actie, fantasie en samenwerking.",
    icon: "tree" as const,
  },
  {
    title: "Weekends",
    text: "Een weekend weg met de tak om de groep sterker te maken.",
    icon: "home" as const,
  },
  {
    title: "Tochten & technieken",
    text: "Leren sjorren, kaartlezen, koken op vuur en zelfstandig op pad gaan.",
    icon: "map" as const,
  },
  {
    title: "Kampvuur & sfeer",
    text: "Samen zingen, verhalen delen en genieten van echte scoutssfeer.",
    icon: "campfire" as const,
  },
  {
    title: "Dropping",
    text: "Een avontuurlijk evenement waarbij deelnemers samen op pad gaan en de werking steunen.",
    icon: "flag" as const,
  },
  {
    title: "Groepsactiviteiten",
    text: "Momenten waarop heel Scouts Sint-Jan Berchmans samenkomt.",
    icon: "users" as const,
  },
];

type ActivitiesProps = {
  content: EditableSiteContent;
};

export default function Activities({ content }: ActivitiesProps) {
  const campTheme = getGalleryThemeBySlug("kamp");
  const uploadedCampImage =
    campTheme?.coverKey && campTheme.collageKey
      ? content[campTheme.coverKey] ||
        parseImageListValue(content[campTheme.collageKey])[0]
      : "";
  const campImage =
    uploadedCampImage || content.campImageUrl || campTheme?.placeholderImages[0] || images.camp;

  return (
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-10" id="activiteiten">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          subtitle={content.activitiesSubtitle}
          title={content.activitiesTitle}
        />

        <div className="mt-14 grid gap-7 lg:grid-cols-[1.05fr_1.2fr]">
          <article className="lift-card overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-green-950/12">
            <div className="relative min-h-[430px] overflow-hidden bg-[#071a02] sm:min-h-[500px] lg:min-h-[520px]">
              <div
                aria-label="Sfeerbeeld van een scoutskamp"
                className="absolute inset-0 bg-cover bg-center"
                role="img"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(7, 26, 2, 0.05), rgba(7, 26, 2, 0.78)), url("${campImage}")`,
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.22),transparent_22%),linear-gradient(180deg,rgba(16,48,1,0.04),rgba(7,26,2,0.72))]" />
              <div className="absolute left-5 top-5 flex flex-wrap items-center gap-3 sm:left-7 sm:top-7">
                <IconBadge icon="tent" tone="light" />
                <p className="inline-flex rounded-full bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#103001] shadow-lg backdrop-blur">
                  {content.activitiesFeaturedBadge}
                </p>
              </div>
              <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] border border-white/18 bg-white/14 p-5 text-white shadow-2xl shadow-green-950/25 backdrop-blur sm:inset-x-7 sm:bottom-7 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-green-100">
                      {content.activitiesFeaturedMiniTitle}
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-white/86">
                      {content.activitiesFeaturedMiniText}
                    </p>
                  </div>
                  <Link
                    className="inline-flex min-w-40 items-center justify-center rounded-full bg-white px-5 py-2.5 text-center text-sm font-bold text-slate-950 transition hover:bg-green-50"
                    href="/zomerkamp"
                  >
                    {content.activitiesFeaturedCtaLabel}
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative p-7 sm:p-8">
              <div className="relative">
                <h3 className="text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                  {content.activitiesFeaturedTitle}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                  {content.activitiesFeaturedText}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#edf6e8] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#103001] ring-1 ring-[#d7e8cf]">
                    Tenten
                  </span>
                  <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-slate-600 ring-1 ring-slate-200">
                    Samenleven
                  </span>
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-5 sm:grid-cols-2">
            {smallActivities.map((activity, index) => (
              <article
                className="lift-card premium-card p-6"
                key={activity.title}
              >
                <IconBadge
                  icon={activity.icon}
                  tone={index === 3 ? "sand" : index % 2 ? "blue" : "green"}
                />
                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {activity.title}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-slate-600">
                  {activity.text}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-[#fbfdf9] p-6 shadow-xl shadow-green-950/6 sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <IconBadge icon="check" tone="green" />
              <div>
                <h3 className="text-xl font-bold text-slate-950">
                  {content.activitiesMoreTitle}
                </h3>
                <p className="mt-2 max-w-3xl text-[15px] leading-7 text-slate-600">
                  {content.activitiesMoreText}
                </p>
              </div>
            </div>
            <Link
              className="inline-flex shrink-0 justify-center rounded-full bg-[#103001] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1e4b0d]"
              href="/activiteiten"
            >
              {content.activitiesMoreCtaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
