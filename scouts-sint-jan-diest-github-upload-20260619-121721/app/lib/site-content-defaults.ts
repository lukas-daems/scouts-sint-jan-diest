import { stringifyProgramItems } from "./program";

const pageContentDefaults = {
  pageActivitiesEyebrow: "Activiteiten en werking",
  pageActivitiesTitle: "Alles wat er leeft bij Scouts Sint-Jan Diest",
  pageActivitiesImageUrl: "",
  pageActivitiesSidebarTitle: "Voor leden, ouders en sympathisanten",
  pageActivitiesSidebarText:
    "Deze pagina bundelt de wekelijkse werking, kampen, evenementen en steunacties. Zo zie je snel wat voor leden bedoeld is, wat een publiek evenement is en hoe je de scouts kan steunen.",
  pageActivitiesCards:
    "Wekelijkse werking|Elke zaterdag van 14u tot 17u beleven de takken activiteiten op maat van hun leeftijd.\nZomerkamp|Het hoogtepunt van het scoutsjaar, met meerdere dagen samenleven, spelen en groeien als tak.\nDropping|Een avontuurlijk evenement waarbij deelnemers samen op pad gaan en de werking steunen.\nSteak- en Burgerday|Een gezellig eetmoment voor leden, ouders, oud-leiding en sympathisanten.\nOntbijtmanden|Een verkoopactie waarmee mensen de scouts steunen door ontbijtmanden te bestellen.\nGroepsactiviteiten|Momenten waarop heel Scouts Sint-Jan Diest samenkomt.",
  pageActivitiesFacts:
    "Wekelijks|Zaterdag 14u-17u|Gewone takwerking\nVoor wie?|Leden en nieuwe leden|Proberen kan na contact\nSteunacties|Doorheen het jaar|Voor ouders en sympathisanten",
  pageActivitiesHighlightLabel: "Overzicht",
  pageActivitiesHighlightTitle: "Activiteiten, evenementen en steunacties",
  pageActivitiesHighlightText:
    "Wekelijkse scoutsactiviteiten draaien rond de ledenwerking. Dropping en Steak- en Burgerday zijn evenementen. Ontbijtmanden is vooral een verkoopactie om de groep te steunen.",
  pageActivitiesPrimaryCtaLabel: "Kom eens proberen",
  pageActivitiesPrimaryCtaHref: "/#contact",
  pageActivitiesSecondaryCtaLabel: "Bekijk takken",
  pageActivitiesSecondaryCtaHref: "/takken",

  pageZomerkampEyebrow: "Kampinformatie",
  pageZomerkampTitle: "Zomerkamp met Scouts Sint-Jan Diest",
  pageZomerkampImageUrl: "",
  pageZomerkampSidebarTitle: "Alles voor ouders op één plek",
  pageZomerkampSidebarText:
    "Hier komt de praktische kampinfo samen: data, locatie, prijs, documenten, updates en contactpersoon. Definitieve info kan per tak verschillen en wordt tijdig aangevuld.",
  pageZomerkampCards:
    "Data|De kampdata worden tijdig per tak gedeeld.\nLocatie|De kampplaats wordt gedeeld zodra alles bevestigd is.\nPrijs|Prijs en betaalinfo worden duidelijk gecommuniceerd.\nContactpersoon|De verantwoordelijke leiding of groepsleiding wordt hier vermeld.",
  pageZomerkampFacts:
    "Bagagelijst|Wordt tijdig gedeeld|Controleer dit voor vertrek\nMedische fiche|Verplicht voor kamp|Link of document volgt\nKampboekje|Alle praktische info|Download zodra beschikbaar",
  pageZomerkampDocuments:
    "Medische fiche|/#contact|Document of link toevoegen\nKampboekje|/#contact|PDF of infolink toevoegen\nBagagelijst|/#contact|Per tak aanvullen",
  pageZomerkampUpdates:
    "Praktische updates worden hier toegevoegd zodra data, locatie en documenten definitief zijn.",
  pageZomerkampPrimaryCtaLabel: "Vraag kampinfo aan",
  pageZomerkampPrimaryCtaHref: "/#contact",
  pageZomerkampSecondaryCtaLabel: "Terug naar kampsectie",
  pageZomerkampSecondaryCtaHref: "/#kamp",

  pageDroppingEyebrow: "Avontuurlijk evenement",
  pageDroppingTitle: "Dropping",
  pageDroppingImageUrl: "",
  pageDroppingSidebarTitle: "Samen op pad, samen steunen",
  pageDroppingSidebarText:
    "Dropping is een echt evenement: deelnemers komen fysiek samen, gaan in groep op pad en steunen tegelijk de werking van de scouts.",
  pageDroppingCards:
    "Datum|De datum van de volgende dropping wordt tijdig gedeeld.\nStartuur|Het startuur wordt bij inschrijving meegedeeld.\nStartlocatie|De startlocatie wordt duidelijk gecommuniceerd.\nEinduur|Het verwachte einduur volgt bij de praktische info.\nPrijs|De deelnameprijs wordt bij de inschrijving vermeld.\nMeenemen|Stevige schoenen, fluohesje en zin voor avontuur.",
  pageDroppingFacts:
    "Voor wie?|Ouders, oud-leiding en sympathisanten|Concrete leeftijdsinfo kan worden aangevuld\nInschrijven|Via interesseformulier|Echte verzending later koppelen\nVeiligheid|Duidelijke afspraken|Praktische afspraken worden bij deelname gedeeld",
  pageDroppingFormTitle: "Interesse in Dropping",
  pageDroppingFormIntro:
    "Laat je gegevens achter. Dit formulier is voorlopig een demo en kan later aan echte inschrijving gekoppeld worden.",
  pageDroppingFormFields:
    "Naam|text|\nE-mail|email|\nAantal deelnemers|number|\nVragen of opmerkingen|textarea|",
  pageDroppingFormSubmit: "Interesse doorgeven",
  pageDroppingFormSuccess:
    "Bedankt! Dit demoformulier is nog niet gekoppeld aan echte verzending.",
  pageDroppingPrimaryCtaLabel: "Ik heb interesse",
  pageDroppingPrimaryCtaHref: "#formulier",

  pageOntbijtmandenEyebrow: "Verkoopactie",
  pageOntbijtmandenTitle: "Ontbijtmanden bestellen",
  pageOntbijtmandenImageUrl: "",
  pageOntbijtmandenSidebarTitle: "Steun de scouts van thuis uit",
  pageOntbijtmandenSidebarText:
    "Ontbijtmanden is een verkoopactie. Mensen bestellen een mand en steunen zo de werking zonder naar een fysiek evenement te komen.",
  pageOntbijtmandenCards:
    "Aantal manden|Kies hoeveel ontbijtmanden je wil bestellen.\nAfhalen of leveren|Afhaallocatie, leverzone en timing worden bij de actie gedeeld.\nBetaling|Prijs en betaalinstructies worden duidelijk vermeld.",
  pageOntbijtmandenFacts:
    "Bestelperiode|Wordt tijdig aangekondigd|Wanneer bestellen kan\nPrijs|Prijs per mand wordt gedeeld|Duidelijke betaalinfo volgt\nLevering|Afhalen of leveren|Volgens gekozen optie",
  pageOntbijtmandenFormTitle: "Bestel ontbijtmanden",
  pageOntbijtmandenFormIntro:
    "Gebruik dit demoformulier als voorbeeld voor de latere bestelstroom.",
  pageOntbijtmandenFormFields:
    "Naam|text|\nAdres|text|\nTelefoon|tel|\nAantal manden|number|\nAfhalen of leveren|select|Afhalen,Leveren\nOpmerkingen|textarea|",
  pageOntbijtmandenFormSubmit: "Bestelling doorgeven",
  pageOntbijtmandenFormSuccess:
    "Bedankt! Dit demoformulier is nog niet gekoppeld aan echte bestelling.",
  pageOntbijtmandenPrimaryCtaLabel: "Bestelmand invullen",
  pageOntbijtmandenPrimaryCtaHref: "#formulier",

  pageSteakBurgerdayEyebrow: "Eetmoment en steunactie",
  pageSteakBurgerdayTitle: "Steak- en Burgerday",
  pageSteakBurgerdayImageUrl: "",
  pageSteakBurgerdaySidebarTitle: "Gezellig eten voor de groepswerking",
  pageSteakBurgerdaySidebarText:
    "Steak- en Burgerday is een fysiek eetmoment voor leden, ouders, oud-leiding en sympathisanten. Het is gezellig én ondersteunt de scouts.",
  pageSteakBurgerdayCards:
    "Datum|Datum en uren worden tijdig aangekondigd.\nLocatie|De locatie wordt bij de reservatie gedeeld.\nMenu|Steak, burger of vegetarische optie.\nReservatie|Reserveer vooraf zodat we goed kunnen plannen.",
  pageSteakBurgerdayFacts:
    "Voor wie?|Iedereen welkom|Leden, ouders en sympathisanten\nPrijs|Prijzen per menu-optie worden gedeeld|Per menu-optie\nReservatie|Demoformulier|Echte verzending later koppelen",
  pageSteakBurgerdayMenuOptions: "Steak,Burger,Vegetarisch,Kinderportie",
  pageSteakBurgerdayFormTitle: "Reserveer je plaats",
  pageSteakBurgerdayFormIntro:
    "Geef je naam, aantal personen en menukeuze door. Dit is voorlopig een demoformulier.",
  pageSteakBurgerdayFormFields:
    "Naam|text|\nE-mail|email|\nAantal personen|number|\nMenu-keuze|select|Steak,Burger,Vegetarisch,Kinderportie\nOpmerkingen|textarea|",
  pageSteakBurgerdayFormSubmit: "Reservatie doorgeven",
  pageSteakBurgerdayFormSuccess:
    "Bedankt! Dit demoformulier is nog niet gekoppeld aan echte reservatie.",
  pageSteakBurgerdayPrimaryCtaLabel: "Reserveer",
  pageSteakBurgerdayPrimaryCtaHref: "#formulier",

  pageShopEyebrow: "Materiaal en kledij",
  pageShopTitle: "Shop en scoutsbenodigdheden",
  pageShopImageUrl: "",
  pageShopSidebarTitle: "Vraag groepsmateriaal eenvoudig aan",
  pageShopSidebarText:
    "Deze shop is bedoeld voor groepskledij, badges of nuttig materiaal. De echte voorraad en betaling kunnen later gekoppeld worden.",
  pageShopCards:
    "Uniform|Nieuwe leden krijgen uitleg over hemd, das en afspraken.\nGroepsmateriaal|Hier kan info komen over eigen groepskledij of materiaalacties.\nAanvragen|Gebruik het formulier om iets na te vragen.",
  pageShopProducts:
    "Scoutsdas|€12|Eenheidsmaat|Aanvragen\nGroeps-T-shirt|€18|S,M,L,XL|Aanvragen\nBadge Scouts Sint-Jan|€3|Eenheidsmaat|Aanvragen",
  pageShopFormTitle: "Product aanvragen",
  pageShopFormIntro:
    "Laat weten welk product en welke maat je zoekt. Dit is voorlopig een demoformulier.",
  pageShopFormFields:
    "Naam|text|\nE-mail|email|\nProduct|select|Scoutsdas,Groeps-T-shirt,Badge Scouts Sint-Jan\nMaat|text|\nOpmerkingen|textarea|",
  pageShopFormSubmit: "Aanvraag doorgeven",
  pageShopFormSuccess:
    "Bedankt! Dit demoformulier is nog niet gekoppeld aan echte verwerking.",
  pageShopPrimaryCtaLabel: "Product aanvragen",
  pageShopPrimaryCtaHref: "#formulier",

  pageOudercomiteEyebrow: "Ouders rond de groep",
  pageOudercomiteTitle: "Oudercomite",
  pageOudercomiteImageUrl: "",
  pageOudercomiteSidebarTitle: "Extra handen maken veel mogelijk",
  pageOudercomiteSidebarText:
    "Het oudercomite ondersteunt waar nodig en vormt een brug tussen ouders en leiding. Ouders kunnen helpen op kleine of grotere momenten.",
  pageOudercomiteCards:
    "Helpen bij acties|Ondersteuning bij eetdagen, verkoopacties of praktische taken.\nBrug tussen ouders en leiding|Vragen of signalen helder mee opvolgen.\nLogistieke steun|Extra handen bij materiaal, vervoer of voorbereiding.",
  pageOudercomiteFacts:
    "Tijdsinvestering|Klein of groter engagement|Iedere hulp telt\nVoor wie?|Ouders en sympathisanten|Na contact\nContact|Via formulier|Echte verzending later koppelen",
  pageOudercomiteFormTitle: "Ik wil helpen",
  pageOudercomiteFormIntro:
    "Laat weten waarbij je eventueel wil helpen. Dit is voorlopig een demoformulier.",
  pageOudercomiteFormFields:
    "Naam|text|\nE-mail|email|\nTelefoon|tel|\nWaarbij wil je helpen?|textarea|",
  pageOudercomiteFormSubmit: "Hulp aanbieden",
  pageOudercomiteFormSuccess:
    "Bedankt! Dit demoformulier is nog niet gekoppeld aan echte verzending.",
  pageOudercomitePrimaryCtaLabel: "Ik wil helpen",
  pageOudercomitePrimaryCtaHref: "#formulier",

  pageVerhuurEyebrow: "Praktische aanvraag",
  pageVerhuurTitle: "Verhuur",
  pageVerhuurImageUrl: "",
  pageVerhuurSidebarTitle: "Vraag beschikbaarheid duidelijk aan",
  pageVerhuurSidebarText:
    "Als er materiaal of lokalen verhuurd worden, kan deze pagina voorwaarden, beschikbaarheid en aanvraaginfo bundelen.",
  pageVerhuurCards:
    "Beschikbaarheid|Vraag eerst na of de datum mogelijk is.\nMateriaal of lokaal|Omschrijf duidelijk wat je nodig hebt.\nVoorwaarden|Afspraken, waarborg en prijzen kunnen hier worden aangevuld.",
  pageVerhuurFacts:
    "Aanvraag|Via formulier|Echte verzending later koppelen\nPlanning|Datum nodig|Controle door groepsleiding\nContact|Duidelijke gegevens|Zodat we snel kunnen antwoorden",
  pageVerhuurFormTitle: "Verhuuraanvraag",
  pageVerhuurFormIntro:
    "Vul datum, organisatie en gewenste materialen in. Dit is voorlopig een demoformulier.",
  pageVerhuurFormFields:
    "Datum|date|\nOrganisatie|text|\nMateriaal of lokaal|textarea|\nAantal personen|number|\nNaam contactpersoon|text|\nE-mail|email|\nTelefoon|tel|",
  pageVerhuurFormSubmit: "Aanvraag versturen",
  pageVerhuurFormSuccess:
    "Bedankt! Dit demoformulier is nog niet gekoppeld aan echte verzending.",
  pageVerhuurPrimaryCtaLabel: "Verhuur aanvragen",
  pageVerhuurPrimaryCtaHref: "#formulier",

  pageLinksEyebrow: "Nuttige links",
  pageLinksTitle: "Links en nuttige informatie",
  pageLinksImageUrl: "",
  pageLinksSidebarTitle: "Alles snel terugvinden",
  pageLinksSidebarText:
    "Deze pagina verzamelt nuttige verwijzingen voor ouders, leden, documenten en externe scoutsinformatie.",
  pageLinksCards:
    "Voor ouders|Belangrijke formulieren en informatie.\nVoor leden|Links naar werking, kamp of praktische documenten.\nExterne info|Nuttige pagina's van Scouts en Gidsen Vlaanderen.",
  pageLinksItems:
    "Scouts algemeen|Scouts en Gidsen Vlaanderen|https://www.scoutsengidsenvlaanderen.be|Algemene info over scouts.\nFormulieren|Medische fiche|/#contact|Vervang later door het juiste document.\nSociale media|Instagram|/#contact|Officieel profiel toevoegen.",
  pageLinksPrimaryCtaLabel: "Vraag een link",
  pageLinksPrimaryCtaHref: "/#contact",

  pageOudLeidingEyebrow: "Blijvende band",
  pageOudLeidingImageUrl: "",
  pageOudLeidingSidebarTitle: "Ruimte voor geschiedenis en contact",
  pageOudLeidingSidebarText:
    "Deze pagina blijft bewust rustig. Later kan hier informatie komen over oud-leiding, foto’s, contactmomenten of ondersteuning.",
  pageOudLeidingCards:
    "Info|Plaats hier later praktische info over oud-leiding.\nFoto's|Voeg later sfeerbeelden of archieffoto's toe.\nContact|Voeg later een contactpersoon of mailadres toe.",
  pageOudLeidingPrimaryCtaLabel: "Neem contact op",
  pageOudLeidingPrimaryCtaHref: "/#contact",
  pageSharedCtaEyebrow: "Nog vragen?",
  pageSharedCtaTitle: "We helpen je graag verder.",
  pageSharedCtaButton: "Contact opnemen",
} satisfies Record<string, string>;

export type EditableSiteContent = {
  siteName: string;
  sitePrimaryColor: string;
  siteLogoUrl: string;
  heroEyebrow: string;
  heroTitleLineOne: string;
  heroTitleLineTwo: string;
  heroSubtitle: string;
  practicalActivityMoment: string;
  practicalAddress: string;
  registrationLink: string;
  campSubtitle: string;
  campWhat: string;
  campForParents: string;
  campForNewMembers: string;
  contactLocation: string;
  contactEmail: string;
  contactPhone: string;
  instagram: string;
  facebook: string;
  footerNotice: string;
  heroImageUrl: string;
  campImageUrl: string;
  galleryBosspelImageUrl: string;
  galleryKampImageUrl: string;
  galleryWeekendImageUrl: string;
  galleryGroepsactiviteitImageUrl: string;
  galleryTechniekenImageUrl: string;
  galleryKampvuurImageUrl: string;
  galleryBosspelImages: string;
  galleryKampImages: string;
  galleryWeekendImages: string;
  galleryGroepsactiviteitImages: string;
  galleryKampvuurImages: string;
  pageActivitiesIntro: string;
  pageDroppingIntro: string;
  pageOntbijtmandenIntro: string;
  pageSteakBurgerdayIntro: string;
  pageZomerkampIntro: string;
  pageShopIntro: string;
  pageOudercomiteIntro: string;
  pageVerhuurIntro: string;
  pageLinksIntro: string;
  pageOudLeidingTitle: string;
  pageOudLeidingIntro: string;
  pageOudLeidingBody: string;
  branchKapoenenLogoUrl: string;
  branchWelpenLogoUrl: string;
  branchJongverkennersLogoUrl: string;
  branchVerkennersLogoUrl: string;
  branchJinsLogoUrl: string;
  branchKapoenenProgram: string;
  branchWelpenProgram: string;
  branchJongverkennersProgram: string;
  branchVerkennersProgram: string;
  branchJinsProgram: string;
} & Record<string, string>;

export const defaultSiteContent: EditableSiteContent = {
  siteName: "Scouts Sint-Jan Diest",
  sitePrimaryColor: "#103001",
  siteLogoUrl: "",
  heroEyebrow: "OFFICIËLE SCOUTSGROEP UIT DIEST",
  heroTitleLineOne: "Avontuur begint bij",
  heroTitleLineTwo: "Scouts Sint-Jan Diest",
  heroSubtitle:
    "Elke week beleven kinderen en jongeren uit Diest avontuur, vriendschap en groei in de natuur. Een warme scoutsgroep waar spelen, ontdekken en samenwerken centraal staan.",
  heroOrgLabel: "Scouts en Gidsen Vlaanderen",
  heroPrimaryCtaLabel: "Word lid",
  heroSecondaryCtaLabel: "Ontdek onze takken",
  heroStatOneTitle: "Elke zaterdag",
  heroStatOneLabel: "14u-17u activiteit",
  heroStatTwoTitle: "5 takken",
  heroStatTwoLabel: "voor 6-18 jaar",
  heroStatThreeTitle: "Diest",
  heroStatThreeLabel: "lokaal en vertrouwd",
  heroStatFourTitle: "Kennismaken",
  heroStatFourLabel: "eerst proberen mag",
  aboutTitle: "Een plek om te groeien, spelen en ontdekken",
  aboutSubtitle:
    "Scouts Sint-Jan Diest is een jeugdbeweging waar kinderen en jongeren samen op avontuur gaan. We trekken naar buiten, spelen grote groepsspelen, leren verantwoordelijkheid opnemen en bouwen aan vriendschappen die blijven.",
  aboutCardOneTitle: "Avontuur in de natuur",
  aboutCardOneText:
    "Van bosspelen tot tochten en kampen: bij ons beleven leden elke week iets nieuws buiten de schoolmuren.",
  aboutCardTwoTitle: "Samen groeien",
  aboutCardTwoText:
    "Leden leren samenwerken, initiatief nemen en zichzelf beter kennen in een veilige en warme groep.",
  aboutCardThreeTitle: "Voor elke leeftijd",
  aboutCardThreeText:
    "Onze takken bieden activiteiten op maat van elke leeftijdsgroep, van jonge kapoenen tot geengageerde jins.",
  branchesHomeTitle: "Onze takken",
  branchesHomeSubtitle:
    "Elke leeftijdsgroep heeft een eigen tak, met activiteiten die passen bij hun leefwereld, energie en zelfstandigheid.",
  branchesHomeCtaLabel: "Bekijk alle takken uitgebreid",
  activitiesTitle: "Elke week iets om naar uit te kijken",
  activitiesSubtitle:
    "Onze activiteiten combineren spel, natuur, creativiteit, samenwerking en avontuur.",
  activitiesFeaturedBadge: "Hoogtepunt van het jaar",
  activitiesFeaturedTitle: "Zomerkamp",
  activitiesFeaturedText:
    "Het moment waarop takken samenleven, spelen, koken, ontdekken en vriendschappen verdiepen. Een week die leden vaak jaren later nog onthouden.",
  activitiesFeaturedMiniTitle: "Kampgevoel",
  activitiesFeaturedMiniText:
    "Tenten, takmomenten, grote spelen en samen groeien als groep.",
  activitiesFeaturedCtaLabel: "Bekijk kampinfo",
  activitiesMoreTitle: "Meer activiteiten ontdekken",
  activitiesMoreText:
    "Bekijk ook onze aparte activiteitenpagina voor wekelijkse werking, Dropping, steunacties en extra uitleg voor ouders.",
  activitiesMoreCtaLabel: "Naar activiteiten",
  whyJoinBadge: "Waarom scouts?",
  whyJoinTitle: "Waarom ouders kiezen voor Scouts Sint-Jan Diest",
  whyJoinText:
    "Bij Scouts Sint-Jan Diest vinden kinderen en jongeren een plek waar ze zichzelf kunnen zijn, nieuwe vrienden maken en stap voor stap zelfstandiger worden. Onze leiding zorgt voor uitdagende, veilige en leeftijdsgerichte activiteiten.",
  whyJoinBullets:
    "Activiteiten aangepast aan elke leeftijd\nEen warme groep met aandacht voor elk lid\nBuiten spelen, bewegen en ontdekken\nErvaren leiding met engagement\nSterke traditie in Diest\nRuimte om verantwoordelijkheid te leren opnemen",
  practicalTitle: "Praktische informatie",
  practicalSubtitle: "Alles wat je als ouder snel wil weten over onze werking.",
  practicalActivityMoment: "Elke zaterdag van 14u tot 17u.",
  practicalCardOneTitle: "Elke zaterdag",
  practicalCardOneText: "14u-17u",
  practicalCardOneNote: "Elke zaterdag van 14u tot 17u.",
  practicalCardTwoTitle: "5 takken",
  practicalCardTwoText: "Voor kinderen en jongeren van 6 tot 18 jaar",
  practicalCardTwoNote: "Kapoenen tot jins",
  practicalCardThreeTitle: "Diest",
  practicalCardThreeText: "Lokaal verbonden en makkelijk bereikbaar",
  practicalCardThreeNote: "Diest, Belgie",
  practicalCardFourTitle: "Zomerkamp",
  practicalCardFourText: "Het hoogtepunt van het scoutsjaar",
  practicalCardFourNote: "Kampinfo via de leiding",
  practicalAddress: "Diest, Belgie",
  registrationLink: "#contact",
  campBadge: "Kampinformatie",
  campTitle: "Op kamp met Scouts Sint-Jan Diest",
  campSubtitle:
    "Het zomerkamp is voor veel leden het hoogtepunt van het jaar: samenleven, spelen, koken, ontdekken en groeien als groep.",
  campWhat:
    "Tijdens het kamp trekken leden er meerdere dagen op uit met hun tak. Ze slapen samen, spelen grote spelen, leren praktische vaardigheden en beleven echte scoutssfeer.",
  campForParents:
    "Voor elk kamp communiceren we op tijd de praktische info: locatie, data, bagagelijst, prijs, medische fiche en contactgegevens.",
  campForNewMembers:
    "Ook wie nieuw is, wordt stap voor stap meegenomen in het kampverhaal. De leiding zorgt voor begeleiding en duidelijke communicatie.",
  galleryTitle: "Sfeerbeelden uit onze werking",
  gallerySubtitle:
    "Een blik op activiteiten, kampen, weekends en momenten die onze scouts maken tot wat ze is.",
  joinTitle: "Hoe word je lid?",
  joinSubtitle:
    "Inschrijven begint met kennismaken. Zo zorgen we dat elk nieuw lid goed terechtkomt.",
  joinCtaLabel: "Ik wil mijn kind inschrijven",
  faqBadge: "FAQ",
  faqTitle: "Vragen van ouders",
  faqSubtitle:
    "Nieuwe leden en ouders zitten vaak met praktische vragen. Hieronder vind je antwoorden op de belangrijkste vragen over onze werking.",
  faqCtaLabel: "Stel je vraag",
  contactBadge: "Contact en inschrijving",
  contactTitle: "Klaar om kennis te maken?",
  contactSubtitle:
    "Heb je vragen, wil je je kind inschrijven of graag eens langskomen? Neem contact op met de leiding van Scouts Sint-Jan Diest.",
  contactFormButton: "Verstuur aanvraag",
  contactMailCta: "Stuur ons een mail",
  contactTrustText:
    "Nieuwe leden zijn welkom om eerst vrijblijvend kennis te maken.",
  contactLocation: "Diest, Belgie",
  contactEmail: "info@scoutssintjandiest.be",
  contactPhone: "+32 000 00 00 00",
  instagram: "@scoutssintjandiest",
  facebook: "Scouts Sint-Jan Diest",
  instagramUrl: "/#contact",
  facebookUrl: "/#contact",
  footerDescription:
    "Een scoutsgroep uit Diest waar kinderen en jongeren groeien door avontuur, vriendschap en engagement.",
  footerCopyright:
    "© 2026 Scouts Sint-Jan Diest. Alle rechten voorbehouden.",
  footerNotice:
    "Website in ontwikkeling - vervang placeholders door officiele gegevens.",
  heroImageUrl: "",
  campImageUrl: "",
  galleryBosspelImageUrl: "",
  galleryKampImageUrl: "",
  galleryWeekendImageUrl: "",
  galleryGroepsactiviteitImageUrl: "",
  galleryTechniekenImageUrl: "",
  galleryKampvuurImageUrl: "",
  galleryBosspelImages: "",
  galleryKampImages: "",
  galleryWeekendImages: "",
  galleryGroepsactiviteitImages: "",
  galleryKampvuurImages: "",
  pageActivitiesIntro:
    "Elke zaterdag van 14u tot 17u maken we ruimte voor spel, natuur, creativiteit en groepsgevoel. Daarnaast organiseren we doorheen het jaar speciale evenementen en steunacties.",
  pageDroppingIntro:
    "Dropping is een echte scoutsactiviteit en steunend evenement: deelnemers gaan in groep op pad, beleven een avond vol avontuur en steunen tegelijk de werking.",
  pageOntbijtmandenIntro:
    "Ontbijtmanden is vooral een verkoopactie: mensen bestellen een ontbijtmand en steunen zo de scouts zonder fysiek naar een evenement te komen.",
  pageSteakBurgerdayIntro:
    "Steak- en Burgerday is een gezellig eetmoment voor leden, ouders, oud-leiding en sympathisanten. Het is tegelijk een ontmoetingsmoment en steunactie voor de groep.",
  pageZomerkampIntro:
    "Het zomerkamp is voor veel leden het mooiste moment van het jaar. We leven samen, spelen grote spelen, koken, ontdekken en groeien als tak.",
  pageShopIntro:
    "Op deze pagina kan later informatie komen over groepskledij, badges, nuttig kampmateriaal of links naar officiele scoutswinkels.",
  pageOudercomiteIntro:
    "Het oudercomite ondersteunt de groep waar nodig en vormt een brug tussen ouders en leiding. Deze pagina kan later worden aangevuld met namen, werking en contact.",
  pageVerhuurIntro:
    "Heeft Scouts Sint-Jan Diest materiaal of lokalen die verhuurd worden? Dan kan deze pagina later alle voorwaarden, beschikbaarheid en contactinformatie bundelen.",
  pageLinksIntro:
    "Een overzichtspagina voor nuttige verwijzingen, formulieren, scoutsinformatie en externe pagina's die ouders of leden vaak nodig hebben.",
  pageOudLeidingTitle: "Oud-leiding van Scouts Sint-Jan Diest",
  pageOudLeidingIntro:
    "Oud-leiding blijft een belangrijk deel van de geschiedenis, sfeer en traditie van Scouts Sint-Jan Diest.",
  pageOudLeidingBody:
    "Hier kan later alle informatie over oud-leiding komen. Denk aan contactmomenten, tradities, ondersteuning van activiteiten, herinneringen, foto's of een vaste contactpersoon. Deze pagina is voorlopig bewust rustig gehouden zodat de echte inhoud later mooi kan landen.",
  ...pageContentDefaults,
  branchKapoenenLogoUrl: "",
  branchWelpenLogoUrl: "",
  branchJongverkennersLogoUrl: "",
  branchVerkennersLogoUrl: "",
  branchJinsLogoUrl: "",
  branchesPageTitle: "Kies de tak die past bij je leeftijd",
  branchesPageSubtitle:
    "Elke leeftijdsgroep heeft een eigen werking, eigen leiding en activiteiten die passen bij hun energie, zelfstandigheid en leefwereld.",
  branchKapoenenAge: "6-8 jaar",
  branchKapoenenShortDescription:
    "Kapoenen leven in een wereld vol fantasie en avontuur. Ze ontdekken scouts door te ravotten, te lachen en samen te spelen.",
  branchKapoenenIntro:
    "Kapoenen (6-8 jaar) leven in een wereld vol fantasie en avontuur. In een veilige en speelse omgeving ontdekken ze bij ons de wereld door te ravotten, te lachen en samen te spelen.",
  branchKapoenenHighlights:
    "Fantasie en avontuur\nRavotten en lachen\nElke zaterdag klaar\nVeilig groeien",
  branchKapoenenImageUrl: "",
  branchKapoenenBlockOneTitle: "Wat doen kapoenen?",
  branchKapoenenBlockOneText:
    "Kapoenen bruisen van energie en creativiteit. De leiding sluit aan bij wat hen boeit en prikkelt, en helpt die energie helemaal tot leven te brengen.",
  branchKapoenenBlockTwoTitle: "Warme begeleiding",
  branchKapoenenBlockTwoText:
    "Onze leiding zorgt voor een warme en veilige omgeving waarin elk kind zich welkom voelt en op zijn eigen tempo kan groeien.",
  branchKapoenenBlockThreeTitle: "Kom eens proberen",
  branchKapoenenBlockThreeText:
    "Zin om mee op avontuur te gaan? Nieuwe kapoenen mogen gerust eens proberen. Wij staan alvast elke zaterdag klaar.",
  branchKapoenenLeaderNames: "Leiding wordt binnenkort aangevuld",
  branchKapoenenLeaderPhotoUrl: "",
  branchKapoenenPlanningDay: "Elke zaterdag",
  branchKapoenenPlanningTime: "14u-17u",
  branchKapoenenPlanningTimeNote:
    "Meestal 14u-17u, afwijkingen staan bij de vergadering.",
  branchKapoenenPlanningLocation: "Diest, Belgie",
  branchKapoenenPlanningBring: "Kleren die vuil mogen worden",
  branchKapoenenPlanningContact: "Via de takleiding of groepsleiding",
  branchKapoenenPlanningCountText:
    "Er staan {aantal} vergaderingen in het programma.",
  branchKapoenenPlanningEmptyText: "Programma wordt binnenkort aangevuld",
  branchKapoenenProgram:
    stringifyProgramItems([
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
          "Deze week leert de leiding jullie allemaal essentiele technieken om echte scouts te worden.",
      },
      {
        date: "14/02",
        title: "Valentijnsvergadering",
        time: "14u-17u",
        description:
          "De liefde hangt in de lucht! Kom zaterdag naar de scouts om te ontdekken of cupido jou ook heeft geraakt.",
      },
    ]),
  branchWelpenAge: "8-11 jaar",
  branchWelpenShortDescription:
    "Welpen spelen grotere groepsspelen, trekken de natuur in en leren stap voor stap samenwerken binnen de groep.",
  branchWelpenIntro:
    "Welpen hebben bakken energie. Ze spelen grotere groepsspelen, leren samenwerken en bouwen aan vertrouwen binnen hun tak.",
  branchWelpenHighlights: "Grotere bosspelen\nSamenwerken\nNatuur ontdekken",
  branchWelpenImageUrl: "",
  branchWelpenBlockOneTitle: "Wat doen welpen?",
  branchWelpenBlockOneText:
    "Welpen trekken graag naar buiten voor bosspelen, zoektochten en creatieve opdrachten. De activiteiten zijn actief, fantasierijk en gericht op samenspel.",
  branchWelpenBlockTwoTitle: "Voor ouders",
  branchWelpenBlockTwoText:
    "De leiding houdt rekening met de leeftijd en zorgt dat elk kind zich welkom voelt. Nieuwe leden worden actief meegenomen in de groep.",
  branchWelpenBlockThreeTitle: "Groei in de groep",
  branchWelpenBlockThreeText:
    "Welpen leren afspraken volgen, elkaar helpen en samen uitdagingen oplossen. Zo groeit de groep week na week sterker naar elkaar toe.",
  branchWelpenLeaderNames: "Leiding wordt binnenkort aangevuld",
  branchWelpenLeaderPhotoUrl: "",
  branchWelpenPlanningDay: "Elke zaterdag",
  branchWelpenPlanningTime: "14u-17u",
  branchWelpenPlanningTimeNote:
    "Meestal 14u-17u, afwijkingen staan bij de vergadering.",
  branchWelpenPlanningLocation: "Diest, Belgie",
  branchWelpenPlanningBring: "Kleren die vuil mogen worden",
  branchWelpenPlanningContact: "Via de takleiding of groepsleiding",
  branchWelpenPlanningCountText:
    "Er staan {aantal} vergaderingen in het programma.",
  branchWelpenPlanningEmptyText: "Programma wordt binnenkort aangevuld",
  branchWelpenProgram:
    stringifyProgramItems([]),
  branchJongverkennersAge: "11-13 jaar",
  branchJongverkennersShortDescription:
    "Jongverkenners krijgen meer uitdaging, avontuur en verantwoordelijkheid. Ze leren technieken, spelen intensere spelen en groeien als groep.",
  branchJongverkennersIntro:
    "Bij de jongverkenners wordt scouts uitdagender. Leden krijgen meer verantwoordelijkheid en ontdekken technieken, tochten en stevigere activiteiten.",
  branchJongverkennersHighlights:
    "Meer uitdaging\nScoutsvaardigheden\nGroepsgevoel",
  branchJongverkennersImageUrl: "",
  branchJongverkennersBlockOneTitle: "Wat doen jongverkenners?",
  branchJongverkennersBlockOneText:
    "Jongverkenners leren sjorren, kaartlezen, koken op vuur en zelfstandig samenwerken tijdens grotere spelen en tochten.",
  branchJongverkennersBlockTwoTitle: "Voor ouders",
  branchJongverkennersBlockTwoText:
    "De leiding bouwt de activiteiten veilig op, met duidelijke begeleiding en ruimte voor meer zelfstandigheid.",
  branchJongverkennersBlockThreeTitle: "Groei in de groep",
  branchJongverkennersBlockThreeText:
    "Leden leren initiatief nemen, afspraken maken en elkaar ondersteunen. Dat maakt deze tak een sterke stap richting meer engagement.",
  branchJongverkennersLeaderNames: "Leiding wordt binnenkort aangevuld",
  branchJongverkennersLeaderPhotoUrl: "",
  branchJongverkennersPlanningDay: "Elke zaterdag",
  branchJongverkennersPlanningTime: "14u-17u",
  branchJongverkennersPlanningTimeNote:
    "Meestal 14u-17u, afwijkingen staan bij de vergadering.",
  branchJongverkennersPlanningLocation: "Diest, Belgie",
  branchJongverkennersPlanningBring: "Kleren die vuil mogen worden",
  branchJongverkennersPlanningContact: "Via de takleiding of groepsleiding",
  branchJongverkennersPlanningCountText:
    "Er staan {aantal} vergaderingen in het programma.",
  branchJongverkennersPlanningEmptyText: "Programma wordt binnenkort aangevuld",
  branchJongverkennersProgram:
    stringifyProgramItems([]),
  branchVerkennersAge: "13-16 jaar",
  branchVerkennersShortDescription:
    "Verkenners gaan voor grotere uitdagingen, stevige activiteiten, tochten, engagement en zelfstandigheid binnen hun tak.",
  branchVerkennersIntro:
    "Verkenners zoeken avontuur met meer diepgang. Activiteiten worden groter, zelfstandiger en vragen meer inzet van de groep.",
  branchVerkennersHighlights: "Stevige activiteiten\nZelfstandigheid\nEngagement",
  branchVerkennersImageUrl: "",
  branchVerkennersBlockOneTitle: "Wat doen verkenners?",
  branchVerkennersBlockOneText:
    "Verkenners gaan op tocht, bouwen constructies, spelen intensere spelen en nemen vaker zelf initiatief in hun takwerking.",
  branchVerkennersBlockTwoTitle: "Voor ouders",
  branchVerkennersBlockTwoText:
    "De leiding blijft nabij, maar geeft leden ook bewust ruimte om keuzes te maken, plannen uit te voeren en verantwoordelijkheid op te nemen.",
  branchVerkennersBlockThreeTitle: "Groei in de groep",
  branchVerkennersBlockThreeText:
    "Leden leren samenwerken onder druk, voor elkaar zorgen en hun plek vinden binnen een hechte groep.",
  branchVerkennersLeaderNames: "Leiding wordt binnenkort aangevuld",
  branchVerkennersLeaderPhotoUrl: "",
  branchVerkennersPlanningDay: "Elke zaterdag",
  branchVerkennersPlanningTime: "14u-17u",
  branchVerkennersPlanningTimeNote:
    "Meestal 14u-17u, afwijkingen staan bij de vergadering.",
  branchVerkennersPlanningLocation: "Diest, Belgie",
  branchVerkennersPlanningBring: "Kleren die vuil mogen worden",
  branchVerkennersPlanningContact: "Via de takleiding of groepsleiding",
  branchVerkennersPlanningCountText:
    "Er staan {aantal} vergaderingen in het programma.",
  branchVerkennersPlanningEmptyText: "Programma wordt binnenkort aangevuld",
  branchVerkennersProgram:
    stringifyProgramItems([]),
  branchJinsAge: "17-18 jaar",
  branchJinsShortDescription:
    "Jins staan op de grens tussen lid en leiding. Ze werken aan eigen projecten, nemen verantwoordelijkheid op en groeien richting engagement.",
  branchJinsIntro:
    "Jins krijgen ruimte om zelf richting te geven aan hun scoutsjaar. Ze werken aan projecten en groeien richting engagement binnen de groep.",
  branchJinsHighlights: "Eigen projecten\nVerantwoordelijkheid\nRichting leiding",
  branchJinsImageUrl: "",
  branchJinsBlockOneTitle: "Wat doen jins?",
  branchJinsBlockOneText:
    "Jins denken mee, organiseren mee en werken aan eigen plannen. Ze beleven scouts nog altijd als lid, maar met meer initiatief en verantwoordelijkheid.",
  branchJinsBlockTwoTitle: "Voor ouders",
  branchJinsBlockTwoText:
    "Deze leeftijdsgroep krijgt begeleiding die vertrouwen geeft en tegelijk helpt om engagement concreet en haalbaar te maken.",
  branchJinsBlockThreeTitle: "Groei in de groep",
  branchJinsBlockThreeText:
    "Jins leren plannen, communiceren, samenwerken en verantwoordelijkheid opnemen. Zo vormt deze tak een mooie brug naar leiding of ander engagement.",
  branchJinsLeaderNames: "Leiding wordt binnenkort aangevuld",
  branchJinsLeaderPhotoUrl: "",
  branchJinsPlanningDay: "Elke zaterdag",
  branchJinsPlanningTime: "14u-17u",
  branchJinsPlanningTimeNote:
    "Meestal 14u-17u, afwijkingen staan bij de vergadering.",
  branchJinsPlanningLocation: "Diest, Belgie",
  branchJinsPlanningBring: "Kleren die vuil mogen worden",
  branchJinsPlanningContact: "Via de takleiding of groepsleiding",
  branchJinsPlanningCountText:
    "Er staan {aantal} vergaderingen in het programma.",
  branchJinsPlanningEmptyText: "Programma wordt binnenkort aangevuld",
  branchJinsProgram:
    stringifyProgramItems([]),
};

export const editableSiteContentKeys = Object.keys(
  defaultSiteContent
) as Array<keyof EditableSiteContent>;

const legacyValueReplacements: Partial<
  Record<keyof EditableSiteContent, Record<string, string>>
> = {
  branchKapoenenShortDescription: {
    "Voor onze jongste leden draait alles rond fantasie, spel en verwondering. Kapoenen ontdekken scouts op een speelse en veilige manier.":
      defaultSiteContent.branchKapoenenShortDescription,
  },
  branchKapoenenIntro: {
    "Bij de kapoenen maken kinderen op een warme en speelse manier kennis met scouts. Fantasie, kleine avonturen en samen spelen staan centraal.":
      defaultSiteContent.branchKapoenenIntro,
  },
  branchKapoenenHighlights: {
    "Veel fantasie\nVeilige kennismaking\nKorte en speelse opdrachten":
      defaultSiteContent.branchKapoenenHighlights,
  },
  branchKapoenenBlockOneText: {
    "Kapoenen spelen fantasierijke groepsspelen, ontdekken de natuur en leren stap voor stap wat scouts betekent. De activiteiten zijn speels, overzichtelijk en aangepast aan jonge kinderen.":
      defaultSiteContent.branchKapoenenBlockOneText,
  },
  branchKapoenenBlockTwoTitle: {
    "Voor ouders": defaultSiteContent.branchKapoenenBlockTwoTitle,
  },
  branchKapoenenBlockTwoText: {
    "De leiding zorgt voor duidelijke afspraken, een warme ontvangst en begeleiding op maat. Nieuwe kapoenen mogen rustig wennen aan de groep.":
      defaultSiteContent.branchKapoenenBlockTwoText,
  },
  branchKapoenenBlockThreeTitle: {
    "Groei in de groep": defaultSiteContent.branchKapoenenBlockThreeTitle,
  },
  branchKapoenenBlockThreeText: {
    "Kinderen leren samen spelen, luisteren naar elkaar en kleine verantwoordelijkheden opnemen, altijd met veel ruimte voor plezier.":
      defaultSiteContent.branchKapoenenBlockThreeText,
  },
};

export function normalizeSiteContentValue(
  key: keyof EditableSiteContent,
  value: string
) {
  return legacyValueReplacements[key]?.[value] ?? value;
}

export function sanitizeSiteContent(
  payload: Partial<Record<keyof EditableSiteContent, unknown>>
) {
  const sanitized = { ...defaultSiteContent };

  for (const key of editableSiteContentKeys) {
    const value = payload[key];
    if (typeof value === "string") {
      sanitized[key] = normalizeSiteContentValue(key, value.trim());
    }
  }

  if (!sanitized.registrationLink) {
    sanitized.registrationLink = "#contact";
  }

  return sanitized;
}
