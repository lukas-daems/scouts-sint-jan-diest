"use client";

/* eslint-disable @next/next/no-img-element */

import IconBadge from "./IconBadge";
import type { EditableSiteContent } from "../lib/site-content-defaults";

type ContactSectionProps = {
  content: EditableSiteContent;
};

function getContactPhones(content: EditableSiteContent) {
  const phoneLines = (content.contactPhones || content.contactPhone)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsedPhones = phoneLines.map((line) => {
    const [name = "", phone = ""] = line.split("|");

    return {
      name: name.trim() || "Groepsleiding",
      phone: phone.trim() || name.trim(),
    };
  });

  return parsedPhones.length
    ? parsedPhones
    : [{ name: "Groepsleiding", phone: content.contactPhone }];
}

function getContactCopy(content: EditableSiteContent) {
  const subtitle = /Heb je vragen, wil je je kind inschrijven/i.test(
    content.contactSubtitle
  )
    ? "Wil je je zoon eens laten proberen, heb je een praktische vraag of zoek je de juiste leiding? Stuur ons gerust een bericht. We helpen je verder zonder gedoe."
    : content.contactSubtitle.replace(/je kind/g, "je zoon");
  const externalTitle = /Schrijf je in of stel je vraag/i.test(
    content.contactExternalTitle
  )
    ? "Laat iets van je horen"
    : content.contactExternalTitle;
  const externalText = /Nieuwe leden zijn welkom/i.test(content.contactExternalText)
    ? "Nieuwe leden mogen eerst vrijblijvend kennismaken op zaterdag. Na contact laten we weten bij welke tak je zoon kan aansluiten en wat praktisch handig is."
    : content.contactExternalText.replace(/je kind/g, "je zoon");
  const trustText = /Nieuwe leden zijn welkom/i.test(content.contactTrustText)
    ? "Eerst eens proberen mag. Zo voelt je zoon snel of scouts iets voor hem is."
    : content.contactTrustText.replace(/je kind/g, "je zoon");

  return { subtitle, externalTitle, externalText, trustText };
}

export default function ContactSection({ content }: ContactSectionProps) {
  const copy = getContactCopy(content);
  const hasExternalLink = Boolean(content.contactExternalUrl);
  const contactPhones = getContactPhones(content);
  const contrastLogoSrc = content.siteLogoDarkBackgroundUrl || "";
  const logoSrc = contrastLogoSrc || content.siteLogoUrl || "/assets/logo.png";
  const hasLogoForGreenBackground = Boolean(contrastLogoSrc);

  return (
    <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10" id="contact">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full bg-[#edf6e8] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#103001]">
            {content.contactBadge}
          </p>
          <h2 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
            {content.contactTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            {copy.subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <article className="rounded-[2rem] border border-[#d7e8cf] bg-[#fbfdf9] p-5 shadow-xl shadow-green-950/8 sm:p-7">
            <div className="rounded-[1.7rem] bg-[#edf6e8] p-5 ring-1 ring-[#d7e8cf] sm:p-7">
              <IconBadge icon="mail" tone="green" />
              <h3 className="mt-5 text-2xl font-black text-slate-950 sm:text-3xl">
                {copy.externalTitle}
              </h3>
              <p className="mt-3 whitespace-pre-line text-base leading-7 text-slate-700">
                {copy.externalText}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {hasExternalLink ? (
                  <a
                    className="inline-flex justify-center rounded-full bg-[#103001] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-green-950/16 transition hover:-translate-y-1 hover:bg-[#1e4b0d]"
                    href={content.contactExternalUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {content.contactExternalButton}
                  </a>
                ) : (
                  <span className="inline-flex justify-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#103001] ring-1 ring-[#d7e8cf]">
                    Link volgt binnenkort
                  </span>
                )}
                <a
                  className="inline-flex justify-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#103001] ring-1 ring-[#d7e8cf] transition hover:bg-green-50"
                  href={`mailto:${content.contactEmail}`}
                >
                  {content.contactMailCta}
                </a>
              </div>
            </div>

            {content.contactNoticeText ? (
              <p className="mt-5 whitespace-pre-line rounded-3xl bg-white p-4 text-sm font-semibold leading-7 text-slate-600 ring-1 ring-slate-200">
                {content.contactNoticeText}
              </p>
            ) : null}

            <div className="mt-5 rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-lg shadow-green-950/6">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                {content.contactStepsTitle || "Wat gebeurt er daarna?"}
              </p>
              <div className="mt-4 grid gap-2.5">
                {[
                  [
                    "1",
                    content.contactStepOne ||
                      "We bekijken bij welke tak je zoon past.",
                  ],
                  [
                    "2",
                    content.contactStepTwo ||
                      "Je krijgt praktische info over zaterdag 14u-17u.",
                  ],
                  [
                    "3",
                    content.contactStepThree ||
                      "Nieuwe leden mogen eerst vrijblijvend proberen.",
                  ],
                ].map(([step, text]) => (
                  <div
                    className="flex items-center gap-3 rounded-2xl bg-[#fbfdf9] px-4 py-2.5 ring-1 ring-slate-200"
                    key={step}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#103001] text-xs font-black text-white">
                      {step}
                    </span>
                    <p className="text-sm font-semibold leading-6 text-slate-700">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <aside className="blue-pattern relative overflow-hidden rounded-[2rem] p-6 text-white shadow-2xl shadow-green-950/18 sm:p-7">
            <div className="relative">
              <span
                className={
                  hasLogoForGreenBackground
                    ? "inline-flex max-w-full"
                    : "inline-flex max-w-full rounded-[1.4rem] bg-[#f7f0dc] p-3 shadow-2xl shadow-black/20 ring-1 ring-white/35"
                }
              >
                <img
                  alt={`Logo van ${content.siteName}`}
                  className={`max-w-full object-contain ${
                    hasLogoForGreenBackground
                      ? "h-20 drop-shadow-[0_18px_28px_rgba(0,0,0,0.28)] sm:h-24"
                      : "site-logo-cutout h-20 drop-shadow-[0_10px_18px_rgba(16,48,1,0.18)] sm:h-24"
                  }`}
                  src={logoSrc}
                />
              </span>
              <h3 className="mt-6 text-2xl font-black sm:text-3xl">{content.siteName}</h3>
              <p className="mt-2 text-green-100">{content.contactLocation}</p>

              <div className="mt-6 space-y-4 text-green-50">
                <p>
                  <span className="font-bold text-white">E-mail:</span>{" "}
                  <a
                    className="break-all transition hover:text-white"
                    href={`mailto:${content.contactEmail}`}
                  >
                    {content.contactEmail}
                  </a>
                </p>
                <div>
                  <p className="font-bold text-white">
                    Telefoonnummers groepsleiding:
                  </p>
                  <div className="mt-2 grid gap-2">
                    {contactPhones.map((item) => (
                      <a
                        className="flex flex-col gap-1 rounded-2xl bg-white/10 px-4 py-3 text-sm ring-1 ring-white/15 transition hover:bg-white/16 hover:text-white"
                        href={`tel:${item.phone.replace(/\s/g, "")}`}
                        key={`${item.name}-${item.phone}`}
                      >
                        <span className="font-bold text-white">{item.name}</span>
                        <span className="font-semibold text-green-50">
                          {item.phone}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
                <p>
                  <span className="font-bold text-white">Instagram:</span>{" "}
                  {content.instagram}
                </p>
                <p>
                  <span className="font-bold text-white">Facebook:</span>{" "}
                  {content.facebook}
                </p>
              </div>

              <a
                className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-green-50"
                href={`mailto:${content.contactEmail}`}
              >
                {content.contactMailCta}
              </a>

              <div className="mt-6 rounded-3xl bg-white/10 p-4 ring-1 ring-white/15">
                <div className="flex items-center gap-4">
                  <IconBadge icon="heart" tone="light" />
                  <p className="text-sm leading-7 text-green-50">
                    {copy.trustText}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
