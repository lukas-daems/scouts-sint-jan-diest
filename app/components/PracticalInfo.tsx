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

function getPracticalCopy(content: EditableSiteContent) {
  const subtitle = /Alles wat je als ouder snel wil weten/i.test(content.practicalSubtitle)
    ? "De basis in een oogopslag: wanneer we samenkomen, voor wie scouts is en hoe kennismaken werkt."
    : content.practicalSubtitle;
  const joinSubtitle = /Inschrijven begint met kennismaken/i.test(content.joinSubtitle)
    ? "Stuur ons eerst een bericht. Daarna kan je zoon vrijblijvend een zaterdag meedraaien."
    : content.joinSubtitle.replace(/elk nieuw lid/g, "je zoon");

  return { subtitle, joinSubtitle };
}

export default function PracticalInfo({ content }: PracticalInfoProps) {
  const infoCards = getInfoCards(content);
  const copy = getPracticalCopy(content);
  const joinSteps = [
    content.joinStepOneLabel,
    content.joinStepTwoLabel,
    content.joinStepThreeLabel,
    content.joinStepFourLabel,
  ].filter(Boolean);

  return (
    <section className="bg-[#fbfdf9] px-5 py-14 sm:px-8 sm:py-18 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          subtitle={copy.subtitle}
          title={content.practicalTitle}
        />

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-green-950/7 sm:p-6 lg:p-7">
          {/* TODO: vul exacte activiteitendag, uren, lokaaladres en inschrijvingslink in. */}
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-stretch">
            <div className="grid gap-3 sm:grid-cols-2">
              {infoCards.map((card, index) => (
                <article
                  className={`group rounded-3xl bg-[#fbfdf9] p-4 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-green-950/7 ${
                    card.important ? "sm:col-span-2 lg:col-span-1" : ""
                  }`}
                  key={card.title}
                >
                  <div className="flex items-start gap-3">
                    <IconBadge
                      icon={card.icon}
                      tone={
                        index === 3 ? "sand" : index === 2 ? "green" : "blue"
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#2f6b18]">
                          {card.title}
                        </p>
                        {card.important ? (
                          <span className="rounded-full bg-[#edf6e8] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#103001] ring-1 ring-[#d7e8cf]">
                            Belangrijk
                          </span>
                        ) : null}
                      </div>
                      <h3
                        className={`mt-1 font-black leading-tight text-slate-950 ${
                          card.important ? "text-2xl" : "text-lg"
                        }`}
                      >
                        {card.text}
                      </h3>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                        {card.note}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <article className="flex h-full flex-col rounded-3xl bg-[#edf6e8] p-5 ring-1 ring-[#d7e8cf] sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                {content.joinTitle}
              </p>
              <h3 className="mt-2 text-2xl font-black leading-tight text-slate-950">
                {content.joinHeading}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {copy.joinSubtitle}
              </p>

              <div className="mt-5 grid gap-2">
                {joinSteps.map((step, index) => (
                  <div
                    className="flex items-center gap-3 rounded-2xl bg-white/82 p-2.5 ring-1 ring-white"
                    key={step}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#103001] text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm font-bold text-[#103001]">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex justify-center rounded-full bg-[#103001] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-green-950/16 transition hover:-translate-y-1 hover:bg-[#1e4b0d]"
                  href={content.registrationLink || "#contact"}
                >
                  {content.joinCtaLabel}
                </a>
                <a
                  className="inline-flex justify-center rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#103001] ring-1 ring-[#d7e8cf] transition hover:bg-green-50"
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
