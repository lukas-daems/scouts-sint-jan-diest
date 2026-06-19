import type { EditableSiteContent } from "./site-content-defaults";
import { stringifyProgramItems } from "./program";

export type BranchProfile = {
  name: string;
  slug: string;
  age: string;
  icon: "spark" | "tree" | "compass" | "route" | "flag";
  logoKey: keyof EditableSiteContent;
  contentKeys: {
    age: keyof EditableSiteContent;
    shortDescription: keyof EditableSiteContent;
    intro: keyof EditableSiteContent;
    highlights: keyof EditableSiteContent;
    program: keyof EditableSiteContent;
    imageUrl: keyof EditableSiteContent;
    leaderNames: keyof EditableSiteContent;
    leaderPhotoUrl: keyof EditableSiteContent;
    planning: {
      day: keyof EditableSiteContent;
      time: keyof EditableSiteContent;
      timeNote: keyof EditableSiteContent;
      location: keyof EditableSiteContent;
      bring: keyof EditableSiteContent;
      contact: keyof EditableSiteContent;
      countText: keyof EditableSiteContent;
      emptyText: keyof EditableSiteContent;
    };
    blocks: Array<{
      title: keyof EditableSiteContent;
      text: keyof EditableSiteContent;
    }>;
  };
  shortDescription: string;
  intro: string;
  imageUrl: string;
  accent: string;
  highlights: string[];
  detailBlocks: Array<{
    title: string;
    text: string;
  }>;
  leaderNames: string;
  leaderPhotoUrl: string;
  program: string;
  planningInfo: {
    day: string;
    time: string;
    timeNote: string;
    location: string;
    bring: string;
    contact: string;
    countText: string;
    emptyText: string;
  };
};

const defaultPlanningInfo = {
  day: "Elke zaterdag",
  time: "14u-17u",
  timeNote: "Meestal 14u-17u, afwijkingen staan bij de vergadering.",
  location: "Diest, Belgie",
  bring: "Kleren die vuil mogen worden",
  contact: "Via de takleiding of groepsleiding",
  countText: "Er staan {aantal} vergaderingen in het programma.",
  emptyText: "Programma wordt binnenkort aangevuld",
};

export const branchProfiles: BranchProfile[] = [
  {
    name: "Kapoenen",
    slug: "kapoenen",
    age: "6-8 jaar",
    icon: "spark",
    logoKey: "branchKapoenenLogoUrl",
    contentKeys: {
      age: "branchKapoenenAge",
      shortDescription: "branchKapoenenShortDescription",
      intro: "branchKapoenenIntro",
      highlights: "branchKapoenenHighlights",
      program: "branchKapoenenProgram",
      imageUrl: "branchKapoenenImageUrl",
      leaderNames: "branchKapoenenLeaderNames",
      leaderPhotoUrl: "branchKapoenenLeaderPhotoUrl",
      planning: {
        day: "branchKapoenenPlanningDay",
        time: "branchKapoenenPlanningTime",
        timeNote: "branchKapoenenPlanningTimeNote",
        location: "branchKapoenenPlanningLocation",
        bring: "branchKapoenenPlanningBring",
        contact: "branchKapoenenPlanningContact",
        countText: "branchKapoenenPlanningCountText",
        emptyText: "branchKapoenenPlanningEmptyText",
      },
      blocks: [
        { title: "branchKapoenenBlockOneTitle", text: "branchKapoenenBlockOneText" },
        { title: "branchKapoenenBlockTwoTitle", text: "branchKapoenenBlockTwoText" },
        { title: "branchKapoenenBlockThreeTitle", text: "branchKapoenenBlockThreeText" },
      ],
    },
    accent: "from-[#103001] via-[#2f6b18] to-emerald-400",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=82",
    shortDescription:
      "Kapoenen leven in een wereld vol fantasie en avontuur. Ze ontdekken scouts door te ravotten, te lachen en samen te spelen.",
    intro:
      "Kapoenen (6-8 jaar) leven in een wereld vol fantasie en avontuur. In een veilige en speelse omgeving ontdekken ze bij ons de wereld door te ravotten, te lachen en samen te spelen.",
    highlights: [
      "Fantasie en avontuur",
      "Ravotten en lachen",
      "Elke zaterdag klaar",
      "Veilig groeien",
    ],
    detailBlocks: [
      {
        title: "Wat doen kapoenen?",
        text: "Kapoenen bruisen van energie en creativiteit. De leiding sluit aan bij wat hen boeit en prikkelt, en helpt die energie helemaal tot leven te brengen.",
      },
      {
        title: "Warme begeleiding",
        text: "Onze leiding zorgt voor een warme en veilige omgeving waarin elk kind zich welkom voelt en op zijn eigen tempo kan groeien.",
      },
      {
        title: "Kom eens proberen",
        text: "Zin om mee op avontuur te gaan? Nieuwe kapoenen mogen gerust eens proberen. Wij staan alvast elke zaterdag klaar.",
      },
    ],
    leaderNames: "Leiding wordt binnenkort aangevuld",
    leaderPhotoUrl: "",
    planningInfo: defaultPlanningInfo,
    program: stringifyProgramItems([
      {
        date: "31/01",
        title: "Zoektocht",
        time: "14u-17u",
        description:
          "De leiding is tijdens het studeren al het spelmateriaal kwijtgeraakt. Willen jullie ons helpen dit terug te vinden?",
      },
      {
        date: "07/02",
        title: "Techniekenvergadering",
        time: "14u-17u",
        description:
          "Deze week leren we op een speelse manier echte scoutstechnieken kennen.",
      },
      {
        date: "14/02",
        title: "Valentijnsvergadering",
        time: "14u-17u",
        description: "Een warme activiteit vol spel, opdrachten en vriendschap.",
      },
    ]),
  },
  {
    name: "Welpen",
    slug: "welpen",
    age: "8-11 jaar",
    icon: "tree",
    logoKey: "branchWelpenLogoUrl",
    contentKeys: {
      age: "branchWelpenAge",
      shortDescription: "branchWelpenShortDescription",
      intro: "branchWelpenIntro",
      highlights: "branchWelpenHighlights",
      program: "branchWelpenProgram",
      imageUrl: "branchWelpenImageUrl",
      leaderNames: "branchWelpenLeaderNames",
      leaderPhotoUrl: "branchWelpenLeaderPhotoUrl",
      planning: {
        day: "branchWelpenPlanningDay",
        time: "branchWelpenPlanningTime",
        timeNote: "branchWelpenPlanningTimeNote",
        location: "branchWelpenPlanningLocation",
        bring: "branchWelpenPlanningBring",
        contact: "branchWelpenPlanningContact",
        countText: "branchWelpenPlanningCountText",
        emptyText: "branchWelpenPlanningEmptyText",
      },
      blocks: [
        { title: "branchWelpenBlockOneTitle", text: "branchWelpenBlockOneText" },
        { title: "branchWelpenBlockTwoTitle", text: "branchWelpenBlockTwoText" },
        { title: "branchWelpenBlockThreeTitle", text: "branchWelpenBlockThreeText" },
      ],
    },
    accent: "from-[#103001] via-[#2f6b18] to-lime-300",
    imageUrl:
      "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?auto=format&fit=crop&w=1400&q=82",
    shortDescription:
      "Welpen spelen grotere groepsspelen, trekken de natuur in en leren stap voor stap samenwerken binnen de groep.",
    intro:
      "Welpen hebben bakken energie. Ze spelen grotere groepsspelen, leren samenwerken en bouwen aan vertrouwen binnen hun tak.",
    highlights: ["Grotere bosspelen", "Samenwerken", "Natuur ontdekken"],
    detailBlocks: [
      {
        title: "Wat doen welpen?",
        text: "Welpen trekken graag naar buiten voor bosspelen, zoektochten en creatieve opdrachten. De activiteiten zijn actief, fantasierijk en gericht op samenspel.",
      },
      {
        title: "Voor ouders",
        text: "De leiding houdt rekening met de leeftijd en zorgt dat elk kind zich welkom voelt. Nieuwe leden worden actief meegenomen in de groep.",
      },
      {
        title: "Groei in de groep",
        text: "Welpen leren afspraken volgen, elkaar helpen en samen uitdagingen oplossen. Zo groeit de groep week na week sterker naar elkaar toe.",
      },
    ],
    leaderNames: "Leiding wordt binnenkort aangevuld",
    leaderPhotoUrl: "",
    planningInfo: defaultPlanningInfo,
    program: stringifyProgramItems([]),
  },
  {
    name: "Jongverkenners",
    slug: "jongverkenners",
    age: "11-13 jaar",
    icon: "compass",
    logoKey: "branchJongverkennersLogoUrl",
    contentKeys: {
      age: "branchJongverkennersAge",
      shortDescription: "branchJongverkennersShortDescription",
      intro: "branchJongverkennersIntro",
      highlights: "branchJongverkennersHighlights",
      program: "branchJongverkennersProgram",
      imageUrl: "branchJongverkennersImageUrl",
      leaderNames: "branchJongverkennersLeaderNames",
      leaderPhotoUrl: "branchJongverkennersLeaderPhotoUrl",
      planning: {
        day: "branchJongverkennersPlanningDay",
        time: "branchJongverkennersPlanningTime",
        timeNote: "branchJongverkennersPlanningTimeNote",
        location: "branchJongverkennersPlanningLocation",
        bring: "branchJongverkennersPlanningBring",
        contact: "branchJongverkennersPlanningContact",
        countText: "branchJongverkennersPlanningCountText",
        emptyText: "branchJongverkennersPlanningEmptyText",
      },
      blocks: [
        {
          title: "branchJongverkennersBlockOneTitle",
          text: "branchJongverkennersBlockOneText",
        },
        {
          title: "branchJongverkennersBlockTwoTitle",
          text: "branchJongverkennersBlockTwoText",
        },
        {
          title: "branchJongverkennersBlockThreeTitle",
          text: "branchJongverkennersBlockThreeText",
        },
      ],
    },
    accent: "from-emerald-600 via-[#2f6b18] to-[#103001]",
    imageUrl:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1400&q=82",
    shortDescription:
      "Jongverkenners krijgen meer uitdaging, avontuur en verantwoordelijkheid. Ze leren technieken, spelen intensere spelen en groeien als groep.",
    intro:
      "Bij de jongverkenners wordt scouts uitdagender. Leden krijgen meer verantwoordelijkheid en ontdekken technieken, tochten en stevigere activiteiten.",
    highlights: ["Meer uitdaging", "Scoutsvaardigheden", "Groepsgevoel"],
    detailBlocks: [
      {
        title: "Wat doen jongverkenners?",
        text: "Jongverkenners leren sjorren, kaartlezen, koken op vuur en zelfstandig samenwerken tijdens grotere spelen en tochten.",
      },
      {
        title: "Voor ouders",
        text: "De leiding bouwt de activiteiten veilig op, met duidelijke begeleiding en ruimte voor meer zelfstandigheid.",
      },
      {
        title: "Groei in de groep",
        text: "Leden leren initiatief nemen, afspraken maken en elkaar ondersteunen. Dat maakt deze tak een sterke stap richting meer engagement.",
      },
    ],
    leaderNames: "Leiding wordt binnenkort aangevuld",
    leaderPhotoUrl: "",
    planningInfo: defaultPlanningInfo,
    program: stringifyProgramItems([]),
  },
  {
    name: "Verkenners",
    slug: "verkenners",
    age: "13-16 jaar",
    icon: "route",
    logoKey: "branchVerkennersLogoUrl",
    contentKeys: {
      age: "branchVerkennersAge",
      shortDescription: "branchVerkennersShortDescription",
      intro: "branchVerkennersIntro",
      highlights: "branchVerkennersHighlights",
      program: "branchVerkennersProgram",
      imageUrl: "branchVerkennersImageUrl",
      leaderNames: "branchVerkennersLeaderNames",
      leaderPhotoUrl: "branchVerkennersLeaderPhotoUrl",
      planning: {
        day: "branchVerkennersPlanningDay",
        time: "branchVerkennersPlanningTime",
        timeNote: "branchVerkennersPlanningTimeNote",
        location: "branchVerkennersPlanningLocation",
        bring: "branchVerkennersPlanningBring",
        contact: "branchVerkennersPlanningContact",
        countText: "branchVerkennersPlanningCountText",
        emptyText: "branchVerkennersPlanningEmptyText",
      },
      blocks: [
        { title: "branchVerkennersBlockOneTitle", text: "branchVerkennersBlockOneText" },
        { title: "branchVerkennersBlockTwoTitle", text: "branchVerkennersBlockTwoText" },
        { title: "branchVerkennersBlockThreeTitle", text: "branchVerkennersBlockThreeText" },
      ],
    },
    accent: "from-[#103001] via-emerald-700 to-lime-400",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=82",
    shortDescription:
      "Verkenners gaan voor grotere uitdagingen, stevige activiteiten, tochten, engagement en zelfstandigheid binnen hun tak.",
    intro:
      "Verkenners zoeken avontuur met meer diepgang. Activiteiten worden groter, zelfstandiger en vragen meer inzet van de groep.",
    highlights: ["Stevige activiteiten", "Zelfstandigheid", "Engagement"],
    detailBlocks: [
      {
        title: "Wat doen verkenners?",
        text: "Verkenners gaan op tocht, bouwen constructies, spelen intensere spelen en nemen vaker zelf initiatief in hun takwerking.",
      },
      {
        title: "Voor ouders",
        text: "De leiding blijft nabij, maar geeft leden ook bewust ruimte om keuzes te maken, plannen uit te voeren en verantwoordelijkheid op te nemen.",
      },
      {
        title: "Groei in de groep",
        text: "Leden leren samenwerken onder druk, voor elkaar zorgen en hun plek vinden binnen een hechte groep.",
      },
    ],
    leaderNames: "Leiding wordt binnenkort aangevuld",
    leaderPhotoUrl: "",
    planningInfo: defaultPlanningInfo,
    program: stringifyProgramItems([]),
  },
  {
    name: "Jins",
    slug: "jins",
    age: "17-18 jaar",
    icon: "flag",
    logoKey: "branchJinsLogoUrl",
    contentKeys: {
      age: "branchJinsAge",
      shortDescription: "branchJinsShortDescription",
      intro: "branchJinsIntro",
      highlights: "branchJinsHighlights",
      program: "branchJinsProgram",
      imageUrl: "branchJinsImageUrl",
      leaderNames: "branchJinsLeaderNames",
      leaderPhotoUrl: "branchJinsLeaderPhotoUrl",
      planning: {
        day: "branchJinsPlanningDay",
        time: "branchJinsPlanningTime",
        timeNote: "branchJinsPlanningTimeNote",
        location: "branchJinsPlanningLocation",
        bring: "branchJinsPlanningBring",
        contact: "branchJinsPlanningContact",
        countText: "branchJinsPlanningCountText",
        emptyText: "branchJinsPlanningEmptyText",
      },
      blocks: [
        { title: "branchJinsBlockOneTitle", text: "branchJinsBlockOneText" },
        { title: "branchJinsBlockTwoTitle", text: "branchJinsBlockTwoText" },
        { title: "branchJinsBlockThreeTitle", text: "branchJinsBlockThreeText" },
      ],
    },
    accent: "from-[#103001] via-[#2f6b18] to-amber-400",
    imageUrl:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1400&q=82",
    shortDescription:
      "Jins staan op de grens tussen lid en leiding. Ze werken aan eigen projecten, nemen verantwoordelijkheid op en groeien richting engagement.",
    intro:
      "Jins krijgen ruimte om zelf richting te geven aan hun scoutsjaar. Ze werken aan projecten en groeien richting engagement binnen de groep.",
    highlights: ["Eigen projecten", "Verantwoordelijkheid", "Richting leiding"],
    detailBlocks: [
      {
        title: "Wat doen jins?",
        text: "Jins denken mee, organiseren mee en werken aan eigen plannen. Ze beleven scouts nog altijd als lid, maar met meer initiatief en verantwoordelijkheid.",
      },
      {
        title: "Voor ouders",
        text: "Deze leeftijdsgroep krijgt begeleiding die vertrouwen geeft en tegelijk helpt om engagement concreet en haalbaar te maken.",
      },
      {
        title: "Groei in de groep",
        text: "Jins leren plannen, communiceren, samenwerken en verantwoordelijkheid opnemen. Zo vormt deze tak een mooie brug naar leiding of ander engagement.",
      },
    ],
    leaderNames: "Leiding wordt binnenkort aangevuld",
    leaderPhotoUrl: "",
    planningInfo: defaultPlanningInfo,
    program: stringifyProgramItems([]),
  },
];

export function getBranchBySlug(slug: string) {
  return branchProfiles.find((branch) => branch.slug === slug);
}

function splitHighlights(value: string, fallback: string[]) {
  const highlights = value
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);

  return highlights.length > 0 ? highlights : fallback;
}

export function getEditableBranchProfile(
  branch: BranchProfile,
  content: EditableSiteContent
): BranchProfile {
  return {
    ...branch,
    age: content[branch.contentKeys.age] || branch.age,
    shortDescription:
      content[branch.contentKeys.shortDescription] || branch.shortDescription,
    intro: content[branch.contentKeys.intro] || branch.intro,
    imageUrl: content[branch.contentKeys.imageUrl] || branch.imageUrl,
    highlights: splitHighlights(
      content[branch.contentKeys.highlights] || "",
      branch.highlights
    ),
    detailBlocks: branch.contentKeys.blocks.map((block, index) => ({
      title: content[block.title] || branch.detailBlocks[index]?.title || "",
      text: content[block.text] || branch.detailBlocks[index]?.text || "",
    })),
    program: content[branch.contentKeys.program] || branch.program,
    leaderNames: content[branch.contentKeys.leaderNames] || branch.leaderNames,
    leaderPhotoUrl:
      content[branch.contentKeys.leaderPhotoUrl] || branch.leaderPhotoUrl,
    planningInfo: {
      day: content[branch.contentKeys.planning.day] || branch.planningInfo.day,
      time: content[branch.contentKeys.planning.time] || branch.planningInfo.time,
      timeNote:
        content[branch.contentKeys.planning.timeNote] ||
        branch.planningInfo.timeNote,
      location:
        content[branch.contentKeys.planning.location] ||
        branch.planningInfo.location,
      bring:
        content[branch.contentKeys.planning.bring] || branch.planningInfo.bring,
      contact:
        content[branch.contentKeys.planning.contact] ||
        branch.planningInfo.contact,
      countText:
        content[branch.contentKeys.planning.countText] ||
        branch.planningInfo.countText,
      emptyText:
        content[branch.contentKeys.planning.emptyText] ||
        branch.planningInfo.emptyText,
    },
  };
}
