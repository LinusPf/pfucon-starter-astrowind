# Cookie-Entscheidungsbaum — PfuCon Starter

Entscheidungshilfe für Linus: Welche DSGVO-Maßnahmen braucht welcher Kunde?

---

## Schnellcheck: Braucht der Kunde einen Cookie-Banner?

```
START
 │
 ▼
Nutzt die Website Google Analytics, Meta Pixel,
TikTok Pixel oder andere Tracking-Tools?
 ├─ JA  ─────────────────────────────────────────→ COOKIE-BANNER PFLICHT
 │                                                  → Consent Mode v2 aktivieren
 │                                                  → PUBLIC_COOKIE_BANNER_ENABLED=true
 │
 └─ NEIN
     │
     ▼
    Nutzt die Website YouTube-Embeds (automatisch laden)?
     ├─ JA  ──────────────────────────────────────→ Click-to-Load PFLICHT
     │                                               → LiteYouTube.astro verwenden ✅ (bereits)
     │
     └─ NEIN
         │
         ▼
        Nutzt die Website Google Fonts CDN?
         ├─ JA  ────────────────────────────────→ Auf @fontsource wechseln ✅ (bereits)
         │
         └─ NEIN
             │
             ▼
            Nutzt die Website Google Maps?
             ├─ JA  ──────────────────────────→ OpenStreetMap.astro (click-to-load)
             │                                  oder StaticMap.astro verwenden ✅ (bereits)
             │
             └─ NEIN
                 │
                 ▼
                KEIN COOKIE-BANNER NÖTIG ✅
                → Datenschutzerklärung + Impressum befüllen
                → Hosting (Netlify) + Sanity CDN erwähnen
```

---

## Entscheidungsmatrix: Analytics

| Situation | Empfehlung | Begründung |
|-----------|-----------|------------|
| Kleines Unternehmen, kein SEA | **Plausible** | Cookiefrei, kein Banner, DSGVO-konform by default |
| Muss Google Analytics (wegen Bestandsdaten) | **GA + Consent Mode v2 + Cookie-Banner** | Pflicht seit März 2024 |
| Möchte Conversion-Tracking (Google Ads) | **GA4 + Google Ads + Consent Mode v2** | Cookie-Banner + Einwilligungs-Dokumentation |
| Hat bereits Plausible-Account | **Plausible** | Einfach `PUBLIC_PLAUSIBLE_DOMAIN` setzen |

---

## Entscheidungsmatrix: YouTube Videos

| Situation | Empfehlung |
|-----------|-----------|
| Video auf Homepage / Unterseite | **LiteYouTube.astro** — Poster zeigen, Iframe erst nach Klick |
| Video mit eigenem Thumbnail (Sanity) | **videoBlock** in Sanity → LiteYouTube rendert Sanity-Bild als Poster |
| Kein Video | Nichts zu tun |
| Nur externer Link zu YouTube | Normaler `<a>`-Link, kein Embed |

---

## Entscheidungsmatrix: Karten

| Situation | Empfehlung |
|-----------|-----------|
| Nur Adresse anzeigen, keine Interaktion | **StaticMap.astro** — 0 externe Requests |
| Interaktive Karte gewünscht | **OpenStreetMap.astro** — Click-to-Load-Gate |
| Kunde besteht auf Google Maps | **Muss im Cookie-Banner deklariert werden** |

---

## Entscheidungsmatrix: Kontaktformular

| Situation | Empfehlung |
|-----------|-----------|
| Einfaches Kontaktformular | **ContactForm.astro** — Netlify Forms, kein reCAPTCHA |
| Schwererer Spam-Schutz nötig | Netlify Forms + Spam-Filter aktivieren (Netlify Admin) |
| Kunde möchte reCAPTCHA | reCAPTCHA erfordert Cookie-Banner (Google-Dienst) |
| Kalkulationsformular / Mehrstufig | Individualprogrammierung |

---

## Setup-Reihenfolge für neuen Kunden

### Szenario A: Cookiefreier Stack (Empfehlung)

```
1. PUBLIC_SANITY_PROJECT_ID setzen
2. Plausible: PUBLIC_PLAUSIBLE_DOMAIN setzen (oder weglassen)
3. Datenschutzerklärung + Impressum befüllen
4. → FERTIG. Kein Banner nötig.
```

### Szenario B: Mit Google Analytics

```
1. PUBLIC_SANITY_PROJECT_ID setzen
2. analytics.vendors.googleAnalytics.id in config.yaml setzen
3. PUBLIC_COOKIE_BANNER_ENABLED=true in .env
4. Cookie-Banner integrieren (siehe COOKIE-BANNER-SETUP.md)
5. Consent Mode v2 konfigurieren
6. Datenschutzerklärung + Cookie-Abschnitt befüllen
7. → Live gehen erst nach vollständigem Test
```

---

## Rechtliche Einschätzung (kein Rechtsrat)

| Rechtsgrundlage | Anwendungsfall |
|-----------------|----------------|
| Art. 6 Abs. 1 lit. b DSGVO | Kontaktformular-Daten (Vertragsanbahnung) |
| Art. 6 Abs. 1 lit. f DSGVO | Server-Logs, Plausible Analytics |
| Art. 6 Abs. 1 lit. a DSGVO | Google Analytics, Marketing-Cookies → Consent erforderlich |

**Achtung:** Diese Einschätzung ersetzt keine Rechtsberatung. Bei Unsicherheit → Rechtsanwalt / Datenschutzexperte.

---

## Weiterführende Ressourcen

- DSGVO-Grundverordnung: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- Österreichische Datenschutzbehörde: https://www.dsb.gv.at
- Netlify DSGVO: https://www.netlify.com/gdpr-ccpa/
- Sanity Datenschutz: https://www.sanity.io/legal/privacy
- Plausible DSGVO: https://plausible.io/privacy-focused-web-analytics
- Consent Mode v2: https://support.google.com/analytics/answer/9976101
