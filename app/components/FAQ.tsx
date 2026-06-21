"use client";

import { useState } from "react";
import type { EditableSiteContent } from "../lib/site-content-defaults";
import { parseFaqItems } from "../lib/faq";

type FAQProps = {
  content: EditableSiteContent;
};

export default function FAQ({ content }: FAQProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = parseFaqItems(content.faqItems);

  return (
    <section className="bg-[#f2f8ee] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#103001] shadow-sm">
            {content.faqBadge}
          </p>
          <h2 className="text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            {content.faqTitle}
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            {content.faqSubtitle}
          </p>
          <a
            className="mt-8 inline-flex rounded-full bg-[#103001] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-green-950/20 transition hover:-translate-y-1 hover:bg-[#1e4b0d]"
            href="#contact"
          >
            {content.faqCtaLabel}
          </a>
        </div>

        <div className="space-y-4">
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
                  className="flex w-full items-center justify-between gap-5 rounded-3xl px-6 py-6 text-left transition hover:bg-[#f2f8ee]"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  type="button"
                >
                  <span className="text-lg font-bold text-slate-950">
                    {faq.question}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf6e8] text-xl font-bold text-[#103001]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-8 text-slate-600">
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
