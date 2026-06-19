import IconBadge, { type IconName } from "./IconBadge";
import SectionHeader from "./SectionHeader";
import type { EditableSiteContent } from "../lib/site-content-defaults";

type AboutScoutsProps = {
  content: EditableSiteContent;
};

function getCards(content: EditableSiteContent): Array<{
  title: string;
  text: string;
  icon: IconName;
  tone: "blue" | "green" | "sand";
}> {
  return [
    {
      title: content.aboutCardOneTitle,
      text: content.aboutCardOneText,
      icon: "tree",
      tone: "green",
    },
    {
      title: content.aboutCardTwoTitle,
      text: content.aboutCardTwoText,
      icon: "users",
      tone: "blue",
    },
    {
      title: content.aboutCardThreeTitle,
      text: content.aboutCardThreeText,
      icon: "spark",
      tone: "sand",
    },
  ];
}

export default function AboutScouts({ content }: AboutScoutsProps) {
  const cards = getCards(content);

  return (
    <section
      className="relative isolate overflow-hidden bg-[#f7fbff] px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-10 lg:pt-44"
      id="over-ons"
    >
      <div
        aria-hidden="true"
        className="absolute left-[-8rem] top-40 h-72 w-72 rounded-full bg-[#d7e8cf]/45 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute right-[-10rem] top-24 h-80 w-80 rounded-full bg-sky-100/55 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader subtitle={content.aboutSubtitle} title={content.aboutTitle} />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <article className="lift-card premium-card p-8" key={card.title}>
              <IconBadge icon={card.icon} tone={card.tone} />
              <h3 className="mt-7 text-2xl font-bold text-slate-950">
                {card.title}
              </h3>
              <p className="mt-4 text-[15px] leading-7 text-slate-600">
                {card.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
