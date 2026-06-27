import type { EditableSiteContent } from "../lib/site-content-defaults";
import { images } from "../lib/image-placeholders";

type HeroProps = {
  content: EditableSiteContent;
};

export default function Hero({ content }: HeroProps) {
  const heroImage = content.heroImageUrl || images.hero;
  const imageStyle = {
    backgroundImage: `linear-gradient(180deg, rgba(7, 82, 199, 0.08), rgba(4, 18, 50, 0.58)), url("${heroImage}")`,
  };

  return (
    <section
      className="hero-sky relative z-20 isolate overflow-visible px-5 pb-0 pt-32 text-white sm:px-8 lg:min-h-[820px] lg:px-10 lg:pt-36"
      id="home"
    >
      <div aria-hidden="true" className="hero-lines absolute inset-0" />
      <div aria-hidden="true" className="visual-noise absolute inset-0 opacity-55" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center">
        <div className="section-fade max-w-5xl text-center">
          <div className="hero-eyebrow-badge mb-5 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase leading-none tracking-[0.16em] text-green-50">
            <span>{content.heroEyebrow}</span>
            <span
              aria-hidden="true"
              className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-white/55 sm:inline-flex"
            />
            <span>{content.heroOrgLabel}</span>
          </div>
          <h1 className="text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
            {content.heroTitleLineOne}
            <span className="block">{content.heroTitleLineTwo}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-[850px] text-base leading-8 text-green-50 sm:text-xl">
            {content.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-9 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-green-950/20 transition hover:-translate-y-1 hover:bg-green-50 sm:w-auto"
              href="#contact"
            >
              {content.heroPrimaryCtaLabel}
            </a>
            <a
              className="forest-glass-pill inline-flex w-full items-center justify-center rounded-full px-9 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-white/20 sm:w-auto"
              href="#takken"
            >
              {content.heroSecondaryCtaLabel}
            </a>
          </div>
        </div>

        <div className="hero-visual-card relative z-[60] mt-8 w-full max-w-6xl translate-y-6 overflow-visible p-2 sm:mt-10 sm:p-3 lg:mt-10 lg:translate-y-8">
          {/* TODO: vervang deze CSS-placeholder door een echte hero-foto van Scouts Sint-Jan Diest. */}
          <div
            aria-label="Tenten op een scoutskamp in de natuur"
            className="camp-scene has-photo"
            role="img"
            style={imageStyle}
          >
            <span className="camp-tree" />
            <span className="camp-tree" />
            <span className="camp-tree" />
            <span className="camp-tree" />
            <span className="camp-fire" />
          </div>
          <div className="relative z-20 mt-3 grid gap-3 sm:absolute sm:inset-x-5 sm:bottom-5 sm:mt-0 sm:grid-cols-4">
            {[
              [content.heroStatOneTitle, content.heroStatOneLabel],
              [content.heroStatTwoTitle, content.heroStatTwoLabel],
              [content.heroStatThreeTitle, content.heroStatThreeLabel],
              [content.heroStatFourTitle, content.heroStatFourLabel],
            ].map(([title, label]) => (
              <div
                className="hero-floating-card rounded-2xl px-4 py-3 text-slate-950"
                key={title}
              >
                <p className="text-lg font-black">{title}</p>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
