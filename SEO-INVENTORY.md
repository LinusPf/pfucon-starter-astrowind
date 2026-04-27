# SEO-Inventar — PfuCon Starter

Erstellt als Teil von Phase 8 (SEO-Foundation).

---

## Existierende SEO-Features (AstroWind-Original)

### Meta-Tags & Seitentitel
- **`src/components/common/Metadata.astro`** — Kernkomponente, nutzt `@astrolib/seo` (AstroSeo)
  - Title mit Template (`%s — SiteName`)
  - Meta-Description
  - Canonical URL (automatisch aus `Astro.url.pathname`)
  - Robots (index/follow)
  - Open Graph (url, site_name, images, locale, type)
  - Twitter Cards (handle, site, cardType)
  - Konfiguration zentral in `src/config.yaml` unter `metadata:`

### Sitemap
- **`@astrojs/sitemap`** installiert, in `astro.config.ts` aktiv
- Generiert `/sitemap-index.xml` automatisch
- Link im `<head>` via `CommonMeta.astro`
- Standard-Konfiguration ohne Filter → alle Routen werden gelistet

### RSS Feed
- **`@astrojs/rss`** installiert
- Endpunkt: `src/pages/rss.xml.ts`
- Dynamisch aus `src/content/post/` generiert
- Deaktiviert wenn `APP_BLOG.isEnabled = false`
- RSS-Icon im Header (`showRssFeed` prop in Header)
- **Fehlt:** `<link rel="alternate" type="application/rss+xml">` im `<head>`

### robots.txt
- Statisch unter `public/robots.txt`
- Inhalt: `User-agent: * / Disallow:` (alles erlaubt)
- **Fehlt:** Sitemap-URL, AI-Crawler-Blöcke, dynamische URL

### Search Console Verifikation
- **`src/components/common/SiteVerification.astro`**
- Google: via `SITE.googleSiteVerificationId` aus `config.yaml`
- **Fehlt:** Bing Webmaster Tools (`msvalidate.01`)
- **Fehlt:** Env-Var-Unterstützung (derzeit nur config.yaml)

### Analytics
- **`src/components/common/Analytics.astro`**
- Google Analytics via `@astrolib/analytics` (Partytown-fähig)
- Aktiviert via `analytics.vendors.googleAnalytics.id` in `config.yaml`
- **Fehlt:** Plausible Analytics

### Open Graph
- Vollständig via `Metadata.astro` und `@astrolib/seo`
- Default-OG-Bild in `config.yaml` konfigurierbar
- `adaptOpenGraphImages()` Helper für Bildpfad-Auflösung

### Performance
- `astro-compress` aktiv (CSS, JS, HTML minimiert)
- View Transitions (Astro ClientRouter)
- Kein `client:` Direktiven in Widget-Komponenten (alle serverseitig)
- Astro Asset-Optimierung (WebP/AVIF, `<Image>` Komponente)

### Blog-SEO
- Einzelne Posts: `robots.index: true`, eigene Permalinks
- Blog-Liste: indexierbar
- Kategorien: indexierbar
- Tags: `robots.index: false` (bewusste Entscheidung)
- Related Posts (`isRelatedPostsEnabled: true`)

---

## Neu gebaut in Phase 8

| Feature | Datei | Status |
|---------|-------|--------|
| Dynamisches robots.txt | `src/pages/robots.txt.ts` | ✅ |
| Sitemap-Filter | `astro.config.ts` | ✅ |
| RSS `<link>` im `<head>` | `src/components/common/CommonMeta.astro` | ✅ |
| PfuconSEO Wrapper | `src/components/common/PfuconSEO.astro` | ✅ |
| Organization JSON-LD | `src/components/seo/OrganizationSchema.astro` | ✅ |
| Article JSON-LD | `src/components/seo/ArticleSchema.astro` | ✅ |
| FAQ JSON-LD | `src/components/seo/FAQSchema.astro` | ✅ |
| Breadcrumb JSON-LD | `src/components/seo/BreadcrumbSchema.astro` | ✅ |
| llms.txt | `src/pages/llms.txt.ts` | ✅ |
| SmartImage | `src/components/common/SmartImage.astro` | ✅ |
| Bing Verification | `src/components/common/SiteVerification.astro` | ✅ |
| Plausible Analytics | `src/components/analytics/Plausible.astro` | ✅ |
| Sanity siteSettings | `studio/schemaTypes/siteSettings.ts` | ✅ |
| Sanity seoFields | `studio/schemaTypes/seoFields.ts` | ✅ |

---

## Lücken-Checkliste (vor Phase 8)

- [x] robots.txt statisch → dynamisch mit Sitemap-URL und AI-Crawler-Blöcken
- [x] Sitemap-Filter für `/404` und Utility-Routen
- [x] RSS `<link rel="alternate">` im `<head>` fehlt
- [x] Kein JSON-LD / Structured Data (Organization, Article, FAQ)
- [x] Kein llms.txt (AI-Crawler-Steuerung)
- [x] Bing Webmaster Tools Verifikation fehlt
- [x] Kein Plausible-Support (nur Google Analytics)
- [x] Kein SmartImage-Wrapper (lazy/async/format defaults)
- [x] Sanity siteSettings fehlt (für Org-Schema und Default-OG-Image)
- [x] PfuconSEO-Wrapper fehlt (für JSON-LD Slot + Sanity OG-Image)
