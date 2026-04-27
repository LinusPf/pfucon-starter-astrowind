# Cookie-Banner Setup — PfuCon Starter

Anleitung zur Aktivierung und Konfiguration eines Cookie-Banners.
Nur nötig wenn Google Analytics, Google Ads oder ähnliche Tracking-Dienste aktiv sind.

---

## Wann brauche ich das?

**KEIN Banner nötig bei:**
- Plausible Analytics (cookiefrei)
- Nur Netlify-Hosting (Server-Logs = berechtigtes Interesse)
- Kontaktformular via Netlify Forms
- YouTube via `LiteYouTube.astro` (erst nach Nutzerklick)

**Banner PFLICHT bei:**
- Google Analytics 4 (auch mit anonymisierten IPs seit EuGH-Urteil 2023)
- Google Ads Conversion-Tracking
- Meta Pixel (Facebook)
- TikTok Pixel
- Hotjar, Clarity oder andere Session-Recording-Tools

---

## Schritt 1: Env-Var setzen

```bash
# In Netlify: Site settings → Environment variables
PUBLIC_COOKIE_BANNER_ENABLED=true
```

In `.env.local` für lokale Entwicklung:
```
PUBLIC_COOKIE_BANNER_ENABLED=true
```

---

## Schritt 2: Cookie-Banner-Bibliothek wählen

### Option A: cookieconsent (Orestbida) — Empfehlung für Eigenbetrieb

```bash
npm install vanilla-cookieconsent
```

**Vorteile:** MIT-Lizenz, keine SaaS-Abhängigkeit, sehr konfigurierbar, WCAG 2.1 AA

### Option B: Klaro — Open Source

```bash
npm install klaro
```

**Vorteile:** Open Source, selbst gehostet, Consent Mode v2 Unterstützung

### Option C: CookieFirst / Cookiebot — SaaS

Kein npm-Paket nötig — Script-Tag im `<head>`.
**Vorteile:** Automatische Cookie-Erkennung, rechtssicher, Support
**Nachteil:** Monatliche Kosten, weiterer Drittanbieter

---

## Schritt 3: Banner in Layout.astro integrieren

Die `CookieBannerSlot.astro` Komponente ist bereits in `Layout.astro` am Ende des `<body>` eingebunden.
Sobald `PUBLIC_COOKIE_BANNER_ENABLED=true`, wird der `<slot>` gerendert.

Eigene Banner-Komponente erstellen und in `Layout.astro` übergeben:

```astro
<!-- src/layouts/Layout.astro -->
import CookieBannerSlot from '~/components/common/CookieBannerSlot.astro';
import MyCookieBanner from '~/components/common/MyCookieBanner.astro'; // eigene Komponente

<!-- im <body>: -->
<CookieBannerSlot>
  <MyCookieBanner />
</CookieBannerSlot>
```

---

## Schritt 4: Google Consent Mode v2

Wenn Google Analytics oder Google Ads aktiv ist, muss Consent Mode v2 implementiert werden
(Pflicht seit März 2024 für EU-Nutzer).

### Typ-Swap Pattern (empfohlen)

Anstatt Google Analytics direkt zu laden, nutzt man Consent Mode um das Laden zu verzögern:

```html
<!-- Im <head>, VOR dem Analytics-Script -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // Default: alles verweigert
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });

  // Modellierung für Nutzer die ablehnen (optional, für Google Ads sinnvoll)
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);
</script>

<!-- Dann: Google Tag laden (wir wissen jetzt dass consent denied ist) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

<!-- Analytics-Konfiguration (sendet erst wenn Consent gegeben) -->
<script>
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Wenn der Nutzer zustimmt (über Cookie-Banner):
```javascript
// Im Cookie-Banner-Callback:
gtag('consent', 'update', {
  analytics_storage: 'granted',
  ad_storage: 'granted',        // nur wenn Ads genutzt
});
```

### Consent Mode in PfuCon-Setup verwenden

1. `Analytics.astro` anpassen — Consent-Default vor dem GA-Script setzen
2. Cookie-Banner-Bibliothek so konfigurieren, dass sie `gtag('consent', 'update', ...)` aufruft

---

## Schritt 5: Datenschutzerklärung aktualisieren

In `src/pages/datenschutz.astro`:
- Abschnitt "Google Analytics" einkommentieren und befüllen
- Alle aktiven Drittdienste einzeln auflisten
- Cookie-Tabelle mit Name, Zweck, Speicherdauer, Anbieter

---

## Schritt 6: Testen

```
1. Browser-Cache + Cookies leeren
2. Website aufrufen → Cookie-Banner erscheint
3. "Ablehnen" klicken → in DevTools prüfen: keine GA-Cookies (_ga, _gid)
4. "Zustimmen" klicken → in DevTools prüfen: _ga Cookie erscheint
5. Seite neu laden → Banner erscheint NICHT mehr (Entscheidung gespeichert)
6. Cookie löschen → Banner erscheint wieder
```

---

## Bekannte Fallstricke

| Problem | Lösung |
|---------|--------|
| GA lädt trotz Ablehnung | Consent Mode v2 Default korrekt gesetzt? Script-Reihenfolge prüfen |
| Banner erscheint nicht | `PUBLIC_COOKIE_BANNER_ENABLED=true` in Netlify Env-Vars? Neu deployen |
| Banner erscheint immer wieder | Consent-Cookie wird nicht richtig gesetzt — Banner-Bibliothek debuggen |
| View Transitions unterbricht Banner | `document.addEventListener('astro:after-swap', reinitBanner)` hinzufügen |

---

## Ressourcen

- Cookieconsent v3 Docs: https://cookieconsent.orestbida.com
- Google Consent Mode v2: https://developers.google.com/tag-platform/security/guides/consent?hl=de
- DSB Österreich Cookie-Leitfaden: https://www.dsb.gv.at/themen-informationen/cookies.html
