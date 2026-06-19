export type ProgramItem = {
  date: string;
  title: string;
  time: string;
  description: string;
};

const emptyProgramItem: ProgramItem = {
  date: "",
  title: "",
  time: "",
  description: "",
};

function normalizeItem(item: Partial<ProgramItem>): ProgramItem {
  return {
    date: String(item.date ?? "").trim(),
    title: String(item.title ?? "").trim(),
    time: String(item.time ?? "").trim(),
    description: String(item.description ?? "").trim(),
  };
}

function parseLegacyProgram(value: string): ProgramItem[] {
  return value
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [headline = "", ...bodyLines] = block.split(/\r?\n/);
      const dateMatch = headline.match(/\b\d{1,2}\/\d{1,2}\b/);

      if (!dateMatch) {
        return null;
      }

      const timeMatch = headline.match(
        /\b\d{1,2}u(?:\d{2})?\s*(?:-|tot)\s*\d{1,2}u(?:\d{2})?\b/i
      );
      const title = headline
        .replace(dateMatch[0], "")
        .replace(timeMatch?.[0] ?? "", "")
        .trim();

      return normalizeItem({
        date: dateMatch[0],
        title,
        time: timeMatch?.[0] ?? "",
        description: bodyLines.join("\n"),
      });
    })
    .filter((item): item is ProgramItem => Boolean(item));
}

export function parseProgramItems(value: string): ProgramItem[] {
  if (!value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as { items?: Partial<ProgramItem>[] };
    if (Array.isArray(parsed.items)) {
      return parsed.items.map(normalizeItem);
    }
  } catch {
    return parseLegacyProgram(value);
  }

  return parseLegacyProgram(value);
}

export function getVisibleProgramItems(value: string): ProgramItem[] {
  return parseProgramItems(value).filter(
    (item) => item.date && item.title && item.time
  );
}

export function stringifyProgramItems(items: ProgramItem[]) {
  return JSON.stringify({
    // TODO: vervang deze demo-opslag later door echte programmadata in een database.
    items: items.map(normalizeItem),
  });
}

export function createProgramItem(): ProgramItem {
  return { ...emptyProgramItem, time: "14u-17u" };
}
