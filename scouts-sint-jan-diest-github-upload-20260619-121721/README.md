# Scouts Sint-Jan Diest website

Moderne, responsive website voor Scouts Sint-Jan Diest uit Diest. De site is gebouwd als statische frontend met vinext, React en Tailwind CSS, op basis van de Sites-starter.

## Lokaal starten

```bash
npm install
npm run dev
```

## Build controleren

```bash
npm run build
```

## Beheeromgeving

Open lokaal:

```text
http://localhost:3000/admin
```

Demo-wachtwoord voor lokaal gebruik:

```text
scouts-admin
```

Dit staat in `.dev.vars`. Vervang dit wachtwoord voordat je de site publiek gebruikt.

Via de beheerpagina kun je onder meer aanpassen:

- hero titel en intro
- activiteitmomenten en adres
- inschrijvingslink
- kampteksten
- contactgegevens
- footer melding
- foto URLs

## Live bewerken op de site

1. Start de site met `npm run dev`.
2. Open `/admin`.
3. Log in met het beheerwachtwoord.
4. Klik op `Bekijk site`.
5. Rechtsonder verschijnt `Bewerk site`.

Daarmee kun je de site aanpassen terwijl je de gewone homepage blijft zien.

## Foto's beheren

In de live bewerkmodus kun je foto's uploaden voor:

- hero
- kampsectie
- fotogalerij

De upload gebruikt de `MEDIA` R2-binding. Lokaal werkt dit via de Sites/Vinext dev-server. Voor publicatie moet de Sites-omgeving ook een R2 bucket en de admin secrets krijgen.

## Belangrijke plekken om later aan te passen

- Logo: vervang `src/assets/logo.png`.
- Publieke logo fallback: vervang ook `public/assets/logo.png` als je de publieke asset direct wil gebruiken.
- Hero en gallery placeholders: zie `app/components/Hero.tsx`, `app/components/CampInfo.tsx` en `app/components/PhotoGallery.tsx`.
- Contactgegevens, activiteitendag, uren, lokaaladres en inschrijvingslink: pas aan via `/admin`.
- Formulierverzending: zie `app/components/ContactSection.tsx`.
