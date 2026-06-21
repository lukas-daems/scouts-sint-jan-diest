export type FAQItem = {
  question: string;
  answer: string;
};

export const defaultFaqItems: FAQItem[] = [
  {
    question: "Vanaf welke leeftijd kan mijn zoon aansluiten?",
    answer:
      "Jongens kunnen aansluiten vanaf 6 jaar. Bij Scouts Sint-Jan Berchmans werken we met takken van kapoenen tot jins, voor jongens van 6 tot 18 jaar.",
  },
  {
    question: "Moet mijn zoon al iemand kennen?",
    answer:
      "Nee, dat hoeft niet. Nieuwe leden worden begeleid door de leiding en leren de groep snel kennen tijdens de activiteiten.",
  },
  {
    question: "Wanneer zijn de activiteiten?",
    answer:
      "De gewone activiteiten vinden elke zaterdag plaats van 14u tot 17u. Als een vergadering uitzonderlijk andere uren heeft, communiceert de leiding dat via het programma.",
  },
  {
    question: "Wat kost scouts?",
    answer:
      "Het lidgeld en eventuele kosten voor weekends of kamp worden duidelijk gecommuniceerd. Voeg hier later de exacte bedragen toe.",
  },
  {
    question: "Heeft mijn zoon een uniform nodig?",
    answer:
      "Een scoutsuniform of scoutshemd kan deel uitmaken van de werking. Nieuwe leden krijgen hierover duidelijke uitleg bij inschrijving.",
  },
  {
    question: "Hoe zit het met kamp?",
    answer:
      "Tijdens het jaar zijn er meestal twee weekends en in de zomervakantie is er een zomerkamp. Ouders krijgen vooraf alle praktische info, zoals data, locatie, bagagelijst en medische gegevens.",
  },
  {
    question: "Wie begeleidt de activiteiten?",
    answer:
      "De activiteiten worden voorbereid en begeleid door geëngageerde leiding die verantwoordelijkheid opneemt voor hun tak.",
  },
];

export function createFaqItem(): FAQItem {
  return {
    question: "Nieuwe vraag",
    answer: "Schrijf hier het antwoord.",
  };
}

export function stringifyFaqItems(items: FAQItem[]) {
  return JSON.stringify(items);
}

export function parseFaqItems(value: string): FAQItem[] {
  if (!value.trim()) {
    return defaultFaqItems;
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return defaultFaqItems;
    }

    const items = parsed
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const faq = item as Partial<FAQItem>;
        return {
          question: typeof faq.question === "string" ? faq.question : "",
          answer: typeof faq.answer === "string" ? faq.answer : "",
        };
      })
      .filter(
        (item): item is FAQItem =>
          Boolean(item && (item.question.trim() || item.answer.trim()))
      );

    return items.length > 0 ? items : defaultFaqItems;
  } catch {
    return defaultFaqItems;
  }
}
