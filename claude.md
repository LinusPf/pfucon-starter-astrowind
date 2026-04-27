# PfuCon AstroWind Starter — Agent Working Brief

**Repo:** `LinusPf/pfucon-starter-astro` (Fork von `onwidget/astrowind`)
**Ziel:** Default-Starter für PfuCon-Astro-Projekte mit minimaler Sanity-Integration für Homepage-Marketing-Sektionen und SEO-Komplettausstattung
**Stack:** Astro 5 + Tailwind + Sanity (nur Homepage) + Netlify
**Owner:** PfuCon

---

## Was du bauen sollst

Dieser Fork wird die Basis für alle künftigen PfuCon-Kundenprojekte. Du arbeitest im Fork-Repo und richtest den Starter so ein, dass er per `git clone` + Sanity-Project-ID-Swap pro Kunde wiederverwendbar ist.

**Architektur:** AstroWind bleibt zu 95% im Original. Nur die **Homepage (`src/pages/index.astro`)** wird auf Sanity umgestellt. Alles andere (Blog, Sub-Pages, Config) bleibt wie gehabt.

**Warum minimal:** schnelle Onboarding-Zeit für neue Kunden, niedrigster Wartungsaufwand, später erweiterbar wenn Bedarf da ist.

**SEO-Foundation (Phase 8):** der Starter wird ranking-bereit out-of-the-box. Kunden müssen nur noch Domain + Schema-Daten einsetzen.

---

## Aufgaben in Reihenfolge

### Phase 1 — Repo-Vorbereitung

1. **Branch erstellen:** `feature/sanity-homepage-integration`
2. **Inventar machen:** Welche Widgets nutzt `src/pages/index.astro`? Liste in `WIDGETS-INVENTORY.md` festhalten (erwartet: Hero, Note, Features, Content, Steps, FAQs, Stats, CallToAction, Testimonials, BlogLatestPosts, etc. — ca. 12-15 Stück)
3. **Original-Homepage sichern:** Kopiere `src/pages/index.astro` → `src/pages/_index.original.astro` (als Referenz, nicht deployed)
4. **README erweitern:** kurzer Block oben "PfuCon-Fork — Sanity-Integration für Homepage. Original-AstroWind-Doku ab Zeile X."

### Phase 2 — Sanity-Setup

1. **Sanity-Studio im Repo anlegen:** Ordner `/studio` mit `npm create sanity@latest -- --project-template clean --output-path studio`
   - Project-ID als Platzhalter `PLACEHOLDER_PROJECT_ID` lassen (wird pro Kunde gesetzt)
   - Dataset: `production`
2. **Schema-Files erstellen** in `studio/schemaTypes/` für **alle 15 AstroWind-Widgets**, jedes als eigener Object-Type:
   - `heroWidget.ts`
   - `noteWidget.ts`
   - `featuresWidget.ts`
   - `contentWidget.ts`
   - `stepsWidget.ts`
   - `faqsWidget.ts`
   - `statsWidget.ts`
   - `callToActionWidget.ts`
   - `testimonialsWidget.ts`
   - `pricingWidget.ts`
   - `brandsWidget.ts`
   - `blogLatestPostsWidget.ts` *(verlinkt nur, Content bleibt Markdown)*
   - `headlineWidget.ts`
   - `featureWidget.ts` *(Single, nicht Plural — schaue ins Original was vorhanden ist)*
   - Plus alle weiteren die im Inventar von Phase 1 stehen
3. **Page-Builder-Schema:** `homePage.ts` mit Field `pageBuilder` als `array of [heroWidget, noteWidget, ...]` — der Kunde kann Widgets in beliebiger Reihenfolge zusammenstecken
4. **Schema-Felder pro Widget:** schaue dir die jeweilige Widget-Komponente in `src/components/widgets/*.astro` an und mappe **alle Props** auf Sanity-Fields. Beispiel Hero: `title`, `subtitle`, `tagline`, `actions[]`, `image{}`, `content`. Verwende portableText für lange Texte, image-Type für Bilder.

### Phase 3 — Astro-Sanity-Anbindung

1. **Sanity-Client installieren:**
   ```bash
   npm install @sanity/client @sanity/image-url
   ```
2. **Client-Setup:** `src/lib/sanity.ts` mit:
   - `client` (read-only, public dataset)
   - `urlFor()` Helper für Bilder
   - Project-ID + Dataset aus `import.meta.env`
3. **`.env.example` erweitern:**
   ```
   PUBLIC_SANITY_PROJECT_ID=
   PUBLIC_SANITY_DATASET=production
   ```
4. **GROQ-Query schreiben:** `src/lib/queries.ts` mit `homePageQuery` — fetcht das `homePage`-Dokument inklusive `pageBuilder` mit allen Widget-Referenzen
5. **Widget-Mapper:** `src/components/sanity/WidgetRenderer.astro` — nimmt das `pageBuilder`-Array, mapped jeden Widget-Type auf die entsprechende AstroWind-Komponente, übergibt Props

### Phase 4 — Homepage umstellen

1. **`src/pages/index.astro` neu schreiben:**
   - Holt `homePageQuery` von Sanity
   - Rendert `<WidgetRenderer pageBuilder={data.pageBuilder} />`
   - Fallback: wenn keine Sanity-Daten → zeige Banner "Sanity nicht konfiguriert, siehe README"
2. **Build-Verhalten:** stelle sicher, dass der Build NICHT crasht wenn Sanity-Env-Vars fehlen (für initialen Fork-Test ohne Sanity)

### Phase 5 — Netlify-Konfiguration

1. **`netlify.toml`** erstellen mit:
   - Build-Command: `npm run build`
   - Publish-Dir: `dist`
   - Build-Hook-Plugin für Sanity-Webhook-Rebuilds
2. **Webhook-Doku:** in `DEPLOYMENT.md` dokumentieren wie man den Sanity-Webhook auf Netlify-Build-Hook anbindet (Sanity Studio → API → Webhooks → URL aus Netlify Build Hooks)

### Phase 6 — Setup-Skript

1. **`scripts/setup-new-client.sh`** schreiben, das:
   - Nach Kundenname fragt
   - Neues Sanity-Projekt anlegt (via `sanity init` oder Sanity-CLI)
   - `.env` automatisch füllt
   - Schema deployed (`sanity deploy`)
   - Erste Homepage als Draft mit Sample-Widgets anlegt
2. **Doku in `SETUP-NEW-CLIENT.md`** als Schritt-für-Schritt-Anleitung für Linus

### Phase 7 — Dokumentation & Test

1. **`PFUCON-README.md`** im Repo-Root mit:
   - Architektur-Übersicht (Astro + Sanity nur Homepage, Rest Markdown)
   - "Fork für neuen Kunden"-Workflow
   - Liste aller Widgets mit Sanity-Schema-Mapping
   - Bekannte Limitierungen (Blog ist Markdown, Sub-Pages sind Markdown)
2. **End-to-End-Test:**
   - Sanity-Studio lokal starten (`cd studio && npm run dev`)
   - Erstes Widget (Hero) befüllen
   - Astro-Dev-Server starten, prüfen dass Hero von Sanity rendert
   - Build durchlaufen lassen, prüfen dass keine Errors

### Phase 8 — SEO-Foundation

Diese Phase macht den Starter zum SEO-Komplettpaket. Nach Phase 8 ranking-bereit out-of-the-box, Kunden müssen nur noch ihre Domain + Schema-Daten einsetzen.

**Wichtig:** AstroWind hat bereits eine SEO-Grundausstattung (`astro-seo`-Integration, Meta-Tags im `Layout.astro`, Open Graph). **Nicht doppelt bauen** — Inventar machen, dann gezielt erweitern.

#### 8.1 SEO-Inventar

1. **Existierende SEO-Features dokumentieren** in `SEO-INVENTORY.md`:
   - Welche Meta-Tags werden bereits in `src/layouts/Layout.astro` gesetzt?
   - Wird `astro-seo` schon verwendet? In welchen Komponenten?
   - Existiert `@astrojs/sitemap` in der `astro.config.ts`?
   - Wie wird Open Graph aktuell behandelt?
2. **Lücken identifizieren** und in derselben Datei als Checkliste festhalten

#### 8.2 Sitemap & robots.txt

1. **`@astrojs/sitemap`** prüfen/installieren in `astro.config.ts`:
   - `site`-URL muss gesetzt sein (aus Env-Var oder Config)
   - Filter-Funktion für Sanity-Draft-Pages und Utility-Routes (`/404`, `/admin/*`)
2. **Dynamisches robots.txt** als `src/pages/robots.txt.ts` erstellen:
   - Verweist auf `${site}/sitemap-index.xml`
   - Default: `User-agent: * / Allow: /`
   - Kommentierte Blöcke für `GPTBot`, `ClaudeBot`, `Google-Extended` — pro Kunde aktivierbar
   - Kein statisches `public/robots.txt` mehr (falls vorhanden, löschen)

#### 8.3 SEO-Komponente erweitern

1. **`src/components/common/PfuconSEO.astro`** als Wrapper um `astro-seo` bauen, der zusätzlich:
   - Canonical URL aus `Astro.url + Astro.site` automatisch berechnet
   - JSON-LD-Slot für Page-spezifisches Schema akzeptiert
   - Default Open Graph Image aus Sanity-Settings zieht (mit Fallback)
2. **In `Layout.astro` einbauen** statt direktem `astro-seo`-Aufruf
3. **TypeScript-Props** definieren, damit jede Page klar weiß was sie übergeben kann/muss

#### 8.4 Structured Data / JSON-LD

1. **Globales `Organization`/`LocalBusiness`-Schema** als Komponente `src/components/seo/OrganizationSchema.astro`:
   - Daten aus Sanity `siteSettings`-Singleton (Name, Logo, Adresse, Telefon, Öffnungszeiten, Social-Profiles)
   - In jedes Layout einbinden (Footer-Bereich, vor `</body>`)
2. **Page-spezifische Schema-Komponenten** in `src/components/seo/`:
   - `ArticleSchema.astro` — für Blog-Posts (existieren als Markdown)
   - `FAQSchema.astro` — für FAQ-Widgets, kann an AstroWind-FAQs-Widget gekoppelt werden
   - `BreadcrumbSchema.astro` — für Sub-Pages
3. **Sanity-Schema erweitern** in `studio/schemaTypes/`:
   - `siteSettings.ts` (Singleton) mit Org-Schema-Feldern: `businessType` (LocalBusiness/Restaurant/NGO/Organization), Adresse, Kontakt, Öffnungszeiten als Array, Social-Links
   - `seoFields.ts` als reusable Object-Type für jeden Page-Type (custom Title, Description, OG-Image, noindex-Flag)

#### 8.5 llms.txt

1. **`src/pages/llms.txt.ts`** dynamisch generieren:
   - Aus Sanity-Settings: Site-Name, Tagline, Description
   - Liste der Hauptseiten (Sanity-Pages + Markdown-Pages)
   - Optional: Blog-Posts der letzten 6 Monate
2. **Format:** [llmstxt.org](https://llmstxt.org) Spezifikation folgen
3. **Doku in `PFUCON-README.md`:** wofür llms.txt da ist (AI-Crawler-Steuerung), warum das ein USP ist gegenüber WP-Mitbewerbern

#### 8.6 RSS Feed

1. **`@astrojs/rss`** prüfen — AstroWind hat das wahrscheinlich schon
2. Falls nein: `src/pages/rss.xml.ts` erstellen, fetcht aus `src/content/post/`
3. RSS-Link in `<head>` setzen (`<link rel="alternate" type="application/rss+xml">`)

#### 8.7 Image SEO

1. **Sanity-Image-Schema** härten:
   - `alt`-Feld als **required** in jedem Image-Field
   - Validation-Message: "Alt-Text ist Pflicht für Barrierefreiheit und SEO"
2. **`urlFor()` Helper erweitern** um automatisches `width`/`height` Setting (verhindert CLS)
3. **`<Image>`-Default-Props** in einem Wrapper `src/components/common/SmartImage.astro`:
   - `loading="lazy"` ab dem zweiten Image
   - `decoding="async"`
   - WebP/AVIF automatisch
4. **Build-Check:** Custom-Astro-Hook der bei `astro build` warnt wenn ein Bild ohne Alt-Text rendered wird

#### 8.8 Performance-Defaults

1. **Font-Loading:** sicherstellen dass `font-display: swap` in jedem Webfont gesetzt ist
2. **Hydration-Audit:** alle `client:*`-Direktiven prüfen — viele AstroWind-Widgets brauchen keine Hydration. Default zu `client:visible` oder ganz entfernen wenn nicht interaktiv
3. **Critical CSS:** Astros Default reicht, keine zusätzlichen Tools

#### 8.9 Search Console Vorbereitung

1. **Verifizierungs-Snippet-Slot** im Layout vorbereiten:
   - Env-Var `PUBLIC_GSC_VERIFICATION` für Meta-Tag-Verify (Fallback wenn DNS-Verify nicht möglich)
   - Bing Webmaster: `PUBLIC_BING_VERIFICATION`
2. **Doku in `SETUP-NEW-CLIENT.md`:** Schritt-für-Schritt-Anleitung
   - Search Console Property hinzufügen
   - DNS-TXT-Record auf Plesk eintragen (bevorzugt)
   - Sitemap einreichen
   - Bing Webmaster Tools (gleicher Prozess, wegen ChatGPT/Copilot wichtig)

#### 8.10 Analytics-Integration

1. **Plausible-Snippet** als optionaler Component `src/components/analytics/Plausible.astro`:
   - Aktiviert via Env-Var `PUBLIC_PLAUSIBLE_DOMAIN`
   - Self-hosted Plausible-URL als zweite Env-Var (für später wenn Linus eigenen Plausible-Server hat)
2. **Google Tag Manager** NICHT als Default — nur bei expliziter Anfrage
3. **Im Layout** conditional rendern: nur wenn Env-Var gesetzt

#### 8.11 Testing & Validation

1. **Build durchlaufen lassen** und prüfen:
   - Sitemap unter `/sitemap-index.xml` erreichbar
   - robots.txt verweist korrekt auf Sitemap
   - llms.txt erreichbar und valide
   - JSON-LD im HTML-Source der Homepage präsent
2. **External Validation:**
   - Google Rich Results Test gegen Test-Deployment laufen lassen
   - Schema Markup Validator von Schema.org
   - Lighthouse-Score: SEO-Sektion muss 100/100 sein, Performance 95+
3. **Ergebnisse in `SEO-VALIDATION.md`** dokumentieren

#### 8.12 Dokumentation

1. **`PFUCON-README.md`** um SEO-Sektion erweitern:
   - Welche SEO-Features sind aktiv
   - Was muss pro Kundenprojekt befüllt werden (Sanity-Settings)
   - Welche Env-Vars sind SEO-relevant
2. **`SEO-CHECKLIST.md`** als Checkliste für Linus pro neuem Kundenprojekt:
   - DNS-Verify in Search Console
   - Bing Webmaster Tools angelegt
   - Sitemap eingereicht
   - Sanity Site-Settings vollständig
   - LocalBusiness-Schema im Sanity befüllt
   - Erste FAQ-Sektion mit FAQPage-Schema
   - llms.txt mit echten Inhalten gefüllt
   - Plausible aktiv
   - Lighthouse-Test grün

---

## Wichtige Constraints (Gesamt-Projekt)

- **Keine Breaking Changes** an AstroWind-Originalkomponenten in `src/components/widgets/`. Widgets bleiben unangetastet, nur die Datenquelle ändert sich.
- **Blog bleibt Markdown.** Nicht in `src/content/post/` rumpfuschen.
- **Sub-Pages (`/about`, `/services` etc.) bleiben Markdown.** Sanity ist NUR für `/`.
- **TypeScript strict.** Alle Sanity-Schemas und Queries getypt.
- **Keine Lock-in-Abhängigkeiten.** Wenn Linus später Sanity rauswerfen will, muss `_index.original.astro` als Drop-in-Ersatz funktionieren.
- **Lean over feature-rich.** Wenn ein Schema-Feld nicht klar gebraucht wird → weglassen. Linus kann später nachschärfen.
- **Commit-Messages:** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`). Pro Phase 1 Commit, am Ende squash.

### Spezifisch für Phase 8

- **Nicht überschreiben** was AstroWind bereits an SEO mitbringt — erweitern, nicht ersetzen
- **`astro-seo` bleibt die Basis** — Wrapper drumherum, kein Reimplementieren
- **Sanity-Felder bleiben optional** wo möglich — Site soll auch ohne befüllte SEO-Settings bauen können
- **Keine zusätzlichen Premium-Plugins** ohne Linus' Freigabe (z.B. `@jdevalk/astro-seo-graph` ist mächtig, aber Lock-in)
- **Performance darf nicht leiden** — jeder neue `<script>` und jedes neue `<link>` muss begründet sein

---

## Was du NICHT tun sollst

- Sanity-Schemas für Blog-Posts erstellen → kommt evtl. später
- Multilingual/i18n einbauen → nicht in Scope, ggf. später
- Custom Studio-UI bauen → Default-Studio reicht
- AstroWind-Widgets refactoren oder "verbessern" → bleiben Original
- Eigene Komponenten erfinden, die nicht im Original-AstroWind sind
- Tailwind-Theme-Variablen ändern → das passiert pro Kundenprojekt, nicht im Starter

---

## Definition of Done

### Phase 1-7 (Sanity-Integration)
- [ ] Alle 15 AstroWind-Widgets als Sanity-Schemas vorhanden
- [ ] Homepage rendert Sanity-Daten korrekt
- [ ] Build läuft grün, auch ohne Sanity-Env-Vars (Fallback funktioniert)
- [ ] `scripts/setup-new-client.sh` funktioniert end-to-end mit einem Test-Kunden namens "demo"
- [ ] `PFUCON-README.md` und `SETUP-NEW-CLIENT.md` vollständig
- [ ] Test-Deployment auf Netlify läuft, Homepage zeigt Sanity-Content

### Phase 8 (SEO-Foundation)
- [ ] `SEO-INVENTORY.md` listet alle existierenden und neu gebauten SEO-Features
- [ ] Sitemap erreichbar, robots.txt verweist korrekt
- [ ] `PfuconSEO.astro`-Wrapper ersetzt direkten `astro-seo`-Aufruf in Layout
- [ ] Globales Organization-Schema rendered im HTML
- [ ] Mindestens drei Schema-Komponenten verfügbar (Organization, FAQ, Article)
- [ ] llms.txt dynamisch generiert
- [ ] Sanity `siteSettings`-Singleton mit Schema-Feldern existiert
- [ ] Image-Alt als required im Sanity-Schema
- [ ] Plausible-Component vorhanden, env-gesteuert
- [ ] Search Console + Bing Verify-Slots vorhanden
- [ ] Lighthouse SEO 100/100 auf Test-Deployment
- [ ] Google Rich Results Test bestanden
- [ ] `SEO-CHECKLIST.md` für Pro-Kunden-Setup vorhanden


### Phase 9 — Cookie & DSGVO-Foundation

Diese Phase macht den Starter **standardmäßig cookie-frei und DSGVO-konform**, sodass die meisten Kundenprojekte **kein Cookie-Banner brauchen**. Das ist ein zentrales Verkaufsargument von PfuCon gegenüber WordPress-Mitbewerbern.

**Strategische Grundlage:** ein frisches Astro-Projekt setzt von Haus aus keine Cookies. Cookies kommen erst durch Drittanbieter (GA4, YouTube-Embeds, Google Fonts, Google Maps). Wenn der Starter diese Drittanbieter durch datenschutzkonforme Alternativen ersetzt, fällt das Cookie-Banner komplett weg.

**Wichtig:** der Starter unterstützt beide Strategien — Default ist cookie-frei, aber ein Slot für ein optionales Cookie-Banner (IT-Recht Kanzlei) muss vorhanden sein.

#### 9.1 Cookie-Inventar

1. **Audit machen** in `COOKIE-INVENTORY.md`:
   - Welche Skripte/Embeds sind aktuell in AstroWind enthalten? (vermutlich Google Analytics, evtl. Google Fonts)
   - Welche setzen Cookies? Welche nicht?
   - Welche externen Domains werden geladen?
2. **Lücken identifizieren:** alles was Cookies setzt oder personenbezogene Daten in Drittländer überträgt → muss ersetzt oder optional gemacht werden

#### 9.2 Google Fonts → Lokale Fonts

Google Fonts in Astro-Projekten lädt Schriften von Google-Servern → DSGVO-Verstoß ohne Consent (deutsche Landgerichte haben das bereits abgemahnt).

1. **AstroWind-Font-Setup prüfen:** wo werden Fonts referenziert? `tailwind.config.cjs`, CSS, oder Layout?
2. **Fonts lokal einbinden** via `@fontsource`-Pakete:
   - Standard-Fonts (Inter, Source Sans 3, Cormorant Garamond etc.) als npm-Package
   - In `src/assets/styles/` einbinden
   - `font-display: swap` setzen
3. **Doku in `PFUCON-README.md`:** "Niemals Google Fonts CDN verwenden — immer `@fontsource` oder selbst gehostet"
4. **Beispiel-Migration** in einer Demo-Page durchspielen, prüfen dass keine `fonts.googleapis.com`-Requests mehr auftauchen

#### 9.3 Plausible Analytics als Default

Plausible ist EU-gehostet (Hetzner DE), 100% cookieless, DSGVO-konform ohne Banner-Pflicht.

1. **`src/components/analytics/Plausible.astro`** (existiert evtl. schon aus Phase 8.10):
   - Aktiviert via `PUBLIC_PLAUSIBLE_DOMAIN` Env-Var
   - Optional self-hosted URL via `PUBLIC_PLAUSIBLE_SCRIPT_URL` (für späteren Plausible-Self-Host auf Coolify)
   - Script via `is:inline` einbinden
2. **Layout-Integration:** im `<head>` rendern, conditional auf Env-Var
3. **Goal-Tracking-Helper:** `src/lib/analytics.ts` mit `trackGoal(goalName)` Funktion → für Conversion-Events (Form-Submit, Click)
4. **Doku:** in `SETUP-NEW-CLIENT.md` Schritt für Plausible-Account anlegen oder Self-hosted-Server verwenden

#### 9.4 YouTube → LiteYouTubeEmbed

YouTube-iframes laden sofort beim Page-Load und setzen Cookies. Lite-Embeds zeigen erst nur ein Bild und laden YouTube erst beim Klick → null Cookies bis Interaktion.

1. **`src/components/common/LiteYouTube.astro`** bauen:
   - Props: `videoId`, `title`, optional `posterQuality`
   - Rendert nur Thumbnail mit Play-Button
   - On-Click: lazy-loaded das echte iframe
2. **AstroWind-Widgets prüfen:** wo werden YouTube-Videos eingebunden? Wenn ja → durch LiteYouTube ersetzen
3. **Sanity-Schema-Erweiterung:** `videoBlock.ts` für Sanity → speichert nur YouTube-ID, Frontend rendert via LiteYouTube
4. **Hinweis-Doku:** im Sanity-Studio als Beschreibung "Video lädt erst bei Klick — kein Cookie-Banner nötig"

#### 9.5 Google Maps → datenschutzkonforme Alternative

Google-Maps-Embed setzt sofort Tracking-Cookies. Alternativen:

1. **Option A: Statisches Map-Bild** (Default für Kontakt-Pages)
   - Komponente `src/components/common/StaticMap.astro`
   - Nutzt OpenStreetMap-Static-API oder Mapbox-Static (keine Cookies)
   - Click → öffnet OpenStreetMap/Apple Maps in neuem Tab
2. **Option B: OpenStreetMap-iframe** (`leaflet`)
   - Selbst-eingebettete Karte ohne Tracking
   - Komponente `src/components/common/OpenStreetMap.astro`
3. **Was NICHT erlaubt ist im Starter:** Google Maps iframe direkt einbetten — das ist ein klarer Cookie-Verstoß
4. **Doku:** im Sanity-Schema-`contactWidget` ein Feld `mapType` mit Optionen "static" / "interactive" / "none"

#### 9.6 Kontaktformular ohne Cookies

1. **Netlify Forms als Default** (kostenlos, keine Cookies):
   - In Form-Komponenten `data-netlify="true"` setzen
   - Honeypot-Feld als Spam-Schutz
   - Bestätigungs-Page nach Submit
2. **Optional: Web3Forms** als Backup für komplexere Anforderungen
3. **NIEMALS:** Google reCAPTCHA — setzt Cookies, Drittland-Übertragung. Stattdessen Cloudflare Turnstile (cookie-frei) oder simpler Honeypot
4. **Komponente:** `src/components/forms/ContactForm.astro` mit Honeypot + Netlify-Forms

#### 9.7 Optionaler Cookie-Banner-Slot (für Strategie B)

Falls ein Kunde explizit GA4/GTM/Drittanbieter-Embeds einbinden möchte, muss der Starter das unterstützen — aber nicht als Default.

1. **Banner-Slot im Layout vorbereiten:**
   - Komponente `src/components/cookies/CookieBannerSlot.astro` 
   - Conditional rendering: nur wenn Env-Var `PUBLIC_COOKIE_BANNER_ENABLED=true` gesetzt ist
   - **WICHTIG:** Banner-Skript muss mit `is:inline` ins `<head>` eingebunden werden, sonst defert Astro es und Tracker feuern zuerst
2. **IT-Recht Kanzlei Banner-Integration** als Default (da Linus diese Lizenz kaufen kann):
   - Doku-Stub in `COOKIE-BANNER-SETUP.md`: wie der JS-Snippet aus IT-Recht Kanzlei eingebunden wird
   - Slot für `PUBLIC_ITRK_BANNER_ID` Env-Var
3. **Alternative Banner-Tools dokumentieren** (für Kunden ohne IT-Recht-Kanzlei):
   - `velohost/astro-consent` (GitHub, MIT) — Astro-native Integration, blockt nicht-essentielle Skripte automatisch
   - Klaro! (Open Source, deutsch)
   - Cookiebot (kommerziell)
4. **WICHTIG:** der Starter darf Banner-Code **nicht aktiv mitliefern** — nur Slots vorbereiten. Aktivierung pro Projekt.

#### 9.8 Tracking-Skripte richtig blockieren (nur wenn Banner aktiv)

Falls ein Kunde Banner + GA4/GTM braucht, muss das Setup wasserdicht sein:

1. **Consent Mode v2 Defaults** dokumentieren in `COOKIE-BANNER-SETUP.md`:
   - Default state: alle storage-Werte auf `denied`
   - CMP setzt nach Consent auf `granted`
   - Beispiel-Code mit `is:inline` für Layout
2. **Type-Swap-Pattern erklären:** Marketing-Skripte mit `type="text/plain"` rendern, CMP swapped nach Consent zu `text/javascript`
3. **AstroView-Transitions-Hinweis:** wenn `<ViewTransitions />` aktiv ist, Banner-Script in `<head>` persistiert automatisch über Navigations
4. **Test-Checkliste** für Kunden mit Banner: keine Cookies vor Consent, GA4 feuert nur nach Consent, Banner-Auswahl bleibt bei Page-Wechsel erhalten

#### 9.9 Datenschutzerklärung-Integration

Pro Kundenprojekt wird die Datenschutzerklärung entweder als Text in sanity vom Kunden geliefert oder besser über IT-Recht Kanzlei-Plugin gepflegt. Im Starter:

1. **Page-Slots vorbereiten:** `src/pages/datenschutz.astro` und `src/pages/impressum.astro` als Stubs
2. **Inhalt:** Markdown-Slot, der mit IT-Recht-Kanzlei-Texten gefüllt wird (manuell oder per Skript via deren API, falls verfügbar)
3. **Cookie-Hinweis-Sektion** als wiederverwendbare Komponente: 
   - Listet alle technisch notwendigen Cookies (z.B. Netlify-Forms-Session, IT-Recht Kanzlei selbst)
   - Wird in Datenschutzerklärung eingebunden
4. **Doku:** in `SETUP-NEW-CLIENT.md` Schritt für IT-Recht-Kanzlei-Texte einbinden

#### 9.10 Decision-Tree-Doku für Linus

Erstelle `COOKIE-DECISION.md` als Hilfestellung:

```
Frage 1: Will der Kunde GA4 / Google Tag Manager?
  → JA: Strategie B (Banner Pflicht)
  → NEIN: weiter

Frage 2: Bindet die Site YouTube-Videos ein?
  → JA: LiteYouTube verwenden → keine Cookies → weiter
  → NEIN: weiter

Frage 3: Braucht die Site Google Maps?
  → JA: Statische Map oder OpenStreetMap → keine Cookies → weiter
  → NEIN: weiter

Frage 4: Werden Custom-Fonts verwendet?
  → JA: Lokal via @fontsource → keine Cookies → weiter
  → NEIN: weiter

Frage 5: Wird Plausible für Analytics verwendet?
  → JA: keine Cookies → KEIN BANNER NÖTIG
  → Andere Lösung: prüfen ob Cookies gesetzt werden
```

**Verkaufs-Snippet** in der gleichen Datei:
> "Ihre Site braucht kein Cookie-Banner. Sie sehen 100% Ihrer Besucher in Plausible — nicht nur die 40-50% die ein Banner akzeptieren würden. Vollständig DSGVO-konform durch unseren cookie-freien Stack."

#### 9.11 Testing & Validation

1. **Test-Build durchlaufen lassen** und prüfen via Browser-DevTools (Network-Tab + Application/Cookies):
   - Default-Stack ohne Plausible: NULL Cookies
   - Mit Plausible aktiv: NULL Cookies (Plausible ist cookieless)
   - Externe Requests: nur an eigene Domain + Plausible-Domain
   - Keine Requests an `googleapis.com`, `google-analytics.com`, `youtube.com`, `gstatic.com`
2. **Cookie-Scanner** drüberlaufen lassen:
   - Z.B. [Cookie Audit](https://cookie-audit.com) oder [Webbkoll](https://webbkoll.dataskydd.net)
   - Ergebnis in `COOKIE-VALIDATION.md` dokumentieren
3. **Drittland-Übertragungs-Check:** keine US-basierten Requests im Network-Log

#### 9.12 Dokumentation

1. **`PFUCON-README.md`** um Cookie-Sektion erweitern:
   - Welche Default-Strategie (cookie-frei)
   - Wann braucht der Kunde ein Banner (Verweis auf `COOKIE-DECISION.md`)
   - Welche Komponenten-Alternativen sind im Starter
2. **`COOKIE-CHECKLIST.md`** als Pro-Kunden-Checkliste:
   - Plausible eingerichtet
   - Lokale Fonts verifiziert (kein `fonts.googleapis.com` im Source)
   - Maps-Lösung gewählt (statisch / OSM / keine)
   - YouTube-Embeds via LiteYouTube
   - Datenschutzerklärung von IT-Recht Kanzlei eingepflegt
   - Cookie-Audit grün (null Cookies oder nur essential)
   - Falls Banner nötig: aktiviert + getestet (Tracker feuern erst nach Consent)

---

#### Constraints für Phase 9

- **Default-Stack ist cookie-frei.** Keine Cookies, keine Banner-Aktivierung.
- **Banner-Slot existiert, ist aber inaktiv** bis Env-Var gesetzt
- **Kein Google-Service als Default** — weder Analytics, Fonts, Maps noch reCAPTCHA
- **Lokale Fonts sind Pflicht** — Google Fonts CDN ist bekannter DSGVO-Verstoß
- **`is:inline` für alle Consent-kritischen Skripte** — Astro darf sie nicht deferren
- **Pro Service ein OSS-Default und ein kommerzielles Backup** dokumentieren

---

#### Definition of Done für Phase 9

- [ ] `COOKIE-INVENTORY.md` listet alles existierend und ersetzt
- [ ] Alle Google Fonts durch `@fontsource` ersetzt — kein `fonts.googleapis.com` im Build-Output
- [ ] Plausible-Component aktiv via Env-Var, mit Fallback für Self-hosted
- [ ] LiteYouTube-Component vorhanden und in Sanity-Schema integriert
- [ ] StaticMap und/oder OpenStreetMap-Components verfügbar
- [ ] ContactForm-Komponente nutzt Netlify Forms + Honeypot, kein reCAPTCHA
- [ ] Cookie-Banner-Slot existiert (inaktiv per Default)
- [ ] `COOKIE-DECISION.md` als Linus-Hilfestellung vorhanden
- [ ] `COOKIE-CHECKLIST.md` als Pro-Kunden-Checkliste vorhanden
- [ ] `COOKIE-BANNER-SETUP.md` als Activation-Guide vorhanden
- [ ] Test-Build zeigt 0 Cookies bei Default-Stack
- [ ] Cookie-Scanner-Ergebnis in `COOKIE-VALIDATION.md`
- [ ] Datenschutz-/Impressum-Page-Stubs vorhanden

### Final
- [ ] Branch gemerged in `main`, Tag `v1.0.0-pfucon-starter` gesetzt

---

## Bei Unsicherheit

- **Frage Linus nach Bestätigung**, bevor du destruktive Änderungen machst (Files löschen, Original-Widgets anfassen, Dependencies entfernen)
- **Wenn ein AstroWind-Widget komplexe Sub-Komponenten hat** (z.B. Hero mit Action-Buttons-Array): zeige Linus das Schema-Mapping zur Review, bevor du alle 15 Widgets durchziehst — am ersten Widget exemplarisch
- **Bei Sanity-API-Änderungen** (Schema-Versionen, Studio-Versionen): aktuelle Sanity-Docs prüfen, nicht aus dem Gedächtnis arbeiten
- **Bei SEO-Phase 8:** wenn unklar ob ein Feature schon existiert in AstroWind → SEO-Inventar (8.1) zuerst, dann entscheiden

---

## Tools die du nutzen darfst

- `sanity` CLI (lokal)
- `npm`/`npx`
- `git` (commit, branch, push) — aber **nie force-push auf main**
- Sanity MCP (falls verfügbar) für Schema-Deployment und Test-Content
- Netlify CLI für Deployment-Tests
- Lighthouse CLI für SEO-Validation
- Google Rich Results Test (online)

---

**Letzter Hinweis:** Dieser Starter ist Linus' Investition in ~50 künftige Kundenprojekte. Sauberkeit > Geschwindigkeit. Wenn etwas unklar ist, lieber stoppen und fragen als raten.
