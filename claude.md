# PfuCon AstroWind Starter — Agent Working Brief

**Repo:** `LinusPf/pfucon-starter-astro` (Fork von `onwidget/astrowind`)
**Ziel:** Default-Starter für PfuCon-Astro-Projekte mit minimaler Sanity-Integration für Homepage-Marketing-Sektionen und SEO-Komplettausstattung
**Stack:** Astro 5 + Tailwind + Sanity (nur Homepage) + Netlify
**Owner:** Linus Pfurtscheller, Pfurtscheller Consulting

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
