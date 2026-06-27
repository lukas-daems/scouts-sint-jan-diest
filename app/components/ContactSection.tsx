"use client";

/* eslint-disable @next/next/no-img-element */

import IconBadge from "./IconBadge";
import { images } from "../lib/image-placeholders";
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

export default function ContactSection({ content }: ContactSectionProps) {
  const hasExternalLink = Boolean(content.contactExternalUrl);
  const contactPhones = getContactPhones(content);
  const contactImage =
    content.contactImageUrl ||
    content.galleryGroepsactiviteitImageUrl ||
    images.galleryGroepsactiviteit;
  const hasUploadedLogo = Boolean(content.siteLogoUrl);

  return (
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-10" id="contact">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 inline-flex rounded-full bg-[#edf6e8] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#103001]">
            {content.contactBadge}
          </p>
          <h2 className="text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            {content.contactTitle}
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            {content.contactSubtitle}
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
          <article className="rounded-[2rem] border border-[#d7e8cf] bg-[#fbfdf9] p-6 shadow-xl shadow-green-950/8 sm:p-8">
            <div className="rounded-[1.7rem] bg-[#edf6e8] p-6 ring-1 ring-[#d7e8cf] sm:p-8">
              <IconBadge icon="mail" tone="green" />
              <h3 className="mt-6 text-3xl font-black text-slate-950">
                {content.contactExternalTitle}
              </h3>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700">
                {content.contactExternalText}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {hasExternalLink ? (
                  <a
                    className="inline-flex justify-center rounded-full bg-[#103001] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/20 transition hover:-translate-y-1 hover:bg-[#1e4b0d]"
                    href={content.contactExternalUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {content.contactExternalButton}
                  </a>
                ) : (
                  <span className="inline-flex justify-center rounded-full bg-white px-8 py-4 text-sm font-bold text-[#103001] ring-1 ring-[#d7e8cf]">
                    Link volgt binnenkort
                  </span>
                )}
                <a
                  className="inline-flex justify-center rounded-full bg-white px-8 py-4 text-sm font-bold text-[#103001] ring-1 ring-[#d7e8cf] transition hover:bg-green-50"
                  href={`mailto:${content.contactEmail}`}
                >
                  {content.contactMailCta}
                </a>
              </div>
            </div>

            {content.contactNoticeText ? (
              <p className="mt-6 whitespace-pre-line rounded-3xl bg-white p-5 text-sm font-semibold leading-7 text-slate-600 ring-1 ring-slate-200">
                {content.contactNoticeText}
              </p>
            ) : null}

            <div className="mt-6 overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-lg shadow-green-950/6">
              <img
                alt="Sfeerbeeld van Scouts Sint-Jan Berchmans"
                className="h-64 w-full object-cover sm:h-72 lg:h-80"
                src={contactImage}
              />
            </div>
          </article>

          <aside className="blue-pattern relative overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl shadow-green-950/20">
            <div className="relative">
              {hasUploadedLogo ? (
                <img
                  alt={`Logo van ${content.siteName}`}
                  className="site-logo-cutout h-24 max-w-[300px] object-contain drop-shadow-[0_18px_34px_rgba(0,0,0,0.3)]"
                  src={content.siteLogoUrl}
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full shadow-xl shadow-green-950/20 ring-1 ring-white/35">
                  <img
                    alt={`Logo van ${content.siteName}`}
                    className="h-full w-full rounded-full object-cover"
                    src="/assets/logo.png"
                  />
                </span>
              )}
              <h3 className="mt-8 text-3xl font-black">{content.siteName}</h3>
              <p className="mt-3 text-green-100">{content.contactLocation}</p>

              <div className="mt-8 space-y-5 text-green-50">
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
                className="mt-9 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-green-50"
                href={`mailto:${content.contactEmail}`}
              >
                {content.contactMailCta}
              </a>

              <div className="mt-8 rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
                <div className="flex items-center gap-4">
                  <IconBadge icon="heart" tone="light" />
                  <p className="text-sm leading-7 text-green-50">
                    {content.contactTrustText}
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
