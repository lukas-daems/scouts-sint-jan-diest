"use client";

import { FormEvent, useState } from "react";
import type { SitePageFormField } from "../lib/site-pages";

type PageDemoFormProps = {
  title: string;
  intro: string;
  fields: SitePageFormField[];
  submitLabel: string;
  successMessage: string;
};

export default function PageDemoForm({
  title,
  intro,
  fields,
  submitLabel,
  successMessage,
}: PageDemoFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form
      className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-green-950/8 sm:p-8"
      id="formulier"
      onSubmit={handleSubmit}
    >
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f6b18]">
        Formulier
      </p>
      <h2 className="mt-3 text-3xl font-black text-slate-950">{title}</h2>
      <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{intro}</p>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const commonClass =
            "min-h-12 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-[#2f6b18] focus:ring-4 focus:ring-[#d7e8cf]";

          if (field.type === "textarea") {
            return (
              <label
                className="grid gap-2 text-sm font-bold text-slate-700 md:col-span-2"
                key={field.label}
              >
                {field.label}
                <textarea className={`${commonClass} min-h-32`} />
              </label>
            );
          }

          if (field.type === "select") {
            return (
              <label
                className="grid gap-2 text-sm font-bold text-slate-700"
                key={field.label}
              >
                {field.label}
                <select className={commonClass} defaultValue="">
                  <option disabled value="">
                    Kies een optie
                  </option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          return (
            <label
              className="grid gap-2 text-sm font-bold text-slate-700"
              key={field.label}
            >
              {field.label}
              <input className={commonClass} type={field.type || "text"} />
            </label>
          );
        })}
      </div>

      {submitted ? (
        <p className="mt-6 rounded-2xl bg-[#edf6e8] p-4 text-sm font-bold leading-6 text-[#103001] ring-1 ring-[#d7e8cf]">
          {successMessage}
        </p>
      ) : null}

      <button
        className="mt-7 inline-flex rounded-full bg-[#103001] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/15 transition hover:-translate-y-0.5 hover:bg-[#1e4b0d]"
        type="submit"
      >
        {submitLabel}
      </button>
    </form>
  );
}
