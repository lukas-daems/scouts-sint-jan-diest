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

function buttonMatchesRemovedHomepageBlock(button: HTMLButtonElement) {
  const text = button.textContent?.replace(/\s+/g, " ").trim() ?? "";

  return removedHomepageBlocks.some(
    (block) => text.includes(block.title) && text.includes(block.description)
  );
}

export default function AdminInterfaceCleanup() {
  useEffect(() => {
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

    hideRemovedHomepageBlocks();

    const observer = new MutationObserver(hideRemovedHomepageBlocks);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
