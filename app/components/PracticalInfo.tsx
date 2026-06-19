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

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((card, index) => (
            <article
              className={`lift-card flex min-h-[245px] flex-col rounded-[2rem] border bg-white p-6 text-center shadow-xl shadow-green-950/6 ${
                card.important
                  ? "border-[#d7e8cf] ring-2 ring-[#edf6e8]"
                  : "border-slate-200"
              }`}
              key={card.title}
            >
              <div className="flex justify-center">
                <IconBadge
                  icon={card.icon}
                  tone={index === 3 ? "sand" : index === 2 ? "green" : "blue"}
                />
              </div>
              <h3 className="mt-5 text-2xl font-black text-slate-950">
                {card.title}
              </h3>
              <p
                className={`mt-3 flex-1 leading-7 ${
                  card.important
                    ? "text-3xl font-black tracking-tight text-[#103001]"
                    : "text-[15px] text-slate-600"
                }`}
              >
                {card.text}
              </p>
              <p className="mt-5 rounded-full bg-[#edf6e8] px-4 py-2 text-xs font-bold uppercase leading-5 text-[#103001] ring-1 ring-[#d7e8cf]">
                {card.note}
              </p>
            </article>
          ))}
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
