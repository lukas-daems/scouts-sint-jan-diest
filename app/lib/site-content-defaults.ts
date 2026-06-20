import { stringifyProgramItems } from "./program";

const pageContentDefaults = {
  pageActivitiesEyebrow: "Activiteiten en werking",
  pageActivitiesTitle: "Alles wat er leeft bij Scouts Sint-Jan Berchmans",
  pageActivitiesImageUrl: "",
  pageActivitiesSidebarTitle: "Voor leden, ouders en sympathisanten",
  pageActivitiesSidebarText:
    "Deze pagina bundelt de wekelijkse werking, kampen, evenementen en steunacties. Zo zie je snel wat voor leden bedoeld is, wat een publiek evenement is en hoe je de scouts kan steunen.",
  pageActivitiesCards:
    "Wekelijkse werking|Elke zaterdag van 14u tot 17u beleven jongens van 6 tot 18 jaar activiteiten op maat van hun leeftijd.\nZomerkamp|Het hoogtepunt van het scoutsjaar, met meerdere dagen samenleven, spelen en groeien als tak.\nDropping|Een avontuurlijk evenement waarbij deelnemers samen op pad gaan en de werking steunen.\nSteak- en Burgerday|Een gezellig eetmoment voor leden, ouders, oud-leiding en sympathisanten.\nOntbijtmanden|Een verkoopactie waarmee mensen de scouts steunen door ontbijtmanden te bestellen.\nGroepsactiviteiten|Momenten waarop heel Scouts Sint-Jan Berchmans samenkomt.",
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
  pageZomerkampTitle: "Zomerkamp met Scouts Sint-Jan Berchmans",
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
    "Voor wie?|Ouders, oud-leiding en sympathisanten|Concrete leeftijdsinfo kan worden aangevuld\nInschrijven|Via externe link|Google Form of andere link via admin\nVeiligheid|Duidelijke afspraken|Praktische afspraken worden bij deelname gedeeld",
  pageDroppingExternalCtaTitle: "Schrijf je in voor de dropping",
  pageDroppingExternalCtaText:
    "Zodra de inschrijvingen openen, plaatsen we hier de externe inschrijflink. Zo verloopt alle registratie via een duidelijk beheerd formulier.",
  pageDroppingExternalCtaButton: "Naar inschrijfformulier",
  pageDroppingExternalCtaUrl: "",
  pageDroppingPrimaryCtaLabel: "Ik heb interesse",
  pageDroppingPrimaryCtaHref: "#aanvragen",

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
  pageOntbijtmandenExternalCtaTitle: "Bestel een ontbijtmand",
  pageOntbijtmandenExternalCtaText:
    "Wanneer de verkoopactie loopt, plaatsen we hier de externe bestellink. Daar kunnen aantallen, afhalen of leveren en contactgegevens veilig verzameld worden.",
  pageOntbijtmandenExternalCtaButton: "Naar bestelformulier",
  pageOntbijtmandenExternalCtaUrl: "",
  pageOntbijtmandenPrimaryCtaLabel: "Bestelmand invullen",
  pageOntbijtmandenPrimaryCtaHref: "#aanvragen",

  pageSteakBurgerdayEyebrow: "Eetmoment en steunactie",
  pageSteakBurgerdayTitle: "Steak- en Burgerday",
  pageSteakBurgerdayImageUrl: "",
  pageSteakBurgerdaySidebarTitle: "Gezellig eten voor de groepswerking",
  pageSteakBurgerdaySidebarText:
    "Steak- en Burgerday is een fysiek eetmoment voor leden, ouders, oud-leiding en sympathisanten. Het is gezellig én ondersteunt de scouts.",
  pageSteakBurgerdayCards:
    "Datum|Datum en uren worden tijdig aangekondigd.\nLocatie|De locatie wordt bij de reservatie gedeeld.\nMenu|Steak, burger of vegetarische optie.\nReservatie|Reserveer vooraf zodat we goed kunnen plannen.",
  pageSteakBurgerdayFacts:
    "Voor wie?|Iedereen welkom|Leden, ouders en sympathisanten\nPrijs|Prijzen per menu-optie worden gedeeld|Per menu-optie\nReservatie|Via externe link|Google Form of andere link via admin",
  pageSteakBurgerdayMenuOptions: "Steak,Burger,Vegetarisch,Kinderportie",
  pageSteakBurgerdayExternalCtaTitle: "Reserveer je plaats",
  pageSteakBurgerdayExternalCtaText:
    "Wanneer de reservaties openen, plaatsen we hier de externe reservatielink voor naam, aantal personen, menu-keuze en opmerkingen.",
  pageSteakBurgerdayExternalCtaButton: "Naar reservatieformulier",
  pageSteakBurgerdayExternalCtaUrl: "",
  pageSteakBurgerdayPrimaryCtaLabel: "Reserveer",
  pageSteakBurgerdayPrimaryCtaHref: "#aanvragen",

  pageShopEyebrow: "Materiaal en kledij",
  pageShopTitle: "Shop en scoutsbenodigdheden",
  pageShopImageUrl: "",
  pageShopSidebarTitle: "Vraag groepsmateriaal eenvoudig aan",
  pageShopSidebarText:
    "Deze shop is bedoeld voor groepskledij, badges of nuttig materiaal. De echte voorraad en betaling kunnen later gekoppeld worden.",
  pageShopCards:
    "Uniform|Nieuwe leden krijgen uitleg over hemd, das en afspraken.\nGroepsmateriaal|Hier kan info komen over eigen groepskledij of materiaalacties.\nAanvragen|Gebruik de externe aanvraaglink wanneer die beschikbaar is.",
  pageShopProducts:
    "Scoutsdas|€12|Eenheidsmaat|Aanvragen\nGroeps-T-shirt|€18|S,M,L,XL|Aanvragen\nBadge Scouts Sint-Jan|€3|Eenheidsmaat|Aanvragen",
  pageShopExternalCtaTitle: "Vraag shopmateriaal aan",
  pageShopExternalCtaText:
    "Gebruik hier later een externe aanvraaglink voor producten, maten en opmerkingen. Zonder link tonen we duidelijk dat de aanvraaglink nog volgt.",
  pageShopExternalCtaButton: "Naar aanvraagformulier",
  pageShopExternalCtaUrl: "",
  pageShopPrimaryCtaLabel: "Product aanvragen",
  pageShopPrimaryCtaHref: "#aanvragen",

  pageOudercomiteEyebrow: "Ouders rond de groep",
  pageOudercomiteTitle: "Oudercomite",
  pageOudercomiteImageUrl: "",
  pageOudercomiteSidebarTitle: "Enthousiaste ouders die mee rond de groep staan",
  pageOudercomiteSidebarText:
    "Het oudercomite bestaat uit enthousiaste en gemotiveerde ouders die ongeveer vijf keer per werkjaar samenkomen met de groepsleiding. Ze vertegenwoordigen ouders naar de leiding toe, brengen bekommernissen constructief aan en ondersteunen de groep waar dat nodig is.",
  pageOudercomiteCards:
    "Spreekbuis voor ouders|Ouders kunnen met vragen, bedenkingen of problemen die de leden aanbelangen terecht bij het oudercomite. Het oudercomite brengt signalen op een constructieve manier tot bij de leiding.\nSteak & Burger Day en dropping|Het oudercomite organiseert jaarlijks Steak & Burger Day en een dropping. Die activiteiten brengen mensen samen en ondersteunen financieel de werking van Sint-Jan.\nHulp op Scoutsbal|Tijdens Scoutsbal steken ouders mee de handen uit de mouwen, bijvoorbeeld door te helpen tappen of praktische taken op te nemen.\nFinanciele steun voor Sint-Jan|Door acties en hulp achter de schermen draagt het oudercomite bij aan de werking van de groep Scouts Sint-Jan Berchmans.",
  pageOudercomiteFacts:
    "Vergaderingen|Ongeveer 5 keer per werkjaar|Samen met de groepsleiding\nActief lid|Je wordt uitgenodigd op de vergaderingen|Mee nadenken en opvolgen\nHelpend lid|Je helpt mee bij activiteiten|Bijvoorbeeld Steakday, dropping of Scoutsbal\nAanspreekbaar|Tijdens activiteiten|Ouders mogen leden van het oudercomite gerust aanspreken",
  pageOudercomiteHighlightLabel: "Even voorstellen",
  pageOudercomiteHighlightTitle: "Een constructieve brug tussen ouders en leiding",
  pageOudercomiteHighlightText:
    "Ouders kunnen leden van het oudercomite aanspreken tijdens activiteiten. Zo blijven vragen, ideeen en bekommernissen dicht bij de groep en bij de groepsleiding.",
  pageOudercomiteWorkTitle: "Wat doet het oudercomite?",
  pageOudercomiteJoinTitle: "Hoe kan je aansluiten?",
  pageOudercomiteMembersTitle: "Ledenlijst",
  pageOudercomiteMembers: "Ledenlijst volgt.",
  pageOudercomiteExternalCtaTitle: "Interesse in het oudercomite?",
  pageOudercomiteExternalCtaText:
    "Interesse om je bij het oudercomite te voegen of heb je vragen? Contacteer ons via oudercomite@sintjanman.be.",
  pageOudercomiteExternalCtaButton: "Mail het oudercomite",
  pageOudercomiteExternalCtaUrl: "mailto:oudercomite@sintjanman.be",
  pageOudercomitePrimaryCtaLabel: "Contacteer het oudercomite",
  pageOudercomitePrimaryCtaHref: "#aanvragen",

  pageVerhuurEyebrow: "Materiaalverhuur",
  pageVerhuurTitle: "Verhuur",
  pageVerhuurImageUrl: "",
  pageVerhuurSidebarTitle: "Lokalen niet te huur, materiaal wel",
  pageVerhuurSidebarText:
    "Veel groepen vragen om lokalen te huren voor weekends of kampen. Door de zonering van onze lokalen is dat niet toegestaan. We verhuren wel materiaal, zoals eetmateriaal en biertafelsets.",
  pageVerhuurCards:
    "Bestek en borden|We beschikken over bestek en borden voor ongeveer 100 personen. Handig voor eetdagen, verenigingsmomenten of grotere maaltijden.\nBiertafelsets|Er zijn 14 biertafelsets beschikbaar. Een set bestaat uit een tafel van 220 x 70 cm en twee banken van 220 x 35 cm.\nPraktische afspraken|Neem vooraf contact op voor beschikbaarheid, afhaling, terugbrengen en eventuele bijkomende afspraken rond zorg voor het materiaal.",
  pageVerhuurFacts:
    "Lokalen|Niet te huur|Door de zonering van de lokalen is verhuur niet toegestaan\nBiertafelsets|14 sets beschikbaar|1 tafel van 220 x 70 cm en 2 banken van 220 x 35 cm\nPrijs|10 euro per set|Voor 2 dagen of een weekend\nEetmateriaal|Ongeveer 100 personen|Bestek en borden beschikbaar",
  pageVerhuurHighlightLabel: "Belangrijk",
  pageVerhuurHighlightTitle: "Lokalen niet te huur",
  pageVerhuurHighlightText:
    "Onze lokalen kunnen niet verhuurd worden voor weekends, kampen of andere overnachtingen. Door de zonering van de lokalen is verhuur niet toegestaan.",
  pageVerhuurMaterialsTitle: "Materiaal dat wel verhuurd wordt",
  pageVerhuurPricesTitle: "Prijzen en details",
  pageVerhuurExternalCtaTitle: "Materiaal huren of vragen over verhuur?",
  pageVerhuurExternalCtaText:
    "Wil je materiaal huren of heb je vragen over verhuur? Contacteer ons via verhuur@sintanman.be.",
  pageVerhuurExternalCtaButton: "Mail verhuur",
  pageVerhuurExternalCtaUrl: "mailto:verhuur@sintanman.be",
  pageVerhuurPrimaryCtaLabel: "Mail voor verhuur",
  pageVerhuurPrimaryCtaHref: "#aanvragen",

  pageLinksEyebrow: "Nuttige links",
  pageLinksTitle: "Links en nuttige informatie",
  pageLinksImageUrl: "",
  pageLinksSidebarTitle: "Alles snel terugvinden",
  pageLinksSidebarText:
    "Deze pagina verzamelt nuttige verwijzingen voor ouders, leden, documenten en externe scoutsinformatie.",
  pageLinksCards:
    "Voor ouders|Belangrijke formulieren en informatie.\nVoor leden|Links naar werking, kamp of praktische documenten.\nExterne info|Nuttige pagina's van Scouts en Gidsen Vlaanderen.",
  pageLinksItems:
    "Scouts algemeen|Scouts en Gidsen Vlaanderen|https://www.scoutsengidsenvlaanderen.be|Algemene info over scouts.\nMeisjesscouts in Diest|Scouts Sint-Lutgardis|https://www.sintlutdiest.com|Voor meisjes verwijzen we graag vriendelijk naar Scouts Sint-Lutgardis Diest.\nFormulieren|Medische fiche|/#contact|Vervang later door het juiste document.\nSociale media|Instagram|/#contact|Officieel profiel toevoegen.",
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
  contactPhones: string;
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
  branchKapoenenImportantDates: string;
  branchWelpenProgram: string;
  branchWelpenImportantDates: string;
  branchJongverkennersProgram: string;
  branchJongverkennersImportantDates: string;
  branchVerkennersProgram: string;
  branchVerkennersImportantDates: string;
  branchJinsProgram: string;
  branchJinsImportantDates: string;
} & Record<string, string>;

export const defaultSiteContent: EditableSiteContent = {
  siteName: "Scouts Sint-Jan Berchmans",
  sitePrimaryColor: "#103001",
  siteLogoUrl: "",
  heroEyebrow: "OFFICIËLE SCOUTSGROEP UIT DIEST",
  heroTitleLineOne: "Avontuur begint bij",
  heroTitleLineTwo: "Scouts Sint-Jan Berchmans",
  heroSubtitle:
    "Elke zaterdag beleven jongens van 6 tot 18 jaar uit Diest avontuur, vriendschap en groei in de natuur. Een warme jongensscouts waar spelen, ontdekken en samenwerken centraal staan.",
  heroOrgLabel: "Scouts en Gidsen Vlaanderen",
  heroPrimaryCtaLabel: "Word lid",
  heroSecondaryCtaLabel: "Ontdek onze takken",
  heroStatOneTitle: "Elke zaterdag",
  heroStatOneLabel: "14u-17u activiteit",
  heroStatTwoTitle: "5 takken",
  heroStatTwoLabel: "jongens 6-18 jaar",
  heroStatThreeTitle: "Diest",
  heroStatThreeLabel: "lokaal en vertrouwd",
  heroStatFourTitle: "Kennismaken",
  heroStatFourLabel: "eerst proberen mag",
  aboutTitle: "Een plek om te groeien, spelen en ontdekken",
  aboutSubtitle:
    "Scouts Sint-Jan Berchmans is een jongensscouts in Diest waar leden samen op avontuur gaan. Elke zaterdag trekken we naar buiten, spelen we grote groepsspelen, leren jongens verantwoordelijkheid opnemen en bouwen ze aan vriendschappen die blijven.",
  aboutCardOneTitle: "Avontuur in de natuur",
  aboutCardOneText:
    "Van bosspelen tot tochten en kampen: bij ons beleven leden elke week iets nieuws buiten de schoolmuren.",
  aboutCardTwoTitle: "Samen groeien",
  aboutCardTwoText:
    "Leden leren samenwerken, initiatief nemen en zichzelf beter kennen in een veilige en warme groep.",
  aboutCardThreeTitle: "Jongens van 6 tot 18",
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
  whyJoinTitle: "Waarom ouders kiezen voor Scouts Sint-Jan Berchmans",
  whyJoinText:
    "Bij Scouts Sint-Jan Berchmans vinden jongens een plek waar ze zichzelf kunnen zijn, nieuwe vrienden maken en stap voor stap zelfstandiger worden. Onze leiding zorgt voor uitdagende, veilige en leeftijdsgerichte activiteiten.",
  whyJoinBullets:
    "Activiteiten aangepast aan elke leeftijd\nEen warme groep met aandacht voor elk lid\nBuiten spelen, bewegen en ontdekken\nErvaren leiding met engagement\nSterke traditie in Diest\nRuimte om verantwoordelijkheid te leren opnemen",
  practicalTitle: "Praktische informatie",
  practicalSubtitle: "Alles wat je als ouder snel wil weten over onze werking.",
  practicalActivityMoment: "Elke zaterdag van 14u tot 17u.",
  practicalCardOneTitle: "Elke zaterdag",
  practicalCardOneText: "14u-17u",
  practicalCardOneNote: "Elke zaterdag van 14u tot 17u.",
  practicalCardTwoTitle: "5 takken",
  practicalCardTwoText: "Voor jongens van 6 tot 18 jaar",
  practicalCardTwoNote: "Kapoenen tot jins",
  practicalCardThreeTitle: "Diest",
  practicalCardThreeText: "Lokaal verbonden en makkelijk bereikbaar",
  practicalCardThreeNote: "Diest, Belgie",
  practicalCardFourTitle: "Zomerkamp",
  practicalCardFourText: "Het hoogtepunt van het scoutsjaar",
  practicalCardFourNote: "2 weekends en zomerkamp",
  practicalAddress: "Diest, Belgie",
  registrationLink: "#contact",
  campBadge: "Kampinformatie",
  campTitle: "Op kamp met Scouts Sint-Jan Berchmans",
  campSubtitle:
    "Het zomerkamp in de zomervakantie is voor veel leden het hoogtepunt van het jaar: samenleven, spelen, koken, ontdekken en groeien als groep.",
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
    "Heb je vragen, wil je je zoon inschrijven of graag eens vrijblijvend langskomen? Neem contact op met de leiding van Scouts Sint-Jan Berchmans.",
  contactExternalTitle: "Stel je vraag of vraag info aan",
  contactExternalText:
    "Gebruik hier later een externe link naar een contact- of inschrijvingsformulier. Zonder link blijft de mailknop beschikbaar.",
  contactExternalButton: "Stel je vraag",
  contactExternalUrl: "",
  contactMailCta: "Stuur ons een mail",
  contactTrustText:
    "Nieuwe leden zijn welkom om eerst vrijblijvend kennis te maken.",
  contactLocation: "Diest, Belgie",
  contactEmail: "info@scoutssintjandiest.be",
  contactPhone: "+32 000 00 00 00",
  contactPhones:
    "Groepsleiding|+32 000 00 00 00\nTakleiding|+32 000 00 00 00",
  instagram: "@scoutssintjandiest",
  facebook: "Scouts Sint-Jan Berchmans",
  instagramUrl: "/#contact",
  facebookUrl: "/#contact",
  footerDescription:
    "Een jongensscouts uit Diest waar leden groeien door avontuur, vriendschap en engagement.",
  footerCopyright:
    "© 2026 Scouts Sint-Jan Berchmans. Alle rechten voorbehouden.",
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
    "Elke zaterdag van 14u tot 17u maken we ruimte voor spel, natuur, creativiteit en groepsgevoel. Daarnaast zijn er twee weekends per jaar, een zomerkamp en doorheen het jaar speciale evenementen en steunacties.",
  pageDroppingIntro:
    "Dropping is een echte scoutsactiviteit en steunend evenement: deelnemers gaan in groep op pad, beleven een avond vol avontuur en steunen tegelijk de werking.",
  pageOntbijtmandenIntro:
    "Ontbijtmanden is vooral een verkoopactie: mensen bestellen een ontbijtmand en steunen zo de scouts zonder fysiek naar een evenement te komen.",
  pageSteakBurgerdayIntro:
    "Steak- en Burgerday is een gezellig eetmoment voor leden, ouders, oud-leiding en sympathisanten. Het is tegelijk een ontmoetingsmoment en steunactie voor de groep.",
  pageZomerkampIntro:
    "Het zomerkamp in de zomervakantie is voor veel leden het mooiste moment van het jaar. We leven samen, spelen grote spelen, koken, ontdekken en groeien als tak.",
  pageShopIntro:
    "Op deze pagina kan later informatie komen over groepskledij, badges, nuttig kampmateriaal of links naar officiele scoutswinkels.",
  pageOudercomiteIntro:
    "Het oudercomite brengt ouders en groepsleiding dichter bij elkaar. Enthousiaste ouders denken mee, helpen bij activiteiten en zorgen mee voor een sterke werking van Scouts Sint-Jan Berchmans.",
  pageVerhuurIntro:
    "Onze lokalen kunnen niet verhuurd worden, maar bepaald materiaal wel. Op deze pagina vind je wat mogelijk is, welke prijzen gelden en hoe je ons contacteert.",
  pageLinksIntro:
    "Een overzichtspagina voor nuttige verwijzingen, formulieren, scoutsinformatie en externe pagina's die ouders of leden vaak nodig hebben.",
  pageOudLeidingTitle: "Oud-leiding van Scouts Sint-Jan Berchmans",
  pageOudLeidingIntro:
    "Oud-leiding blijft een belangrijk deel van de geschiedenis, sfeer en traditie van Scouts Sint-Jan Berchmans.",
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
    "Fantasie\nSpel\nEerste scoutsavonturen\nVeilig groeien",
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
  branchKapoenenPlanningBringNote:
    "Als er andere kledij of extra materiaal nodig is, staat dat bij de vergadering in het programma.",
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
  branchKapoenenImportantDates: "",
  branchWelpenAge: "8-11 jaar",
  branchWelpenShortDescription:
    "Welpen ontdekken samen de wereld, trekken eropuit en beleven elke week nieuwe avonturen in een warme groep.",
  branchWelpenIntro:
    "Welpen (8-11 jaar) zitten vol energie en nieuwsgierigheid. In een veilige en speelse omgeving ontdekken ze samen de wereld, trekken ze eropuit en beleven ze elke week nieuwe avonturen.",
  branchWelpenHighlights: "Energie\nSamen spelen\nOntdekken\nVriendschap",
  branchWelpenImageUrl: "",
  branchWelpenBlockOneTitle: "Wat doen welpen?",
  branchWelpenBlockOneText:
    "Welpen spelen actieve groepsspelen, trekken de natuur in en krijgen opdrachten die passen bij hun leefwereld. Elke zaterdag draait rond bewegen, proberen, lachen en samen iets beleven.",
  branchWelpenBlockTwoTitle: "Samen groeien",
  branchWelpenBlockTwoText:
    "De leiding daagt hen uit, begeleidt hen in samenwerken en helpt hen stap voor stap zelfstandiger worden. Zo ontstaan vriendschappen en kan elk kind op eigen tempo groeien.",
  branchWelpenBlockThreeTitle: "Kom eens proberen",
  branchWelpenBlockThreeText:
    "Nieuwe welpen zijn welkom om vrijblijvend eens mee te doen op zaterdag van 14u tot 17u. De leiding zorgt voor een warme ontvangst in de groep.",
  branchWelpenLeaderNames: "Leiding wordt binnenkort aangevuld",
  branchWelpenLeaderPhotoUrl: "",
  branchWelpenPlanningDay: "Elke zaterdag",
  branchWelpenPlanningTime: "14u-17u",
  branchWelpenPlanningTimeNote:
    "Meestal 14u-17u, afwijkingen staan bij de vergadering.",
  branchWelpenPlanningLocation: "Diest, Belgie",
  branchWelpenPlanningBring: "Kleren die vuil mogen worden",
  branchWelpenPlanningBringNote:
    "Als er andere kledij of extra materiaal nodig is, staat dat bij de vergadering in het programma.",
  branchWelpenPlanningContact: "Via de takleiding of groepsleiding",
  branchWelpenPlanningCountText:
    "Er staan {aantal} vergaderingen in het programma.",
  branchWelpenPlanningEmptyText: "Programma wordt binnenkort aangevuld",
  branchWelpenProgram:
    stringifyProgramItems([]),
  branchWelpenImportantDates: "",
  branchJongverkennersAge: "11-13 jaar",
  branchJongverkennersShortDescription:
    "Jongverkenners houden van actie, uitdaging en avontuur. Ze leren scouting kennen door zelf te doen.",
  branchJongverkennersIntro:
    "Jongverkenners (11-13 jaar) houden van actie, uitdaging en avontuur. Ze leren scouting echt kennen door zelf dingen te doen: sjorren, kampen bouwen, op tocht gaan en stevige bosspelen spelen.",
  branchJongverkennersHighlights:
    "Actie\nPatrouilles\nTechnieken\nSjorren\nTochten\nVerantwoordelijkheid",
  branchJongverkennersImageUrl: "",
  branchJongverkennersBlockOneTitle: "Wat doen jongverkenners?",
  branchJongverkennersBlockOneText:
    "Ze leren sjorren, slapen in patrouilletenten, kampen bouwen, kaartlezen en op pad gaan met rugzak. De activiteiten zijn steviger, maar blijven haalbaar en begeleid.",
  branchJongverkennersBlockTwoTitle: "Samen in patrouille",
  branchJongverkennersBlockTwoText:
    "Jongverkenners leren samenwerken in patrouille, plannen maken, verantwoordelijkheid opnemen en er zijn voor elkaar. Zo groeit de groep in vertrouwen en zelfstandigheid.",
  branchJongverkennersBlockThreeTitle: "Kom eens proberen",
  branchJongverkennersBlockThreeText:
    "Zin in meer uitdaging? Nieuwe jongverkenners mogen vrijblijvend aansluiten op zaterdag van 14u tot 17u en ontdekken hoe deze tak werkt.",
  branchJongverkennersLeaderNames: "Leiding wordt binnenkort aangevuld",
  branchJongverkennersLeaderPhotoUrl: "",
  branchJongverkennersPlanningDay: "Elke zaterdag",
  branchJongverkennersPlanningTime: "14u-17u",
  branchJongverkennersPlanningTimeNote:
    "Meestal 14u-17u, afwijkingen staan bij de vergadering.",
  branchJongverkennersPlanningLocation: "Diest, Belgie",
  branchJongverkennersPlanningBring: "Kleren die vuil mogen worden",
  branchJongverkennersPlanningBringNote:
    "Als er andere kledij of extra materiaal nodig is, staat dat bij de vergadering in het programma.",
  branchJongverkennersPlanningContact: "Via de takleiding of groepsleiding",
  branchJongverkennersPlanningCountText:
    "Er staan {aantal} vergaderingen in het programma.",
  branchJongverkennersPlanningEmptyText: "Programma wordt binnenkort aangevuld",
  branchJongverkennersProgram:
    stringifyProgramItems([]),
  branchJongverkennersImportantDates: "",
  branchVerkennersAge: "13-16 jaar",
  branchVerkennersShortDescription:
    "Verkenners beleven avontuur met meer vrijheid en verantwoordelijkheid, in een hechte groep waar vriendschap centraal staat.",
  branchVerkennersIntro:
    "Verkenners (13-16 jaar) beleven avontuur met meer vrijheid en verantwoordelijkheid. Scouting draait bij hen om meer dan spel alleen: ze trekken eropuit, bouwen hun eigen kamp en krijgen ruimte om mee te beslissen.",
  branchVerkennersHighlights: "Vrijheid\nUitdaging\nGrote tochten\nEigen projecten\nHechte groep",
  branchVerkennersImageUrl: "",
  branchVerkennersBlockOneTitle: "Wat doen verkenners?",
  branchVerkennersBlockOneText:
    "Denk aan grotere tochten, uitdagende spelen, vlottentocht, driedaagse, kookvergaderingen en projecten die ze samen vormgeven.",
  branchVerkennersBlockTwoTitle: "Vrijheid met begeleiding",
  branchVerkennersBlockTwoText:
    "De leiding zorgt voor een veilige omgeving en een hechte groep, maar geeft verkenners ook bewust ruimte om keuzes te maken en verantwoordelijkheid op te nemen.",
  branchVerkennersBlockThreeTitle: "Kom eens proberen",
  branchVerkennersBlockThreeText:
    "Nieuwe verkenners zijn welkom om op zaterdag eens mee te draaien. Zo voelen ze meteen of de groep en het avontuur bij hen passen.",
  branchVerkennersLeaderNames: "Leiding wordt binnenkort aangevuld",
  branchVerkennersLeaderPhotoUrl: "",
  branchVerkennersPlanningDay: "Elke zaterdag",
  branchVerkennersPlanningTime: "14u-17u",
  branchVerkennersPlanningTimeNote:
    "Meestal 14u-17u, afwijkingen staan bij de vergadering.",
  branchVerkennersPlanningLocation: "Diest, Belgie",
  branchVerkennersPlanningBring: "Kleren die vuil mogen worden",
  branchVerkennersPlanningBringNote:
    "Als er andere kledij of extra materiaal nodig is, staat dat bij de vergadering in het programma.",
  branchVerkennersPlanningContact: "Via de takleiding of groepsleiding",
  branchVerkennersPlanningCountText:
    "Er staan {aantal} vergaderingen in het programma.",
  branchVerkennersPlanningEmptyText: "Programma wordt binnenkort aangevuld",
  branchVerkennersProgram:
    stringifyProgramItems([]),
  branchVerkennersImportantDates: "",
  branchJinsAge: "17-18 jaar",
  branchJinsShortDescription:
    "Jins staan op de grens tussen lid en leiding. Ze werken aan eigen projecten, nemen verantwoordelijkheid op en groeien richting engagement.",
  branchJinsIntro:
    "Jins krijgen ruimte om zelf richting te geven aan hun scoutsjaar. Ze werken aan projecten en groeien richting engagement binnen de groep.",
  branchJinsHighlights: "Engagement\nEigen projecten\nVerantwoordelijkheid\nRichting leiding",
  branchJinsImageUrl: "",
  branchJinsBlockOneTitle: "Wat doen jins?",
  branchJinsBlockOneText:
    "Jins denken mee, organiseren mee en werken aan eigen plannen. Ze beleven scouts nog altijd als lid, maar met meer initiatief en verantwoordelijkheid.",
  branchJinsBlockTwoTitle: "Voor ouders",
  branchJinsBlockTwoText:
    "Deze leeftijdsgroep krijgt begeleiding die vertrouwen geeft en tegelijk helpt om engagement concreet en haalbaar te maken.",
  branchJinsBlockThreeTitle: "Groei in de groep",
  branchJinsBlockThreeText:
    "Jins leren plannen, communiceren, samenwerken en verantwoordelijkheid opnemen. Nieuwe jins mogen gerust eens langskomen en ontdekken hoe deze brug naar leiding of ander engagement voelt.",
  branchJinsLeaderNames: "Leiding wordt binnenkort aangevuld",
  branchJinsLeaderPhotoUrl: "",
  branchJinsPlanningDay: "Elke zaterdag",
  branchJinsPlanningTime: "14u-17u",
  branchJinsPlanningTimeNote:
    "Meestal 14u-17u, afwijkingen staan bij de vergadering.",
  branchJinsPlanningLocation: "Diest, Belgie",
  branchJinsPlanningBring: "Kleren die vuil mogen worden",
  branchJinsPlanningBringNote:
    "Als er andere kledij of extra materiaal nodig is, staat dat bij de vergadering in het programma.",
  branchJinsPlanningContact: "Via de takleiding of groepsleiding",
  branchJinsPlanningCountText:
    "Er staan {aantal} vergaderingen in het programma.",
  branchJinsPlanningEmptyText: "Programma wordt binnenkort aangevuld",
  branchJinsProgram:
    stringifyProgramItems([]),
  branchJinsImportantDates: "",
};

export const editableSiteContentKeys = Object.keys(
  defaultSiteContent
) as Array<keyof EditableSiteContent>;

const legacyValueReplacements: Partial<
  Record<keyof EditableSiteContent, Record<string, string>>
> = {
  siteName: {
    "Scouts Sint-Jan Diest": defaultSiteContent.siteName,
  },
  heroTitleLineTwo: {
    "Scouts Sint-Jan Diest": defaultSiteContent.heroTitleLineTwo,
  },
  heroSubtitle: {
    "Elke week beleven kinderen en jongeren uit Diest avontuur, vriendschap en groei in de natuur. Een warme scoutsgroep waar spelen, ontdekken en samenwerken centraal staan.":
      defaultSiteContent.heroSubtitle,
  },
  heroStatTwoLabel: {
    "voor 6-18 jaar": defaultSiteContent.heroStatTwoLabel,
  },
  aboutSubtitle: {
    "Scouts Sint-Jan Diest is een jeugdbeweging waar kinderen en jongeren samen op avontuur gaan. We trekken naar buiten, spelen grote groepsspelen, leren verantwoordelijkheid opnemen en bouwen aan vriendschappen die blijven.":
      defaultSiteContent.aboutSubtitle,
  },
  aboutCardThreeTitle: {
    "Voor elke leeftijd": defaultSiteContent.aboutCardThreeTitle,
  },
  whyJoinTitle: {
    "Waarom ouders kiezen voor Scouts Sint-Jan Diest":
      defaultSiteContent.whyJoinTitle,
  },
  whyJoinText: {
    "Bij Scouts Sint-Jan Diest vinden kinderen en jongeren een plek waar ze zichzelf kunnen zijn, nieuwe vrienden maken en stap voor stap zelfstandiger worden. Onze leiding zorgt voor uitdagende, veilige en leeftijdsgerichte activiteiten.":
      defaultSiteContent.whyJoinText,
  },
  practicalCardTwoText: {
    "Voor kinderen en jongeren van 6 tot 18 jaar":
      defaultSiteContent.practicalCardTwoText,
  },
  practicalCardFourNote: {
    "Kampinfo via de leiding": defaultSiteContent.practicalCardFourNote,
  },
  campTitle: {
    "Op kamp met Scouts Sint-Jan Diest": defaultSiteContent.campTitle,
  },
  campSubtitle: {
    "Het zomerkamp is voor veel leden het hoogtepunt van het jaar: samenleven, spelen, koken, ontdekken en groeien als groep.":
      defaultSiteContent.campSubtitle,
  },
  contactSubtitle: {
    "Heb je vragen, wil je je kind inschrijven of graag eens langskomen? Neem contact op met de leiding van Scouts Sint-Jan Diest.":
      defaultSiteContent.contactSubtitle,
  },
  facebook: {
    "Scouts Sint-Jan Diest": defaultSiteContent.facebook,
  },
  footerDescription: {
    "Een scoutsgroep uit Diest waar kinderen en jongeren groeien door avontuur, vriendschap en engagement.":
      defaultSiteContent.footerDescription,
  },
  footerCopyright: {
    "© 2026 Scouts Sint-Jan Diest. Alle rechten voorbehouden.":
      defaultSiteContent.footerCopyright,
  },
  pageActivitiesTitle: {
    "Alles wat er leeft bij Scouts Sint-Jan Diest":
      defaultSiteContent.pageActivitiesTitle,
  },
  pageActivitiesCards: {
    "Wekelijkse werking|Elke zaterdag van 14u tot 17u beleven de takken activiteiten op maat van hun leeftijd.\nZomerkamp|Het hoogtepunt van het scoutsjaar, met meerdere dagen samenleven, spelen en groeien als tak.\nDropping|Een avontuurlijk evenement waarbij deelnemers samen op pad gaan en de werking steunen.\nSteak- en Burgerday|Een gezellig eetmoment voor leden, ouders, oud-leiding en sympathisanten.\nOntbijtmanden|Een verkoopactie waarmee mensen de scouts steunen door ontbijtmanden te bestellen.\nGroepsactiviteiten|Momenten waarop heel Scouts Sint-Jan Diest samenkomt.":
      defaultSiteContent.pageActivitiesCards,
  },
  pageActivitiesIntro: {
    "Elke zaterdag van 14u tot 17u maken we ruimte voor spel, natuur, creativiteit en groepsgevoel. Daarnaast organiseren we doorheen het jaar speciale evenementen en steunacties.":
      defaultSiteContent.pageActivitiesIntro,
  },
  pageDroppingPrimaryCtaHref: {
    "#formulier": defaultSiteContent.pageDroppingPrimaryCtaHref,
  },
  pageOntbijtmandenPrimaryCtaHref: {
    "#formulier": defaultSiteContent.pageOntbijtmandenPrimaryCtaHref,
  },
  pageSteakBurgerdayPrimaryCtaHref: {
    "#formulier": defaultSiteContent.pageSteakBurgerdayPrimaryCtaHref,
  },
  pageShopPrimaryCtaHref: {
    "#formulier": defaultSiteContent.pageShopPrimaryCtaHref,
  },
  pageOudercomitePrimaryCtaHref: {
    "#formulier": defaultSiteContent.pageOudercomitePrimaryCtaHref,
  },
  pageVerhuurPrimaryCtaHref: {
    "#formulier": defaultSiteContent.pageVerhuurPrimaryCtaHref,
  },
  pageZomerkampTitle: {
    "Zomerkamp met Scouts Sint-Jan Diest":
      defaultSiteContent.pageZomerkampTitle,
  },
  pageZomerkampIntro: {
    "Het zomerkamp is voor veel leden het mooiste moment van het jaar. We leven samen, spelen grote spelen, koken, ontdekken en groeien als tak.":
      defaultSiteContent.pageZomerkampIntro,
  },
  pageVerhuurIntro: {
    "Heeft Scouts Sint-Jan Diest materiaal of lokalen die verhuurd worden? Dan kan deze pagina later alle voorwaarden, beschikbaarheid en contactinformatie bundelen.":
      defaultSiteContent.pageVerhuurIntro,
    "Heeft Scouts Sint-Jan Berchmans materiaal of lokalen die verhuurd worden? Dan kan deze pagina later alle voorwaarden, beschikbaarheid en contactinformatie bundelen.":
      defaultSiteContent.pageVerhuurIntro,
  },
  pageOudercomiteIntro: {
    "Het oudercomite ondersteunt de groep waar nodig en vormt een brug tussen ouders en leiding. Deze pagina kan later worden aangevuld met namen, werking en contact.":
      defaultSiteContent.pageOudercomiteIntro,
  },
  pageOudercomiteSidebarTitle: {
    "Extra handen maken veel mogelijk":
      defaultSiteContent.pageOudercomiteSidebarTitle,
  },
  pageOudercomiteSidebarText: {
    "Het oudercomite ondersteunt waar nodig en vormt een brug tussen ouders en leiding. Ouders kunnen helpen op kleine of grotere momenten.":
      defaultSiteContent.pageOudercomiteSidebarText,
  },
  pageOudercomiteCards: {
    "Helpen bij acties|Ondersteuning bij eetdagen, verkoopacties of praktische taken.\nBrug tussen ouders en leiding|Vragen of signalen helder mee opvolgen.\nLogistieke steun|Extra handen bij materiaal, vervoer of voorbereiding.":
      defaultSiteContent.pageOudercomiteCards,
  },
  pageOudercomiteFacts: {
    "Tijdsinvestering|Klein of groter engagement|Iedere hulp telt\nVoor wie?|Ouders en sympathisanten|Na contact\nContact|Via externe link|Google Form of andere link via admin":
      defaultSiteContent.pageOudercomiteFacts,
  },
  pageOudercomiteExternalCtaTitle: {
    "Ik wil helpen": defaultSiteContent.pageOudercomiteExternalCtaTitle,
  },
  pageOudercomiteExternalCtaText: {
    "Ouders die willen helpen kunnen later via deze externe link hun gegevens en interesses doorgeven.":
      defaultSiteContent.pageOudercomiteExternalCtaText,
  },
  pageOudercomiteExternalCtaButton: {
    "Naar helpformulier": defaultSiteContent.pageOudercomiteExternalCtaButton,
  },
  pageOudercomiteExternalCtaUrl: {
    "": defaultSiteContent.pageOudercomiteExternalCtaUrl,
  },
  pageVerhuurEyebrow: {
    "Praktische aanvraag": defaultSiteContent.pageVerhuurEyebrow,
  },
  pageVerhuurSidebarTitle: {
    "Vraag beschikbaarheid duidelijk aan":
      defaultSiteContent.pageVerhuurSidebarTitle,
  },
  pageVerhuurSidebarText: {
    "Als er materiaal of lokalen verhuurd worden, kan deze pagina voorwaarden, beschikbaarheid en aanvraaginfo bundelen.":
      defaultSiteContent.pageVerhuurSidebarText,
  },
  pageVerhuurCards: {
    "Beschikbaarheid|Vraag eerst na of de datum mogelijk is.\nMateriaal of lokaal|Omschrijf duidelijk wat je nodig hebt.\nVoorwaarden|Afspraken, waarborg en prijzen kunnen hier worden aangevuld.":
      defaultSiteContent.pageVerhuurCards,
  },
  pageVerhuurFacts: {
    "Aanvraag|Via externe link|Google Form of andere link via admin\nPlanning|Datum nodig|Controle door groepsleiding\nContact|Duidelijke gegevens|Zodat we snel kunnen antwoorden":
      defaultSiteContent.pageVerhuurFacts,
  },
  pageVerhuurExternalCtaTitle: {
    "Doe een verhuuraanvraag":
      defaultSiteContent.pageVerhuurExternalCtaTitle,
  },
  pageVerhuurExternalCtaText: {
    "Gebruik hier later een externe link voor datum, organisatie, materiaal of lokaal, aantal personen en contactgegevens.":
      defaultSiteContent.pageVerhuurExternalCtaText,
  },
  pageVerhuurExternalCtaButton: {
    "Naar verhuuraanvraag": defaultSiteContent.pageVerhuurExternalCtaButton,
  },
  pageVerhuurExternalCtaUrl: {
    "": defaultSiteContent.pageVerhuurExternalCtaUrl,
  },
  pageLinksItems: {
    "Scouts algemeen|Scouts en Gidsen Vlaanderen|https://www.scoutsengidsenvlaanderen.be|Algemene info over scouts.\nFormulieren|Medische fiche|/#contact|Vervang later door het juiste document.\nSociale media|Instagram|/#contact|Officieel profiel toevoegen.":
      defaultSiteContent.pageLinksItems,
  },
  pageOudLeidingTitle: {
    "Oud-leiding van Scouts Sint-Jan Diest":
      defaultSiteContent.pageOudLeidingTitle,
  },
  pageOudLeidingIntro: {
    "Oud-leiding blijft een belangrijk deel van de geschiedenis, sfeer en traditie van Scouts Sint-Jan Diest.":
      defaultSiteContent.pageOudLeidingIntro,
  },
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
    "Fantasie en avontuur\nRavotten en lachen\nElke zaterdag klaar\nVeilig groeien":
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
  branchWelpenShortDescription: {
    "Welpen spelen grotere groepsspelen, trekken de natuur in en leren stap voor stap samenwerken binnen de groep.":
      defaultSiteContent.branchWelpenShortDescription,
  },
  branchWelpenIntro: {
    "Welpen hebben bakken energie. Ze spelen grotere groepsspelen, leren samenwerken en bouwen aan vertrouwen binnen hun tak.":
      defaultSiteContent.branchWelpenIntro,
  },
  branchWelpenHighlights: {
    "Grotere bosspelen\nSamenwerken\nNatuur ontdekken":
      defaultSiteContent.branchWelpenHighlights,
  },
  branchWelpenBlockOneText: {
    "Welpen trekken graag naar buiten voor bosspelen, zoektochten en creatieve opdrachten. De activiteiten zijn actief, fantasierijk en gericht op samenspel.":
      defaultSiteContent.branchWelpenBlockOneText,
  },
  branchWelpenBlockTwoTitle: {
    "Voor ouders": defaultSiteContent.branchWelpenBlockTwoTitle,
  },
  branchWelpenBlockTwoText: {
    "De leiding houdt rekening met de leeftijd en zorgt dat elk kind zich welkom voelt. Nieuwe leden worden actief meegenomen in de groep.":
      defaultSiteContent.branchWelpenBlockTwoText,
  },
  branchWelpenBlockThreeTitle: {
    "Groei in de groep": defaultSiteContent.branchWelpenBlockThreeTitle,
  },
  branchWelpenBlockThreeText: {
    "Welpen leren afspraken volgen, elkaar helpen en samen uitdagingen oplossen. Zo groeit de groep week na week sterker naar elkaar toe.":
      defaultSiteContent.branchWelpenBlockThreeText,
  },
  branchJongverkennersShortDescription: {
    "Jongverkenners krijgen meer uitdaging, avontuur en verantwoordelijkheid. Ze leren technieken, spelen intensere spelen en groeien als groep.":
      defaultSiteContent.branchJongverkennersShortDescription,
  },
  branchJongverkennersIntro: {
    "Bij de jongverkenners wordt scouts uitdagender. Leden krijgen meer verantwoordelijkheid en ontdekken technieken, tochten en stevigere activiteiten.":
      defaultSiteContent.branchJongverkennersIntro,
  },
  branchJongverkennersHighlights: {
    "Meer uitdaging\nScoutsvaardigheden\nGroepsgevoel":
      defaultSiteContent.branchJongverkennersHighlights,
  },
  branchJongverkennersBlockOneText: {
    "Jongverkenners leren sjorren, kaartlezen, koken op vuur en zelfstandig samenwerken tijdens grotere spelen en tochten.":
      defaultSiteContent.branchJongverkennersBlockOneText,
  },
  branchJongverkennersBlockTwoTitle: {
    "Voor ouders": defaultSiteContent.branchJongverkennersBlockTwoTitle,
  },
  branchJongverkennersBlockTwoText: {
    "De leiding bouwt de activiteiten veilig op, met duidelijke begeleiding en ruimte voor meer zelfstandigheid.":
      defaultSiteContent.branchJongverkennersBlockTwoText,
  },
  branchJongverkennersBlockThreeTitle: {
    "Groei in de groep":
      defaultSiteContent.branchJongverkennersBlockThreeTitle,
  },
  branchJongverkennersBlockThreeText: {
    "Leden leren initiatief nemen, afspraken maken en elkaar ondersteunen. Dat maakt deze tak een sterke stap richting meer engagement.":
      defaultSiteContent.branchJongverkennersBlockThreeText,
  },
  branchVerkennersShortDescription: {
    "Verkenners gaan voor grotere uitdagingen, stevige activiteiten, tochten, engagement en zelfstandigheid binnen hun tak.":
      defaultSiteContent.branchVerkennersShortDescription,
  },
  branchVerkennersIntro: {
    "Verkenners zoeken avontuur met meer diepgang. Activiteiten worden groter, zelfstandiger en vragen meer inzet van de groep.":
      defaultSiteContent.branchVerkennersIntro,
  },
  branchVerkennersHighlights: {
    "Stevige activiteiten\nZelfstandigheid\nEngagement":
      defaultSiteContent.branchVerkennersHighlights,
  },
  branchVerkennersBlockOneText: {
    "Verkenners gaan op tocht, bouwen constructies, spelen intensere spelen en nemen vaker zelf initiatief in hun takwerking.":
      defaultSiteContent.branchVerkennersBlockOneText,
  },
  branchVerkennersBlockTwoTitle: {
    "Voor ouders": defaultSiteContent.branchVerkennersBlockTwoTitle,
  },
  branchVerkennersBlockTwoText: {
    "De leiding blijft nabij, maar geeft leden ook bewust ruimte om keuzes te maken, plannen uit te voeren en verantwoordelijkheid op te nemen.":
      defaultSiteContent.branchVerkennersBlockTwoText,
  },
  branchVerkennersBlockThreeTitle: {
    "Groei in de groep": defaultSiteContent.branchVerkennersBlockThreeTitle,
  },
  branchVerkennersBlockThreeText: {
    "Leden leren samenwerken onder druk, voor elkaar zorgen en hun plek vinden binnen een hechte groep.":
      defaultSiteContent.branchVerkennersBlockThreeText,
  },
  branchJinsHighlights: {
    "Eigen projecten\nVerantwoordelijkheid\nRichting leiding":
      defaultSiteContent.branchJinsHighlights,
  },
  branchJinsBlockThreeText: {
    "Jins leren plannen, communiceren, samenwerken en verantwoordelijkheid opnemen. Zo vormt deze tak een mooie brug naar leiding of ander engagement.":
      defaultSiteContent.branchJinsBlockThreeText,
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

  if (!sanitized.contactPhones) {
    sanitized.contactPhones = `Groepsleiding|${sanitized.contactPhone}`;
  }

  return sanitized;
}
