import IconBadge from "./IconBadge";
import SectionHeader from "./SectionHeader";
import type { EditableSiteContent } from "../lib/site-content-defaults";

const steps = [
  {
    title: "Neem contact op",
    text: "Stuur ons een berichtje met de leeftijd van je kind en eventuele vragen.",
    icon: "mail" as const,
  },
  {
    title: "Kom kennismaken",
    text: "Nieuwe leden kunnen eerst een activiteit proberen en de groep leren kennen.",
    icon: "users" as const,
  },
  {
    title: "Kies de juiste tak",
    text: "We bekijken samen bij welke leeftijdsgroep je kind aansluit.",
    icon: "compass" as const,
  },
  {
    title: "Schrijf je in",
    text: "Na de kennismaking bezorgen we alle info om de inschrijving in orde te maken.",
    icon: "check" as const,
  },
];

type HowToJoinProps = {
  content: EditableSiteContent;
};

export default function HowToJoin({ content }: HowToJoinProps) {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          subtitle={content.joinSubtitle}
          title={content.joinTitle}
        />

        <div className="relative mt-14 grid gap-5 lg:grid-cols-4">
          <div className="absolute left-10 right-10 top-14 hidden h-px bg-gradient-to-r from-transparent via-[#d7e8cf] to-transparent lg:block" />
          {steps.map((step, index) => (
            <article
              className="lift-card premium-card relative p-7"
              key={step.title}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#103001] px-4 py-2 text-sm font-black text-white shadow-lg shadow-green-950/20">
                  0{index + 1}
                </span>
                <IconBadge icon={step.icon} tone={index === 1 ? "green" : "blue"} />
              </div>
              <h3 className="mt-7 text-xl font-bold text-slate-950">
                {step.title}
              </h3>
              <p className="mt-3 min-h-24 text-[15px] leading-8 text-slate-600">
                {step.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            className="inline-flex items-center justify-center rounded-full bg-[#103001] px-10 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/20 transition hover:-translate-y-1 hover:bg-[#1e4b0d]"
            href="#contact"
          >
            {content.joinCtaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
