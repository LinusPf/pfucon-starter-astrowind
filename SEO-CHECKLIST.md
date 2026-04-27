# SEO-Checkliste — Pro Kundenprojekt

Abzuhaken für jedes neue Projekt auf Basis des PfuCon Starters.

---

## Technisches Setup

- [ ] `PUBLIC_SANITY_PROJECT_ID` in Netlify Env-Vars gesetzt
- [ ] Sanity `siteSettings`-Dokument vollständig ausgefüllt (Name, Adresse, Telefon, Logo)
- [ ] `businessType` in siteSettings korrekt gewählt (LocalBusiness, Organization, etc.)
- [ ] Default OG-Bild in siteSettings hochgeladen (1200×628 px)
- [ ] Öffnungszeiten in siteSettings eingetragen (für LocalBusiness-Schema)
- [ ] Social-Profile-URLs in siteSettings eingetragen

## Search Console & Bing

- [ ] Google Search Console: Property anlegen (Domain-Property bevorzugt)
- [ ] DNS-TXT-Record in Plesk eingetragen (Verifizierung via DNS, nicht Meta-Tag)
  - Alternativ: `PUBLIC_GSC_VERIFICATION` als Netlify Env-Var setzen
- [ ] Sitemap unter `https://domain.at/sitemap-index.xml` in Search Console eingereicht
- [ ] Bing Webmaster Tools: Account anlegen, Property mit Google SC-Import verifizieren
  - Alternativ: `PUBLIC_BING_VERIFICATION` als Netlify Env-Var setzen
  - Sitemap auch bei Bing einreichen

## Inhalte

- [ ] Homepage (`/`) in Sanity befüllt — mindestens Hero + eine weitere Sektion
- [ ] Alle Bilder haben Alt-Text (Sanity erzwingt das via Schema-Validation)
- [ ] Seitentitel und Meta-Description für Homepage in Sanity Homepage-Dokument gesetzt
- [ ] FAQ-Widget auf Homepage? → `FAQSchema.astro` einbinden
- [ ] Blog aktiviert? → Mind. 3 Posts mit Titel, Excerpt, OG-Bild

## Analytics & Tracking

- [ ] Plausible Analytics: `PUBLIC_PLAUSIBLE_DOMAIN` in Netlify Env-Vars setzen
  - Alternativ Google Analytics: `analytics.vendors.googleAnalytics.id` in `src/config.yaml`
- [ ] Conversion-Events konfiguriert (Kontaktformular-Submit, etc.)

## Technische Validierung

- [ ] `https://domain.at/robots.txt` erreichbar und enthält Sitemap-URL
- [ ] `https://domain.at/sitemap-index.xml` erreichbar
- [ ] `https://domain.at/llms.txt` erreichbar
- [ ] `https://domain.at/rss.xml` erreichbar (nur wenn Blog aktiv)
- [ ] JSON-LD im HTML-Source der Homepage vorhanden (`<script type="application/ld+json">`)
- [ ] Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Schema Markup Validator: https://validator.schema.org
- [ ] Lighthouse SEO: 100/100 (Chrome DevTools → Lighthouse → SEO)
- [ ] Lighthouse Performance: 95+ (mobile)

## Domain & HTTPS

- [ ] Custom Domain auf Netlify verbunden
- [ ] SSL-Zertifikat aktiv (automatisch via Netlify / Let's Encrypt)
- [ ] HTTP → HTTPS Redirect aktiv (Netlify macht das automatisch)
- [ ] www → non-www (oder umgekehrt) Redirect gesetzt

## Abschluss

- [ ] Ersten Crawl in Search Console ausgelöst (URL-Prüftool → Index beantragen)
- [ ] Core Web Vitals nach erstem Deployment prüfen (Search Console → Erfahrung)
- [ ] Lighthouse-Ergebnisse in `SEO-VALIDATION.md` dokumentiert
