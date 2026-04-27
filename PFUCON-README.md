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
| `SEO-INVENTORY.md` | Vollständiges SEO-Feature-Inventar |
| `SEO-CHECKLIST.md` | Pro-Kunden Go-Live Checkliste |
| `SEO-VALIDATION.md` | Validation-Protokoll (Lighthouse, Rich Results, etc.) |
| `COOKIE-INVENTORY.md` | Cookie-Audit des Default-Stacks |
| `COOKIE-DECISION.md` | Entscheidungsbaum Cookie-Banner ja/nein |
| `COOKIE-CHECKLIST.md` | Pro-Kunden DSGVO Go-Live Checkliste |
| `COOKIE-BANNER-SETUP.md` | Consent Mode v2 + Banner-Bibliothek-Integration |

---

## SEO-Foundation (Phase 8)

### Aktive SEO-Features

| Feature | Implementierung |
|---------|----------------|
| Meta-Tags (title, description, canonical, robots) | `Metadata.astro` via `@astrolib/seo` |
| Open Graph + Twitter Cards | `Metadata.astro` |
| Default OG-Image aus Sanity | `PfuconSEO.astro` → `siteSettings.defaultOgImage` |
| JSON-LD Slot (seitenspezifisch) | `PfuconSEO.astro` prop `jsonLd` oder `<slot name="jsonLd">` |
| Organization / LocalBusiness Schema | `OrganizationSchema.astro` (automatisch in jedem Layout) |
| Article Schema | `ArticleSchema.astro` (manuell in Blog-Post-Layout einbinden) |
| FAQ Schema | `FAQSchema.astro` (manuell bei FAQ-Sektionen einbinden) |
| Breadcrumb Schema | `BreadcrumbSchema.astro` (manuell auf Sub-Pages einbinden) |
| XML-Sitemap | `@astrojs/sitemap` — `/sitemap-index.xml` |
| robots.txt (dynamisch) | `src/pages/robots.txt.ts` — enthält Sitemap-URL + AI-Crawler-Blöcke |
| RSS Feed | `src/pages/rss.xml.ts` + `<link rel="alternate">` im `<head>` |
| llms.txt | `src/pages/llms.txt.ts` — AI-Crawler-Steuerung |
| Google Search Console Verify | `SiteVerification.astro` — config.yaml oder `PUBLIC_GSC_VERIFICATION` |
| Bing Webmaster Verify | `SiteVerification.astro` — `PUBLIC_BING_VERIFICATION` |
| Plausible Analytics | `Plausible.astro` — aktiviert via `PUBLIC_PLAUSIBLE_DOMAIN` |
| SmartImage | `SmartImage.astro` — lazy/async defaults |

### Was pro Kundenprojekt zu befüllen ist

1. **Sanity `siteSettings`-Dokument** (wichtigster Schritt):
   - Unternehmensname, businessType, Adresse, Telefon, Logo
   - Default OG-Bild (1200×628)
   - Social-Profile-URLs
2. **Env-Vars auf Netlify** (nach SETUP-NEW-CLIENT.md):
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_GSC_VERIFICATION` oder DNS-Verify
   - `PUBLIC_BING_VERIFICATION`
   - `PUBLIC_PLAUSIBLE_DOMAIN`
3. **Sanity Homepage-Dokument**: SEO Titel + Meta-Description setzen

### SEO-relevante Env-Vars

| Variable | Pflicht | Beschreibung |
|----------|---------|--------------|
| `PUBLIC_SANITY_PROJECT_ID` | Ja | Sanity Project ID |
| `PUBLIC_SANITY_DATASET` | Nein | Default: `production` |
| `PUBLIC_GSC_VERIFICATION` | Nein | Google Search Console Meta-Verify |
| `PUBLIC_BING_VERIFICATION` | Nein | Bing Webmaster Tools Verify |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Nein | Plausible Analytics Domain |
| `PUBLIC_PLAUSIBLE_URL` | Nein | Self-hosted Plausible URL |

### AI-Crawler Kontrolle (robots.txt)

`src/pages/robots.txt.ts` enthält auskommentierte Blöcke für GPTBot, ClaudeBot,
Google-Extended und Applebot-Extended. Für Kunden die AI-Training-Crawling
einschränken wollen: Blöcke einkommentieren und neu deployen.

### llms.txt

Folgt der [llmstxt.org](https://llmstxt.org) Spezifikation. Wird automatisch
aus Sanity-Daten generiert (Sitename, Tagline, Description + Blog-Posts der
letzten 6 Monate). USP gegenüber WordPress-Konkurrenten: die meisten WP-Sites
haben keine llms.txt.

---

## DSGVO & Cookie-Foundation (Phase 9)

### Cookiefreier Default-Stack

Der PfuCon Starter ist by default **cookiefrei**. Beim ersten Seitenaufruf werden **0 Cookies** gesetzt.

| Bereich | Lösung | Status |
|---------|--------|--------|
| Schriften | `@fontsource-variable/inter` — lokal, kein Google Fonts CDN | ✅ |
| Analytics | Plausible (cookiefrei) via `PUBLIC_PLAUSIBLE_DOMAIN` | ✅ opt-in |
| YouTube | `LiteYouTube.astro` — Click-to-Load, `youtube-nocookie.com` | ✅ |
| Karten | `StaticMap.astro` (0 Requests) + `OpenStreetMap.astro` (Click-to-Load) | ✅ |
| Kontaktformular | `ContactForm.astro` — Netlify Forms, Honeypot, kein reCAPTCHA | ✅ |
| Cookie-Banner | `CookieBannerSlot.astro` — inaktiv by default | ✅ opt-in |

### Neue DSGVO-Komponenten

| Datei | Beschreibung |
|-------|-------------|
| `src/components/media/LiteYouTube.astro` | YouTube Click-to-Load (Poster + Play-Button) |
| `src/components/media/StaticMap.astro` | Adresskarte ohne externe Requests |
| `src/components/media/OpenStreetMap.astro` | OSM-Embed mit Click-to-Load-Gate |
| `src/components/forms/ContactForm.astro` | Netlify Forms + Honeypot + Datenschutz-Checkbox |
| `src/components/common/CookieBannerSlot.astro` | Slot für Cookie-Banner (env-gesteuert) |
| `src/pages/datenschutz.astro` | Datenschutzerklärung-Stub (TODO-Felder befüllen) |
| `src/pages/impressum.astro` | Impressum-Stub (TODO-Felder befüllen) |

### Cookie-Banner aktivieren

Nur nötig wenn Google Analytics, Google Ads oder andere Tracking-Dienste aktiv sind:

```bash
# Netlify Env-Var:
PUBLIC_COOKIE_BANNER_ENABLED=true
```

Dann eigene Banner-Bibliothek in `Layout.astro` via `<CookieBannerSlot>` einbinden.
Details: `COOKIE-BANNER-SETUP.md`

### DSGVO-Entscheidungsbaum

`COOKIE-DECISION.md` — Schnellcheck: Wann braucht welcher Kunde einen Cookie-Banner?

### DSGVO-relevante Env-Vars

| Variable | Default | Beschreibung |
|----------|---------|--------------|
| `PUBLIC_COOKIE_BANNER_ENABLED` | `false` | Cookie-Banner aktivieren |
| `PUBLIC_PLAUSIBLE_DOMAIN` | leer | Plausible Analytics aktivieren |

### DSGVO-Dokumente

| Dokument | Inhalt |
|----------|--------|
| `COOKIE-INVENTORY.md` | Vollständiger Cookie-Audit des Default-Stacks |
| `COOKIE-DECISION.md` | Entscheidungsbaum: Banner ja/nein? |
| `COOKIE-CHECKLIST.md` | Pro-Kunden Go-Live Checkliste (DSGVO) |
| `COOKIE-BANNER-SETUP.md` | Consent Mode v2 + Banner-Integration Anleitung |
