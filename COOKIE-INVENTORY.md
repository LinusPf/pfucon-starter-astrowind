# Cookie & Datenschutz-Inventar — PfuCon Starter

Audit aller externen Verbindungen und Cookie-Risiken im Default-Stack.
Stand: Phase 9 — DSGVO-Foundation

---

## Bewertungsskala

| Symbol | Bedeutung |
|--------|-----------|
| ✅ | Kein Risiko — lokal oder cookiefrei |
| ⚠️ | Bedingt riskant — deaktiviert by default, dokumentieren |
| ❌ | Risiko aktiv — erfordert Consent oder Entfernung |

---

## Default-Stack Audit (ohne Kunden-Konfiguration)

### Schriften

| Quelle | Typ | Status | Maßnahme |
|--------|-----|--------|----------|
| `@fontsource-variable/inter` | npm-Paket, lokal gebundelt | ✅ Kein externer Request | — |
| `fonts.googleapis.com` | CDN | ✅ **Nicht verwendet** | Sichergestellt in Phase 9 |

Inter wird via `@fontsource-variable/inter` ausgeliefert — die Font-Dateien liegen im
Build-Output auf dem eigenen Server/CDN. Kein Aufruf von Google Fonts.

### Analytics

| Anbieter | Komponente | Status | Maßnahme |
|----------|-----------|--------|----------|
| Google Analytics | `Analytics.astro` | ⚠️ **Nur wenn `analytics.vendors.googleAnalytics.id` gesetzt** | Leer lassen → kein GA-Script geladen |
| Plausible | `Plausible.astro` | ✅ Cookiefrei, nur wenn `PUBLIC_PLAUSIBLE_DOMAIN` gesetzt | Bevorzugte Option |
| Splitbee | `SplitbeeAnalytics.astro` | ✅ Nicht eingebunden in `Layout.astro` | Inaktiv |

**Empfehlung:** `config.yaml` → `analytics.vendors.googleAnalytics.id: null` belassen.
Für Analytics → Plausible verwenden.

### Schriften & Icons

| Quelle | Typ | Status |
|--------|-----|--------|
| `astro-icon` (Tabler Icons) | SVG, lokal | ✅ Kein externer Request |
| Favicons | Lokal aus `src/favicons/` | ✅ |

### Videos

| Anbieter | Komponente | Status | Maßnahme |
|----------|-----------|--------|----------|
| YouTube (astro-embed) | `homes/startup.astro` | ⚠️ Nur Demo-Seite, lädt `i.ytimg.com` + setzt Cookies beim Play | Demo-Seite ist nicht deployed — kein Problem |
| YouTube (LiteYouTube.astro) | `src/components/media/LiteYouTube.astro` | ✅ Click-to-load, `youtube-nocookie.com` | Neues DSGVO-konformes Component |

### Karten

| Anbieter | Komponente | Status |
|----------|-----------|--------|
| Google Maps | — | ✅ **Nicht vorhanden** |
| OpenStreetMap | `OpenStreetMap.astro` | ✅ Click-to-load (kein automatischer Frame-Load) |
| StaticMap | `StaticMap.astro` | ✅ Nur Adressblock + Link zu OSM, 0 externe Requests |

### Formulare & Captcha

| Dienst | Komponente | Status |
|--------|-----------|--------|
| reCAPTCHA | — | ✅ **Nicht vorhanden** |
| hCaptcha | — | ✅ **Nicht vorhanden** |
| Netlify Forms | `ContactForm.astro` | ✅ Serverseitig, kein Tracking-Script |
| Formspree / Mailchimp | — | ✅ **Nicht vorhanden** |

### Hosting & CDN

| Anbieter | Zweck | Status | Rechtliches |
|----------|-------|--------|-------------|
| Netlify | Hosting, Server-Logs | ⚠️ Netlify speichert IPs (Server-Logs) | In Datenschutzerklärung erwähnen — Art. 6 Abs. 1 lit. f DSGVO |
| Sanity CDN | Bilder (Homepage) | ⚠️ Vercel Edge Network, USA | Standard Contractual Clauses, in DSE erwähnen |

### Sonstiges

| Quelle | Typ | Status |
|--------|-----|--------|
| `@astrolib/seo` | Meta-Tags, keine externen Requests | ✅ |
| `ClientRouter` (Astro View Transitions) | Lokal | ✅ |
| JSON-LD Structured Data | Inline `<script>` Tag | ✅ |

---

## Zusammenfassung Default-Stack

**Cookies gesetzt beim ersten Seitenaufruf (ohne Kunden-Konfiguration):** **0**

| Datenkategorie | Drittland-Transfer | Rechtsgrundlage |
|---------------|-------------------|-----------------|
| Server-Logs (Netlify) | USA (Netlify Inc.) | Art. 6 Abs. 1 lit. f DSGVO + SCC |
| Bilder-CDN (Sanity) | USA | Art. 6 Abs. 1 lit. f DSGVO + SCC |

---

## Risiko-Matrix: Optionale Features

| Feature | Cookie-Risiko | DSGVO-Anforderung |
|---------|--------------|-------------------|
| Google Analytics (optional) | ❌ Tracking-Cookies | Consent erforderlich + Consent Mode v2 |
| YouTube eingebettet (LiteYouTube, nach Klick) | ⚠️ Nach Klick: YouTube-Cookies | Hinweis vor dem Embed oder Consent |
| OpenStreetMap (nach Klick) | ⚠️ Session-Cookie möglich | Hinweis ausreichend (kein Tracking) |
| Plausible Analytics | ✅ Cookiefrei | Berechtigtes Interesse Art. 6 lit. f |
| Netlify Forms | ✅ Kein JS, kein Cookie | Pflichtinfo Kontaktformular |

---

## Was pro Kundenprojekt zu prüfen ist

- [ ] `config.yaml`: `googleAnalytics.id` leer? → Kein GA
- [ ] YouTube-Videos eingebettet? → `LiteYouTube.astro` verwenden
- [ ] Google Maps? → `OpenStreetMap.astro` oder `StaticMap.astro` verwenden
- [ ] Externe Schriften? → Nur `@fontsource-*` verwenden
- [ ] Drittanbieter-Skripte manuell eingefügt? → Prüfen
- [ ] Netlify + Sanity in Datenschutzerklärung erwähnt?

Detaillierte Checkliste: `COOKIE-CHECKLIST.md`

---

## Tools für Validierung

```
# Browser-Test (0 Cookies):
Chrome DevTools → Application → Cookies → nach erstem Seitenaufruf = leer

# Cookie-Scanner (online):
https://www.cookiemetrix.com
https://2gdpr.com (Scan auf Drittland-Transfers)
```
