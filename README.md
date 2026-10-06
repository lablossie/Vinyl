# Platenkast

Een losse PWA om je vinylcollectie bij te houden: artiest &rarr; albums, favorieten,
een wenslijst, en AI-herkenning van een hoesfoto (artiest, albumtitel, jaar, genre, label).
Zelfde technische basis als je Wijnkelder-app (gedeelde pincode, Vercel KV, Claude AI),
maar een volledig eigen, losse app en database.

## 1. Zet de code op GitHub

1. Maak een **nieuwe, lege** GitHub-repository aan (bijv. `platenkast`).
2. Open **GitHub Desktop** &rarr; "Add" &rarr; "Add existing repository" en wijs deze map aan,
   of clone de lege repo lokaal en kopieer alle bestanden uit deze zip erin (met behoud van
   de mapstructuur: `api/`, `js/`, `js/render/`, `js/data/`, `lib/`, `css/`, `icons/`).
3. Commit en push (Publish repository / Push origin).

## 2. Importeer het project in Vercel

1. Ga naar [vercel.com](https://vercel.com) &rarr; **Add New... &rarr; Project**.
2. Kies de GitHub-repository die je net hebt aangemaakt.
3. Framework preset: **Other** (dit is een statische app + serverless functions, geen build-stap nodig).
4. Klik **Deploy**. De eerste deploy zal nog niet volledig werken &mdash; dat komt doordat de
   omgevingsvariabelen en de database nog moeten worden ingesteld (hieronder).

## 3. Stel de pincode en de AI-sleutel in

Ga in het Vercel-project naar **Settings &rarr; Environment Variables** en voeg toe:

| Naam | Waarde |
|---|---|
| `APP_PIN` | De pincode die je zelf kiest om de app te openen (bijv. `2847`) |
| `ANTHROPIC_API_KEY` | Je Claude API-sleutel van [console.anthropic.com](https://console.anthropic.com) |

Klik na het toevoegen op **Save**.

## 4. Koppel een database (Vercel KV)

De app slaat je collectie op in een gedeelde database, zodat die niet verdwijnt als je
de app opnieuw opent of op een ander apparaat gebruikt.

1. Ga naar het tabblad **Storage** van je project in Vercel.
2. Klik **Create Database** &rarr; kies **KV** (gebouwd op Upstash Redis) &rarr; geef een naam
   &rarr; **Create**.
3. Vercel vraagt daarna aan welk project de database gekoppeld moet worden &mdash; kies dit
   Platenkast-project. Dit zet automatisch de variabelen `KV_REST_API_URL` en
   `KV_REST_API_TOKEN` klaar.
4. Als het tabblad "Storage" er anders uitziet dan hierboven beschreven (Vercel wijzigt dit
   soms), zoek naar "KV", "Redis" of "Database" in de projectinstellingen &mdash; het idee is
   altijd: een Redis/KV-database aanmaken en aan dit project koppelen.

## 5. Redeploy

Elke keer dat je een omgevingsvariabele toevoegt of wijzigt, moet je opnieuw deployen:
**Deployments** &rarr; drie puntjes bij de laatste deploy &rarr; **Redeploy**.

## 6. Gebruiken

- Open de live URL, voer je `APP_PIN` in.
- Tik rechtsonder op **+** om een plaat toe te voegen: maak een foto van de hoes, en de app
  herkent via Claude automatisch artiest, album, jaar, genre en label. Controleer en vul aan,
  en sla op.
- Tik op een artiest om alle albums van die artiest te zien; tik op de ster om een favoriet
  te markeren (die hoes wordt dan getoond bij het hoofdscherm).
- **Wenslijst**: platen die je nog wilt hebben, nog niet in bezit.
- Rechtsboven op het hoofdscherm (tandwiel-icoon) kun je uitloggen of teruggaan naar de
  voorbeeldcollectie.
- **"Toevoegen aan beginscherm"** in je mobiele browser (Chrome op Android: menu &rarr;
  "App installeren") installeert de app als PWA met eigen icoon.

## Over de voorbeeldcollectie

De app start met wat voorbeeldplaten (Mumford & Sons, The Lumineers, Hozier, Noah Kahan,
Amble, Kingfishr, Fleet Foxes) zodat je meteen kan rondkijken. Voor Amble en Kingfishr zijn
bewust geen specifieke albumtitels verzonnen (daar was ik niet zeker van) &mdash; vervang die
plaatshouders gerust door je eigen platen. Via het instellingenmenu kun je altijd terug naar
deze voorbeeldcollectie, of je verwijdert gewoon alle voorbeeldplaten zelf.

## Bouwnotitie: Android-terugknop

De app gebruikt URL-hash-navigatie (`#/artiest/...`, `#/album/...`, enz.). Browsers en PWA's
voegen elke hash-wijziging automatisch toe aan de navigatiegeschiedenis, dus de hardware-
terugknop op Android (en het terug-gebaar) gaat vanzelf één scherm terug in de app in
plaats van de app te sluiten &mdash; zonder extra code. Dit is al ingebouwd in `js/router.js`.

## Mapstructuur

```
index.html, manifest.json, sw.js   - app-schil
css/style.css                      - alle styling
js/                                 - client-code (router, state, auth, render per scherm)
js/data/seedRecords.js              - voorbeelddata (ook server-side hergebruikt)
api/inventory.js                    - GET/POST van je collectie (Vercel KV)
api/recognize.js                    - AI-hoesherkenning (Claude + web search)
lib/                                 - gedeelde server-helpers (pincode-check, KV-laag)
icons/                               - gegenereerde app-icoontjes
```
