# PfuCon Starter — Technische Dokumentation

Internes Referenz-Dokument für Linus Pfurtscheller / Pfurtscheller Consulting.
Beschreibt Architektur, Widget-Mapping und den Workflow für neue Kundenprojekte.

---

## Architektur-Übersicht

```
pfucon-starter-astrowind/
├── src/
│   ├── pages/
│   │   ├── index.astro          ← Sanity-betrieben (Page Builder)
│   │   ├── about.astro          ← Markdown/statisch (NICHT Sanity)
│   │   ├── services.astro       ← Markdown/statisch
│   │   ├── contact.astro        ← Markdown/statisch
│   │   └── [...]blog/           ← Markdown/MDX (NICHT Sanity)
│   ├── components/
│   │   ├── widgets/             ← Original AstroWind — NICHT ANFASSEN
│   │   └── sanity/
│   │       └── WidgetRenderer.astro   ← Sanity → Widget Mapper
│   └── lib/
│       ├── sanity.ts            ← Sanity Client + urlFor()
│       └── queries.ts           ← GROQ Queries + TypeScript-Typen
├── studio/                      ← Sanity Studio v3
│   ├── sanity.config.ts         ← projectId = PLACEHOLDER_PROJECT_ID
│   └── schemaTypes/             ← Ein Schema-File pro Widget-Typ
└── scripts/
    ├── setup-new-client.sh      ← Onboarding-Skript für neuen Kunden
    └── create-sample-content.mjs
```

### Designprinzip

**Sanity ist NUR für `/` (Homepage).** Alle anderen Seiten bleiben statisches
Markdown/Astro. Das hält den Wartungsaufwand minimal und ermöglicht maximale
Flexibilität für die Startseite ohne Blog-Posts oder Sub-Pages zu berühren.

```
Besucher → Netlify CDN → Astro Static Build
                             ↓
                     Homepage: GROQ Query → Sanity API
                     Blog: src/content/post/*.md
                     Sub-Pages: *.astro / *.md (statisch)
```

---

## Widget-Mapping: Sanity Schema → AstroWind Komponente

| Sanity `_type` | AstroWind Komponente | Variante |
|----------------|---------------------|----------|
| `heroWidget` | `Hero.astro` | — |
| `hero2Widget` | `Hero2.astro` | — |
| `heroTextWidget` | `HeroText.astro` | — |
| `noteWidget` | `Note.astro` | — |
| `featuresWidget` | `Features.astro` | variant: `features` |
| `featuresWidget` | `Features2.astro` | variant: `features2` |
| `featuresWidget` | `Features3.astro` | variant: `features3` |
| `contentWidget` | `Content.astro` | — |
| `stepsWidget` | `Steps.astro` | variant: `steps` |
| `stepsWidget` | `Steps2.astro` | variant: `steps2` |
| `faqsWidget` | `FAQs.astro` | — |
| `statsWidget` | `Stats.astro` | — |
| `callToActionWidget` | `CallToAction.astro` | — |
| `testimonialsWidget` | `Testimonials.astro` | — |
| `pricingWidget` | `Pricing.astro` | — |
| `brandsWidget` | `Brands.astro` | — |
| `blogLatestPostsWidget` | `BlogLatestPosts.astro` | — |
| `contactWidget` | `Contact.astro` | — |

**Shared Sanity-Objekte:**
- `ctaButton` — Button/Link (variant, text, href, icon, target)
- `widgetItem` — Generisches Item (title, description, icon, image, callToAction)

---

## Neues Kundenprojekt — Workflow

```
1. git clone → cd neues-projekt → npm install
2. bash scripts/setup-new-client.sh
   ↳ fragt: Kundenname, Sanity Project ID, Dataset, API Token
   ↳ patcht: studio/sanity.config.ts, .env
   ↳ deployt: Sanity Schema
   ↳ anlegt: Sample homePage-Dokument
3. npm run dev  +  cd studio && npm run dev
4. Inhalte in Studio eingeben → auf localhost:4321 prüfen
5. Netlify: Repo importieren, Env-Vars setzen, Deploy
6. Webhook einrichten (DEPLOYMENT.md)
7. Domain verbinden, Go-Live Checkliste (SETUP-NEW-CLIENT.md)
```

Gesamtaufwand nach dem ersten Mal: **~30 Minuten pro Kunde**

---

## Bekannte Limitierungen

| Bereich | Limitierung | Erweiterbar? |
|---------|-------------|--------------|
| Blog | Bleibt Markdown (`src/content/post/`) | Ja, via Sanity Blog-Schema (Phase 2+) |
| Sub-Pages | `/about`, `/services` etc. sind Astro/Markdown | Ja, bei Bedarf |
| Mehrsprachigkeit | Nicht implementiert | Ja, via Astro i18n + Sanity Localization |
| Blog-Kommentare | Nicht vorhanden | Ja, via Utterances oder ähnlich |
| E-Commerce | Nicht vorhanden | Außerhalb Scope |
| A/B-Testing | Nicht vorhanden | Ja, via Netlify Edge Functions |
| Medien-CDN | Sanity CDN (für Homepage-Bilder) + Astro Assets | Sanity CDN ist kostenlos bis 1M requests |

---

## Sanity Studio — Schnellreferenz

```bash
# Studio starten (lokal)
cd studio && npm run dev
# → http://localhost:3333

# Schema deployen (nach Schema-Änderungen)
cd studio && npx sanity deploy

# Mit anderem Projekt arbeiten
cd studio && npx sanity login
```

**Studio-URL nach Deploy:** `https://<project-name>.sanity.studio/`

---

## Fallback-Verhalten (ohne Sanity)

Das Projekt baut und läuft auch ohne Sanity-Konfiguration:

| Zustand | Verhalten |
|---------|-----------|
| `PUBLIC_SANITY_PROJECT_ID` nicht gesetzt | Gelber Banner: "Sanity nicht konfiguriert" |
| Project ID gesetzt, aber kein homePage-Dokument in Sanity | Roter Banner: "Keine Homepage-Daten" |
| Sanity konfiguriert + homePage-Dokument vorhanden | Normale Seite mit Sanity-Daten |

Das erlaubt es, das Repo direkt nach dem Klonen zu starten und zu bauen,
ohne einen Sanity-Account einzurichten.

---

## Umgebungsvariablen

Alle Public-Vars sind mit `PUBLIC_` prefixed und damit im Browser sichtbar — das ist gewollt,
da alle Daten ohnehin public sind (read-only Sanity Dataset).

| Variable | Pflicht | Beschreibung |
|----------|---------|--------------|
| `PUBLIC_SANITY_PROJECT_ID` | Ja | Sanity Project ID |
| `PUBLIC_SANITY_DATASET` | Nein | Default: `production` |
| `PUBLIC_GSC_VERIFICATION` | Nein | Google Search Console Meta-Verify |
| `PUBLIC_BING_VERIFICATION` | Nein | Bing Webmaster Tools Verify |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Nein | Plausible Analytics Domain |

`.env.example` liegt im Repo als Vorlage.

---

## Datei-Referenz

| Datei | Zweck |
|-------|-------|
| `src/pages/index.astro` | Homepage — fetcht von Sanity, rendert WidgetRenderer |
| `src/pages/_index.original.astro` | Backup des Original-AstroWind (nicht deployed) |
| `src/lib/sanity.ts` | Sanity Client + urlFor() Helper |
| `src/lib/queries.ts` | GROQ homePageQuery + fetchHomePage() |
| `src/components/sanity/WidgetRenderer.astro` | Widget-Dispatcher |
| `studio/sanity.config.ts` | Studio-Config (projectId patchen!) |
| `studio/schemaTypes/homePage.ts` | Page Builder Dokument-Schema |
| `studio/schemaTypes/shared.ts` | Geteilte Objekt-Typen (ctaButton, widgetItem) |
| `netlify.toml` | Netlify Build + Headers |
| `DEPLOYMENT.md` | Webhook-Setup Anleitung |
| `SETUP-NEW-CLIENT.md` | Schritt-für-Schritt Onboarding |
| `WIDGETS-INVENTORY.md` | Vollständiges Widget-Props-Inventar |
| `scripts/setup-new-client.sh` | Onboarding-Automatisierung |
