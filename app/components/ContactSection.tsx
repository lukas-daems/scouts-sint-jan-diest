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
  const logoSrc =
    content.siteLogoUrl || content.siteLogoDarkBackgroundUrl || "/assets/logo.png";

  return (
    <section
      className="border-t border-slate-200 bg-[#f6f8f3] px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
      id="contact"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-b border-slate-200 pb-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2f6b18]">
              {content.contactBadge}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              {content.contactTitle}
            </h2>
          </div>
          <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg lg:justify-self-end">
            {copy.subtitle}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <IconBadge icon="mail" tone="green" />
                <div className="max-w-2xl">
                  <h3 className="text-2xl font-black text-slate-950 sm:text-3xl">
                    {copy.externalTitle}
                  </h3>
                  <p className="mt-3 whitespace-pre-line text-base leading-7 text-slate-700">
                    {copy.externalText}
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {hasExternalLink ? (
                      <a
                        className="inline-flex justify-center rounded-full bg-[#103001] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-950/12 transition hover:-translate-y-0.5 hover:bg-[#1e4b0d]"
                        href={content.contactExternalUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {content.contactExternalButton}
                      </a>
                    ) : (
                      <span className="inline-flex justify-center rounded-full bg-[#f7fbf4] px-7 py-3.5 text-sm font-bold text-[#103001] ring-1 ring-[#d7e8cf]">
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
              </div>
            </article>

            {content.contactNoticeText ? (
              <p className="whitespace-pre-line rounded-2xl border border-slate-200 bg-white p-5 text-sm font-semibold leading-7 text-slate-600 shadow-sm">
                {content.contactNoticeText}
              </p>
            ) : null}

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2f6b18]">
                {content.contactStepsTitle || "Wat gebeurt er daarna?"}
              </p>
              <div className="mt-5 grid gap-3">
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
                    className="flex items-center gap-3 rounded-xl bg-[#fbfdf9] px-4 py-3 ring-1 ring-slate-200"
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
            </article>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f7f0dc] ring-1 ring-[#e6ddc8]">
                <img
                  alt={`Logo van ${content.siteName}`}
                  className="site-logo-cutout max-h-16 max-w-16 object-contain"
                  src={logoSrc}
                />
              </span>
              <div>
                <h3 className="text-2xl font-black text-slate-950">
                  {content.siteName}
                </h3>
                <p className="mt-1 text-slate-600">{content.contactLocation}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#2f6b18]">
                  E-mail
                </p>
                <a
                  className="mt-2 block break-all text-base font-bold text-slate-950 transition hover:text-[#2f6b18]"
                  href={`mailto:${content.contactEmail}`}
                >
                  {content.contactEmail}
                </a>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#2f6b18]">
                  Telefoonnummers groepsleiding
                </p>
                <div className="mt-3 grid gap-2">
                  {contactPhones.map((item) => (
                    <a
                      className="rounded-xl border border-[#d7e8cf] bg-[#f7fbf4] px-4 py-3 transition hover:border-[#2f6b18] hover:bg-white"
                      href={`tel:${item.phone.replace(/\s/g, "")}`}
                      key={`${item.name}-${item.phone}`}
                    >
                      <span className="block text-sm font-black text-slate-950">
                        {item.name}
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-slate-600">
                        {item.phone}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 border-t border-slate-200 pt-5">
                <p className="text-sm text-slate-700">
                  <span className="font-black text-slate-950">Instagram:</span>{" "}
                  {content.instagram}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-black text-slate-950">Facebook:</span>{" "}
                  {content.facebook}
                </p>
              </div>

              <a
                className="inline-flex w-full items-center justify-center rounded-full bg-[#103001] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-950/12 transition hover:-translate-y-0.5 hover:bg-[#1e4b0d]"
                href={`mailto:${content.contactEmail}`}
              >
                {content.contactMailCta}
              </a>

              <div className="rounded-2xl border border-[#d7e8cf] bg-[#f7fbf4] p-4">
                <div className="flex items-center gap-4">
                  <IconBadge icon="heart" tone="green" />
                  <p className="text-sm leading-7 text-slate-700">
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
