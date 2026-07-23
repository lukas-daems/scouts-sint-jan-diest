"use client";

import { useState } from "react";
import type { EditableSiteContent } from "../lib/site-content-defaults";
import { parseFaqItems } from "../lib/faq";

type FAQProps = {
  content: EditableSiteContent;
};

export default function FAQ({ content }: FAQProps) {
  const [openIndex, setOpenIndex] = useState(-1);
  const faqs = parseFaqItems(content.faqItems);
  const subtitle = /Nieuwe leden en ouders zitten vaak met praktische vragen/i.test(
    content.faqSubtitle
  )
    ? "De vragen die ouders meestal eerst stellen. Staat je vraag er niet tussen? Stuur ons gerust een bericht."
    : content.faqSubtitle;

  return (
    <section className="bg-[#f2f8ee] px-5 py-14 sm:px-8 sm:py-18 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#103001] shadow-sm">
            {content.faqBadge}
          </p>
          <h2 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
            {content.faqTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {subtitle}
          </p>
          <a
            className="mt-6 inline-flex rounded-full bg-[#103001] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-green-950/16 transition hover:-translate-y-1 hover:bg-[#1e4b0d]"
            href="#contact"
          >
            {content.faqCtaLabel}
          </a>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <article
                className={`rounded-3xl border bg-white shadow-sm transition ${
                  isOpen
                    ? "border-[#d7e8cf] shadow-xl shadow-green-950/8"
                    : "border-slate-200"
                }`}
                key={faq.question}
              >
                <button
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-5 rounded-3xl px-5 py-4 text-left transition hover:bg-[#f2f8ee] sm:px-6"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  type="button"
                >
                  <span className="text-base font-bold text-slate-950 sm:text-lg">
                    {faq.question}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf6e8] text-lg font-bold text-[#103001]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 leading-7 text-slate-600 sm:px-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
