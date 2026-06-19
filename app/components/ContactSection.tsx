"use client";

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useState } from "react";
import IconBadge from "./IconBadge";
import type { EditableSiteContent } from "../lib/site-content-defaults";

const fields = [
  { label: "Naam ouder", name: "parentName", type: "text" },
  { label: "Naam kind", name: "childName", type: "text" },
  { label: "Leeftijd kind", name: "childAge", type: "text" },
  { label: "E-mailadres", name: "email", type: "email" },
  { label: "Telefoonnummer", name: "phone", type: "tel" },
];

type ContactSectionProps = {
  content: EditableSiteContent;
};

export default function ContactSection({ content }: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

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
          <form
            className="rounded-[2rem] border border-slate-200 bg-[#fbfdf9] p-6 shadow-xl shadow-green-950/8 sm:p-8"
            onSubmit={handleSubmit}
          >
            {/* TODO: koppel dit formulier later aan een echte verzendfunctie. */}
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <label
                  className="grid gap-2 text-sm font-semibold text-slate-700"
                  key={field.name}
                >
                  {field.label}
                  <input
                    className="min-h-14 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                    name={field.name}
                    required
                    type={field.type}
                  />
                </label>
              ))}
              <label className="grid gap-2 text-sm font-semibold text-slate-700 sm:col-span-2">
                Bericht
                <textarea
                  className="min-h-40 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]"
                  name="message"
                  required
                />
              </label>
            </div>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                className="inline-flex items-center justify-center rounded-full bg-[#103001] px-9 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/20 transition hover:-translate-y-1 hover:bg-[#1e4b0d]"
                type="submit"
              >
                {content.contactFormButton}
              </button>
              {submitted ? (
                <p className="rounded-full bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
                  Bedankt! Dit formulier is voorlopig een demo.
                </p>
              ) : null}
            </div>
          </form>

          <aside className="blue-pattern relative overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl shadow-green-950/20">
            <div className="relative">
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full shadow-xl shadow-green-950/20 ring-1 ring-white/35">
                <img
                  alt={`Logo van ${content.siteName}`}
                  className="h-full w-full rounded-full object-cover"
                  src={content.siteLogoUrl || "/assets/logo.png"}
                />
              </span>
              <h3 className="mt-8 text-3xl font-black">{content.siteName}</h3>
              <p className="mt-3 text-green-100">{content.contactLocation}</p>

              <div className="mt-8 space-y-5 text-green-50">
                <p>
                  <span className="font-bold text-white">E-mail:</span>{" "}
                  {content.contactEmail}
                </p>
                <p>
                  <span className="font-bold text-white">Telefoon:</span>{" "}
                  {content.contactPhone}
                </p>
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
