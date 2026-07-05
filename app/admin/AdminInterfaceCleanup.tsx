"use client";

import { useEffect } from "react";

const removedHomepageBlocks = [
  {
    title: "Waarom scouts?",
    description: "De overtuigingssectie voor ouders op de homepage.",
  },
  {
    title: "Kamp",
    description: "Teksten voor de kampsectie.",
  },
];

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function buttonMatchesRemovedHomepageBlock(button: HTMLButtonElement) {
  const text = normalizeText(button.textContent ?? "");

  return removedHomepageBlocks.some(
    (block) => text.includes(block.title) && text.includes(block.description)
  );
}

function hideRemovedHomepageBlocks() {
  document.querySelectorAll("button").forEach((button) => {
    if (
      button instanceof HTMLButtonElement &&
      buttonMatchesRemovedHomepageBlock(button)
    ) {
      button.hidden = true;
      button.setAttribute("aria-hidden", "true");
    }
  });
}

export default function AdminInterfaceCleanup() {
  useEffect(() => {
    hideRemovedHomepageBlocks();

    const observer = new MutationObserver(hideRemovedHomepageBlocks);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
