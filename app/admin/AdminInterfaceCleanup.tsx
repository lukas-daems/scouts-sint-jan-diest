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

const removedAdminPanels = ["Planningkader"];

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

function hideRemovedAdminPanels() {
  document.querySelectorAll("h3").forEach((heading) => {
    if (!(heading instanceof HTMLHeadingElement)) {
      return;
    }

    if (!removedAdminPanels.includes(normalizeText(heading.textContent ?? ""))) {
      return;
    }

    const panel = heading.closest("div.rounded-3xl");
    if (panel instanceof HTMLElement) {
      panel.hidden = true;
      panel.setAttribute("aria-hidden", "true");
    }
  });
}

function cleanupRemovedAdminContent() {
  hideRemovedHomepageBlocks();
  hideRemovedAdminPanels();
}

export default function AdminInterfaceCleanup() {
  useEffect(() => {
    cleanupRemovedAdminContent();

    const observer = new MutationObserver(cleanupRemovedAdminContent);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
