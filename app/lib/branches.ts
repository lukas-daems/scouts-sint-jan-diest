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
      bringNote: keyof EditableSiteContent;
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
    bringNote: string;
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
  bringNote:
    "Als er andere kledij of extra materiaal nodig is, staat dat bij de vergadering in het programma.",
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
        bringNote: "branchKapoenenPlanningBringNote",
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
      "Fantasie",
      "Spel",
      "Eerste scoutsavonturen",
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
        bringNote: "branchWelpenPlanningBringNote",
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
      "Welpen ontdekken samen de wereld, trekken eropuit en beleven elke week nieuwe avonturen in een warme groep.",
    intro:
      "Welpen (8-11 jaar) zitten vol energie en nieuwsgierigheid. In een veilige en speelse omgeving ontdekken ze samen de wereld, trekken ze eropuit en beleven ze elke week nieuwe avonturen.",
    highlights: ["Energie", "Samen spelen", "Ontdekken", "Vriendschap"],
    detailBlocks: [
      {
        title: "Wat doen welpen?",
        text: "Welpen spelen actieve groepsspelen, trekken de natuur in en krijgen opdrachten die passen bij hun leefwereld. Elke zaterdag draait rond bewegen, proberen, lachen en samen iets beleven.",
      },
      {
        title: "Samen groeien",
        text: "De leiding daagt hen uit, begeleidt hen in samenwerken en helpt hen stap voor stap zelfstandiger worden. Zo ontstaan vriendschappen en kan elk kind op eigen tempo groeien.",
      },
      {
        title: "Kom eens proberen",
        text: "Nieuwe welpen zijn welkom om vrijblijvend eens mee te doen op zaterdag van 14u tot 17u. De leiding zorgt voor een warme ontvangst in de groep.",
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
        bringNote: "branchJongverkennersPlanningBringNote",
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
      "Jongverkenners houden van actie, uitdaging en avontuur. Ze leren scouting kennen door zelf te doen.",
    intro:
      "Jongverkenners (11-13 jaar) houden van actie, uitdaging en avontuur. Ze leren scouting echt kennen door zelf dingen te doen: sjorren, kampen bouwen, op tocht gaan en stevige bosspelen spelen.",
    highlights: [
      "Actie",
      "Patrouilles",
      "Technieken",
      "Sjorren",
      "Tochten",
      "Verantwoordelijkheid",
    ],
    detailBlocks: [
      {
        title: "Wat doen jongverkenners?",
        text: "Ze leren sjorren, slapen in patrouilletenten, kampen bouwen, kaartlezen en op pad gaan met rugzak. De activiteiten zijn steviger, maar blijven haalbaar en begeleid.",
      },
      {
        title: "Samen in patrouille",
        text: "Jongverkenners leren samenwerken in patrouille, plannen maken, verantwoordelijkheid opnemen en er zijn voor elkaar. Zo groeit de groep in vertrouwen en zelfstandigheid.",
      },
      {
        title: "Kom eens proberen",
        text: "Zin in meer uitdaging? Nieuwe jongverkenners mogen vrijblijvend aansluiten op zaterdag van 14u tot 17u en ontdekken hoe deze tak werkt.",
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
        bringNote: "branchVerkennersPlanningBringNote",
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
      "Verkenners beleven avontuur met meer vrijheid en verantwoordelijkheid, in een hechte groep waar vriendschap centraal staat.",
    intro:
      "Verkenners (13-16 jaar) beleven avontuur met meer vrijheid en verantwoordelijkheid. Scouting draait bij hen om meer dan spel alleen: ze trekken eropuit, bouwen hun eigen kamp en krijgen ruimte om mee te beslissen.",
    highlights: [
      "Vrijheid",
      "Uitdaging",
      "Grote tochten",
      "Eigen projecten",
      "Hechte groep",
    ],
    detailBlocks: [
      {
        title: "Wat doen verkenners?",
        text: "Denk aan grotere tochten, uitdagende spelen, vlottentocht, driedaagse, kookvergaderingen en projecten die ze samen vormgeven.",
      },
      {
        title: "Vrijheid met begeleiding",
        text: "De leiding zorgt voor een veilige omgeving en een hechte groep, maar geeft verkenners ook bewust ruimte om keuzes te maken en verantwoordelijkheid op te nemen.",
      },
      {
        title: "Kom eens proberen",
        text: "Nieuwe verkenners zijn welkom om op zaterdag eens mee te draaien. Zo voelen ze meteen of de groep en het avontuur bij hen passen.",
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
        bringNote: "branchJinsPlanningBringNote",
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
    highlights: [
      "Engagement",
      "Eigen projecten",
      "Verantwoordelijkheid",
      "Richting leiding",
    ],
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
        text: "Jins leren plannen, communiceren, samenwerken en verantwoordelijkheid opnemen. Nieuwe jins mogen gerust eens langskomen en ontdekken hoe deze brug naar leiding of ander engagement voelt.",
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
      bringNote:
        content[branch.contentKeys.planning.bringNote] ||
        branch.planningInfo.bringNote,
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
