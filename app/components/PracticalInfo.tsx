import IconBadge from "./IconBadge";
import SectionHeader from "./SectionHeader";
import type { EditableSiteContent } from "../lib/site-content-defaults";

type PracticalInfoProps = {
  content: EditableSiteContent;
};

function getInfoCards(content: EditableSiteContent) {
  return [
    {
      title: content.practicalCardOneTitle,
      text: content.practicalCardOneText,
      icon: "calendar" as const,
      note: content.practicalCardOneNote || content.practicalActivityMoment,
      important: true,
    },
    {
      title: content.practicalCardTwoTitle,
      text: content.practicalCardTwoText,
      icon: "users" as const,
      note: content.practicalCardTwoNote,
      important: false,
    },
    {
      title: content.practicalCardThreeTitle,
      text: content.practicalCardThreeText,
      icon: "home" as const,
      note: content.practicalCardThreeNote || content.practicalAddress,
      important: false,
    },
    {
      title: content.practicalCardFourTitle,
      text: content.practicalCardFourText,
      icon: "tent" as const,
      note: content.practicalCardFourNote,
      important: false,
    },
  ];
}

export default function PracticalInfo({ content }: PracticalInfoProps) {
  const infoCards = getInfoCards(content);
  const joinSteps = [
    content.joinStepOneLabel,
    content.joinStepTwoLabel,
    content.joinStepThreeLabel,
    content.joinStepFourLabel,
  ].filter(Boolean);

  return (
    <section className="bg-[#fbfdf9] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          subtitle={content.practicalSubtitle}
          title={content.practicalTitle}
        />

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-green-950/8 sm:p-7 lg:p-8">
          {/* TODO: vul exacte activiteitendag, uren, lokaaladres en inschrijvingslink in. */}
          <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className="grid gap-3 sm:grid-cols-2">
              {infoCards.map((card, index) => (
                <article
                  className="group rounded-3xl bg-[#fbfdf9] p-5 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-green-950/8"
                  key={card.title}
                >
                  <div className="flex items-start justify-between gap-3">
                    <IconBadge
                      icon={card.icon}
                      tone={
                        index === 3 ? "sand" : index === 2 ? "green" : "blue"
                      }
                    />
                    {card.important ? (
                      <span className="rounded-full bg-[#edf6e8] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#103001] ring-1 ring-[#d7e8cf]">
                        Belangrijk
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-[#2f6b18]">
                    {card.title}
                  </p>
                  <h3
                    className={`mt-2 font-black leading-tight text-slate-950 ${
                      card.important ? "text-3xl" : "text-xl"
                    }`}
                  >
                    {card.text}
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                    {card.note}
                  </p>
                </article>
              ))}
            </div>

            <article className="flex h-full flex-col rounded-3xl bg-[#edf6e8] p-6 ring-1 ring-[#d7e8cf] sm:p-7">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                {content.joinTitle}
              </p>
              <h3 className="mt-3 text-2xl font-black leading-tight text-slate-950">
                {content.joinHeading}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {content.joinSubtitle}
              </p>

              <div className="mt-6 grid gap-3">
                {joinSteps.map((step, index) => (
                  <div
                    className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 ring-1 ring-white"
                    key={step}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#103001] text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm font-bold text-[#103001]">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex justify-center rounded-full bg-[#103001] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/20 transition hover:-translate-y-1 hover:bg-[#1e4b0d]"
                  href={content.registrationLink || "#contact"}
                >
                  {content.joinCtaLabel}
                </a>
                <a
                  className="inline-flex justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-[#103001] ring-1 ring-[#d7e8cf] transition hover:bg-green-50"
                  href="#contact"
                >
                  {content.joinSecondaryCtaLabel}
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
