import type { EditableSiteContent } from "../lib/site-content-defaults";
import { images } from "../lib/image-placeholders";

type HeroProps = {
  content: EditableSiteContent;
};

function cleanHeroText(value: string, siteName: string) {
  return value
    .replace(/Scouts Sint-Jan Diest/g, siteName)
    .replace(/kinderen en jongeren/g, "jongens")
    .replace(/Een warme scoutsgroep/g, "Een jongensscouts")
    .replace(/Elke week beleven/g, "Elke zaterdag beleven");
}

function getHeroCopy(content: EditableSiteContent) {
  const siteName = content.siteName || "Scouts Sint-Jan Berchmans";
  const eyebrow = /offici.?le scoutsgroep uit diest/i.test(content.heroEyebrow)
    ? "JONGENSSCOUTS UIT DIEST"
    : cleanHeroText(content.heroEyebrow, siteName);
  const titleLineOne =
    content.heroTitleLineOne.trim().toLowerCase() === "avontuur begint bij"
      ? "Elke zaterdag op avontuur bij"
      : cleanHeroText(content.heroTitleLineOne, siteName);
  const titleLineTwo = cleanHeroText(content.heroTitleLineTwo, siteName);
  const defaultSubtitle =
    "Elke zaterdag van 14u tot 17u trekken jongens van 6 tot 18 jaar in Diest naar buiten voor spel, tocht, techniek en kampvoorbereiding. Nieuwe leden mogen eerst vrijblijvend komen proberen.";
  const subtitle = /avontuur, vriendschap en groei/i.test(content.heroSubtitle)
    ? defaultSubtitle
    : cleanHeroText(content.heroSubtitle, siteName);
  const stats = [
    [content.heroStatOneTitle, content.heroStatOneLabel],
    [content.heroStatTwoTitle, content.heroStatTwoLabel],
    [content.heroStatThreeTitle, content.heroStatThreeLabel],
    [content.heroStatFourTitle, content.heroStatFourLabel],
  ].map(([title, label]) => [
    cleanHeroText(title, siteName),
    label === "voor 6-18 jaar" ? "jongens 6-18 jaar" : cleanHeroText(label, siteName),
  ]);

  return { eyebrow, titleLineOne, titleLineTwo, subtitle, stats };
}

export default function Hero({ content }: HeroProps) {
  const heroImage = content.heroImageUrl || images.hero;
  const heroLogo = content.siteLogoDarkBackgroundUrl || content.siteLogoUrl || "";
  const copy = getHeroCopy(content);
  const imageStyle = {
    backgroundImage: `url("${heroImage}")`,
  };

  return (
    <section
      className="hero-photo relative z-20 isolate min-h-[720px] overflow-hidden bg-[#103001] px-5 pt-20 text-white sm:px-8 lg:min-h-[780px] lg:px-10"
      id="home"
    >
      <div
        aria-label="Scoutsactiviteit in de natuur"
        className="absolute inset-0 bg-cover bg-center"
        role="img"
        style={imageStyle}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,12,1,0.36)_0%,rgba(6,18,3,0.42)_34%,rgba(6,18,3,0.7)_100%)]" />
      <div aria-hidden="true" className="visual-noise absolute inset-0 opacity-25" />

      <div className="relative mx-auto flex min-h-[calc(720px-5rem)] max-w-7xl flex-col items-center justify-center py-14 text-center lg:min-h-[calc(780px-5rem)] lg:py-20">
        {heroLogo ? (
          <img
            alt={`Logo van ${content.siteName || "Scouts Sint-Jan Berchmans"}`}
            className={`site-logo-hero-mark mb-6 h-20 w-auto max-w-[180px] object-contain drop-shadow-[0_18px_38px_rgba(0,0,0,0.34)] sm:h-24 sm:max-w-[240px] ${
              content.siteLogoDarkBackgroundUrl ? "" : "site-logo-cutout"
            }`}
            src={heroLogo}
          />
        ) : null}

        <div className="section-fade max-w-5xl">
          <div className="hero-eyebrow-badge mb-5 inline-flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full px-4 py-2 text-[0.68rem] font-bold uppercase leading-none tracking-[0.14em] text-green-50 sm:text-xs">
            <span>{copy.eyebrow}</span>
            {content.heroOrgLabel ? <span>{content.heroOrgLabel}</span> : null}
          </div>

          <h1 className="mx-auto max-w-5xl text-4xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            {copy.titleLineOne}
            <span className="mt-1 block sm:mt-2">{copy.titleLineTwo}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[780px] text-base font-medium leading-7 text-white/90 sm:text-xl sm:leading-8">
            {copy.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-9 py-4 text-sm font-black text-[#103001] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:bg-green-50 sm:w-auto"
              href="#contact"
            >
              {content.heroPrimaryCtaLabel}
            </a>
            <a
              className="inline-flex w-full items-center justify-center rounded-full border border-white/70 bg-transparent px-9 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/12 sm:w-auto"
              href="#takken"
            >
              {content.heroSecondaryCtaLabel}
            </a>
          </div>
        </div>

        <div className="mt-12 grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-14">
          {copy.stats.map(([title, label], index) => (
            <div className="hero-photo-stat rounded-2xl px-4 py-3 text-left" key={`${title}-${index}`}>
              <p className="text-sm font-black text-slate-950 sm:text-lg">{title}</p>
              <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-slate-500 sm:text-xs">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
