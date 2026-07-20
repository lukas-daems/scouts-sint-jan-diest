# Scouts Sint-Jan Berchmans website

Moderne website voor Scouts Sint-Jan Berchmans uit Diest. De site gebruikt vinext, React, Tailwind CSS, D1 voor beheerde content en R2 voor uploads.

## Lokaal starten

```bash
npm install
npm run dev
```

Open daarna `http://localhost:3000`.

## Beheeromgeving

Open lokaal:

```text
http://localhost:3000/admin
```

De admin gebruikt geen ingebouwde demo-wachtwoorden meer. Kopieer `.dev.vars.example` naar `.dev.vars` en vul minstens deze waarden in:

```text
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

Optionele takaccounts:

```text
KAPOENLEIDING_PASSWORD=...
WELPENLEIDING_PASSWORD=...
JONGVERKENNERLEIDING_PASSWORD=...
VERKENNERLEIDING_PASSWORD=...
JINLEIDING_PASSWORD=...
```

Gebruikersnamen:

- `groepsleiding`
- `kapoenleiding`
- `welpenleiding`
- `jongverkennerleiding`
- `verkennerleiding`
- `jinleiding`

Zet echte wachtwoorden nooit in GitHub. Online moeten dezelfde waarden als geheime hosting-variabelen worden ingesteld.

## Wat kan via de admin?

- algemene branding, logo en hoofdkleur
- homepage-inhoud, FAQ en contactblok
- takpagina's, leiding, programma en belangrijke data
- aparte pagina's zoals Dropping, Ontbijtmanden, Steak- en Burgerday, Verhuur en Oudercomite
- sfeerbeelden, collages en mediabibliotheek
- footer, sociale links en contactgegevens

## Foto's en uploads

Uploads gaan via de `MEDIA` R2-binding. In de admin kun je foto's uploaden, vervangen, uit de site halen en ongebruikte uploads opruimen via de mediabibliotheek.

De mediaopslag is bewust behouden. Ze is nodig omdat leiding zonder code taklogo's, leidingfoto's, sfeerbeelden en collagefoto's moet kunnen aanpassen. Gebruik vaste afbeeldingen in `public` alleen voor echte fallbackbeelden die bijna nooit wijzigen.

De zichtbare content wordt opgeslagen in D1 via de `DB` binding. Zonder juiste D1/R2-bindingen blijven de standaardteksten en placeholders zichtbaar.

## Onderhoudsprincipes

- Hou de publieke site oudervriendelijk: bezoekers mogen geen admin- of invulinstructies zien.
- Hou de admin leidingvriendelijk: gebruik gewone woorden, duidelijke blokken en zo weinig technische labels mogelijk.
- Voeg alleen adminvelden toe voor content die de leiding echt moet kunnen wijzigen.
- Verwijder oude componenten wanneer de bijhorende sectie niet meer zichtbaar is.
- Pas grote dashboardbestanden voorzichtig aan en controleer daarna altijd de build.
- Laat mediaopslag staan, maar ruim ongebruikte uploads regelmatig op via de mediabibliotheek.

## Belangrijke codeplekken

- `app/page.tsx`: homepage-opbouw.
- `app/[slug]/page.tsx`: algemene infopagina's zoals Verhuur, Links en Oudercomite.
- `app/takken/page.tsx`: overzicht van alle takken.
- `app/takken/[slug]/page.tsx`: aparte takpagina met leiding, programma en belangrijke data.
- `app/admin/AdminDashboard.tsx`: beheeromgeving.
- `app/lib/site-content-defaults.ts`: standaardteksten en fallbackcontent.
- `app/lib/branches.ts`: takconfiguratie en koppeling met adminvelden.
- `app/lib/site-pages.ts`: configuratie van aparte pagina's.
- `app/lib/gallery.ts`: vaste en extra fotocollages.
- `app/api/admin/*`: login, contentbeheer en uploadbeheer.

## Build controleren

```bash
npm run build
```
