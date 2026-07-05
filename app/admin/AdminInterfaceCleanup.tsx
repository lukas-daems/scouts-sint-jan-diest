"use client";

import { useEffect, useState } from "react";

type AdminRole = "superadmin" | "branch" | "";

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

const friendlyPhraseReplacements: Array<[string, string]> = [
  ["Hero, praktisch en kamp", "Bovenkant en praktische info"],
  ["Hero foto", "Grote foto bovenaan"],
  ["Hero-foto", "Grote foto bovenaan"],
  ["Hero", "Bovenkant"],
  ["hero", "bovenkant"],
  ["CTA-balk", "Knoppenbalk"],
  ["CTA-knop", "Knop"],
  ["CTA's", "Knoppen"],
  ["CTA", "Knop"],
  ["FAQ badge", "Label bij veelgestelde vragen"],
  ["FAQ", "Veelgestelde vragen"],
  ["Badge grote kaart", "Label op de grote kaart"],
  ["Badge", "Label"],
  ["badge", "label"],
  ["Media bewerken", "Foto's en bestanden bewerken"],
  ["Mediabibliotheek", "Fotobibliotheek"],
  ["mediabibliotheek", "fotobibliotheek"],
  ["Gekozen homepageblok", "Gekozen onderdeel"],
  ["Homepage onderdelen", "Homepage bewerken"],
  ["Doorzichtige knop", "Tweede knop"],
  ["Witte knop", "Belangrijkste knop"],
];

const friendlyExactReplacements: Array<[string, string]> = [
  ["Media", "Foto's"],
  ["CTA", "Knop"],
  ["Hero", "Bovenkant"],
  ["Badge", "Label"],
];

const branchPhraseReplacements: Array<[string, string]> = [
  ["Takken bewerken", "Mijn tak bewerken"],
  ["Takkenpagina", "Mijn tak"],
  [
    "Kies een tak. De preview springt mee naar de juiste takpagina.",
    "Beheer de info, leiding en planning van jouw tak.",
  ],
  [
    "Kapoenen, welpen en andere takken",
    "Teksten, leiding en programma van jouw tak",
  ],
];

const branchExactReplacements: Array<[string, string]> = [
  ["Takken", "Mijn tak"],
  ["Takkenpagina", "Mijn tak"],
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

function shouldSkipTextNode(node: Text) {
  const element = node.parentElement;

  if (!element) {
    return true;
  }

  return ["INPUT", "TEXTAREA", "SCRIPT", "STYLE", "OPTION"].includes(
    element.tagName
  );
}

function replaceTextNode(
  node: Text,
  phraseReplacements: Array<[string, string]>,
  exactReplacements: Array<[string, string]>
) {
  const currentValue = node.nodeValue ?? "";
  const normalizedValue = normalizeText(currentValue);
  const exactMatch = exactReplacements.find(([from]) => normalizedValue === from);

  if (exactMatch) {
    node.nodeValue = currentValue.replace(normalizedValue, exactMatch[1]);
    return;
  }

  let nextValue = currentValue;

  phraseReplacements.forEach(([from, to]) => {
    nextValue = nextValue.replaceAll(from, to);
  });

  if (nextValue !== currentValue) {
    node.nodeValue = nextValue;
  }
}

function replaceInterfaceText(role: AdminRole) {
  const phraseReplacements =
    role === "branch"
      ? [...friendlyPhraseReplacements, ...branchPhraseReplacements]
      : friendlyPhraseReplacements;
  const exactReplacements =
    role === "branch"
      ? [...friendlyExactReplacements, ...branchExactReplacements]
      : friendlyExactReplacements;
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => {
    if (!shouldSkipTextNode(node)) {
      replaceTextNode(node, phraseReplacements, exactReplacements);
    }
  });
}

function getSaveButtonLabel(role: AdminRole) {
  const pageText = normalizeText(document.body.textContent ?? "");

  if (
    pageText.includes("Mijn tak bewerken") ||
    pageText.includes("Takken bewerken")
  ) {
    return role === "branch" ? "Mijn tak opslaan" : "Takken opslaan";
  }

  if (
    pageText.includes("Homepage bewerken") ||
    pageText.includes("Homepage onderdelen")
  ) {
    return "Homepage opslaan";
  }

  if (
    pageText.includes("Foto's en bestanden bewerken") ||
    pageText.includes("Media bewerken")
  ) {
    return "Foto's opslaan";
  }

  if (pageText.includes("Contact bewerken")) {
    return "Contact opslaan";
  }

  if (pageText.includes("Footer bewerken")) {
    return "Footer opslaan";
  }

  if (pageText.includes("Hoofdmenu")) {
    return "Menu opslaan";
  }

  if (pageText.includes("Activiteiten, steunacties en praktische pagina")) {
    return "Pagina opslaan";
  }

  if (pageText.includes("Algemene gegevens")) {
    return "Algemene gegevens opslaan";
  }

  return "Onderdeel opslaan";
}

function updateSaveButtons(role: AdminRole) {
  document.querySelectorAll("button[type='submit']").forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const label = normalizeText(button.textContent ?? "");

    if (!label || label.includes("...")) {
      return;
    }

    button.textContent = getSaveButtonLabel(role);
  });
}

function enhanceAdminInterface(role: AdminRole) {
  hideRemovedHomepageBlocks();
  replaceInterfaceText(role);
  updateSaveButtons(role);
}

export default function AdminInterfaceCleanup() {
  const [role, setRole] = useState<AdminRole>("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/session")
      .then((response) => (response.ok ? response.json() : null))
      .then(
        (payload: {
          session?: { role?: "superadmin" | "branch" } | null;
        } | null) => {
          if (cancelled) {
            return;
          }

          if (payload?.session?.role === "branch") {
            setRole("branch");
          } else if (payload?.session?.role === "superadmin") {
            setRole("superadmin");
          }
        }
      )
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const runCleanup = () => enhanceAdminInterface(role);

    runCleanup();

    const observer = new MutationObserver(runCleanup);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [role]);

  return null;
}
