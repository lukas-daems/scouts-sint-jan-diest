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

  return (
    <section className="bg-[#fbfdf9] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          subtitle={content.practicalSubtitle}
          title={content.practicalTitle}
        />

        <div className="mt-12 overflow-hidden rounded-[2rem] bg-slate-200 p-px shadow-xl shadow-green-950/8">
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            {infoCards.map((card, index) => (
              <article
                className="group flex min-h-[220px] flex-col bg-white p-6 transition hover:bg-[#fbfdf9] sm:p-7"
                key={card.title}
              >
                <div className="flex items-start justify-between gap-4">
                  <IconBadge
                    icon={card.icon}
                    tone={index === 3 ? "sand" : index === 2 ? "green" : "blue"}
                  />
                  {card.important ? (
                    <span className="rounded-full bg-[#edf6e8] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#103001] ring-1 ring-[#d7e8cf]">
                      Belangrijk
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 flex flex-1 flex-col">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[#2f6b18]">
                    {card.title}
                  </p>
                  <h3
                    className={`mt-3 font-black leading-tight text-slate-950 ${
                      card.important ? "text-3xl" : "text-2xl"
                    }`}
                  >
                    {card.text}
                  </h3>
                  <p className="mt-auto pt-5 text-sm font-semibold leading-6 text-slate-500">
                    {card.note}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8 lg:p-10">
          {/* TODO: vul exacte activiteitendag, uren, lokaaladres en inschrijvingslink in. */}
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-3xl bg-[#fbfdf9] p-7">
              <p className="text-sm font-bold uppercase text-[#2f6b18]">
                Voor nieuwe ouders
              </p>
              <h3 className="mt-3 text-2xl font-bold text-slate-950">
                Eerst kennismaken kan altijd
              </h3>
              <p className="mt-4 leading-8 text-slate-600">
                Nieuwe leden mogen rustig ontdekken hoe een activiteit verloopt.
                De leiding helpt je kind landen in de juiste tak en geeft ouders
                duidelijke praktische info.
              </p>
            </article>
            <article className="rounded-3xl bg-[#edf6e8] p-7">
              <p className="text-sm font-bold uppercase text-[#103001]">
                Inschrijven en kennismaken
              </p>
              <h3 className="mt-3 text-2xl font-bold text-slate-950">
                Contacteer de groepsleiding
              </h3>
              <p className="mt-4 leading-8 text-slate-600">
                Bezorg de leeftijd van je kind en eventuele vragen. Daarna
                bekijken we samen de juiste tak en bezorgen we alle info voor de
                inschrijving.
              </p>
            </article>
          </div>

          <div className="mt-8 flex justify-center">
            <a
              className="inline-flex rounded-full bg-[#103001] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/20 transition hover:-translate-y-1 hover:bg-[#1e4b0d]"
              href={content.registrationLink || "#contact"}
            >
              Inschrijvingsinfo openen
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
