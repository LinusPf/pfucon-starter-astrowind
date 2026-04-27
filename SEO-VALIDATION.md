# SEO-Validation — PfuCon Starter

Dieses Dokument wird pro Kundenprojekt mit den Testergebnissen befüllt.

---

## Template-Stand (ohne echten Kundeninhalt)

| Test | Ergebnis | Datum | Anmerkung |
|------|----------|-------|-----------|
| TypeScript `tsc --noEmit` | ✅ 0 Errors | Phase 8 | strict mode |
| Dev-Server HTTP 200 | ✅ | Phase 8 | Fallback-Banner korrekt |
| robots.txt erreichbar | ⏳ lokal nicht getestet | — | Braucht Netlify-Deploy |
| sitemap-index.xml | ⏳ lokal nicht getestet | — | Braucht Netlify-Deploy |
| llms.txt erreichbar | ⏳ lokal nicht getestet | — | Braucht Netlify-Deploy |
| JSON-LD im HTML | ⏳ lokal nicht getestet | — | Braucht Sanity siteSettings |
| Google Rich Results Test | ⏳ ausstehend | — | Braucht Deployment + Inhalt |
| Schema.org Validator | ⏳ ausstehend | — | Braucht Deployment + Inhalt |
| Lighthouse SEO | ⏳ ausstehend | — | Braucht Deployment |
| Lighthouse Performance | ⏳ ausstehend | — | Braucht Deployment |

---

## Anleitung: Validation nach Kundenprojekt-Deploy

### 1. Technische Prüfung (manuell, Browser)

```
https://DOMAIN/robots.txt
  → User-agent: * Allow: / + Sitemap-URL vorhanden

https://DOMAIN/sitemap-index.xml
  → XML-Datei mit <sitemapindex> Root-Element

https://DOMAIN/llms.txt
  → Markdown-Datei mit # Sitename Header

https://DOMAIN/rss.xml  (nur wenn Blog aktiv)
  → XML-Datei mit <rss> Root-Element

View-Source der Homepage:
  → <script type="application/ld+json"> vorhanden
  → <meta name="description"> vorhanden
  → <meta property="og:image"> vorhanden
  → <link rel="canonical"> vorhanden
```

### 2. Google Rich Results Test

URL: https://search.google.com/test/rich-results

- Homepage-URL eingeben
- Erwartete Ergebnisse: Organization/LocalBusiness Schema erkannt
- FAQ Schema erkannt (wenn FAQ-Widget vorhanden)

### 3. Schema.org Validator

URL: https://validator.schema.org

- HTML der Homepage einfügen (View Source → alles kopieren)
- 0 Errors anstreben, Warnings prüfen

### 4. Lighthouse (Chrome DevTools)

- Chrome → F12 → Lighthouse → Kategorien: Performance + SEO → Analyse
- Ziele: SEO 100/100, Performance 95+ (mobile), Accessibility 90+

---

## Ergebnisse pro Kundenprojekt

### Kunde: [NAME]
**Domain:** [URL]
**Datum:** [DATUM]

| Test | Ergebnis | Score |
|------|----------|-------|
| Lighthouse SEO | | /100 |
| Lighthouse Performance | | /100 |
| Lighthouse Accessibility | | /100 |
| Google Rich Results | | pass/fail |
| Schema Validator | | 0 errors |
| robots.txt | | ✅/❌ |
| Sitemap | | ✅/❌ |
| llms.txt | | ✅/❌ |

**Anmerkungen:**
