# Cookie & DSGVO-Checkliste — Pro Kundenprojekt

Abzuhaken für jedes neue Projekt auf Basis des PfuCon Starters.

---

## Mindest-Anforderungen (immer)

- [ ] `src/pages/impressum.astro` — alle TODO-Felder befüllt
- [ ] `src/pages/datenschutz.astro` — alle TODO-Felder befüllt (Unternehmensname, E-Mail, Datum)
- [ ] Netlify als Hoster in Datenschutzerklärung erwähnt
- [ ] Sanity CDN in Datenschutzerklärung erwähnt (wenn Sanity konfiguriert)
- [ ] Links zu Impressum und Datenschutz im Footer gesetzt

## Schriften

- [ ] Nur `@fontsource-*` verwenden (bereits in `CustomStyles.astro` — nicht ändern)
- [ ] Keine `fonts.googleapis.com` Links im Code (prüfen mit: `grep -r "googleapis" src/`)

## Analytics

- [ ] Entscheidung getroffen: Plausible oder Google Analytics (oder keins)?
  - **Plausible:** `PUBLIC_PLAUSIBLE_DOMAIN` setzen → fertig, kein Banner nötig
  - **Google Analytics:** `config.yaml` + Cookie-Banner + Consent Mode v2 (→ COOKIE-BANNER-SETUP.md)
  - **Kein Analytics:** nichts einstellen

## Videos (YouTube)

- [ ] YouTube-Videos über `LiteYouTube.astro` oder Sanity `videoBlock` einbinden
- [ ] KEIN direktes `<iframe src="youtube.com/...">` verwenden
- [ ] KEIN `<YouTube>` aus `astro-embed` auf Produktionsseiten (lädt automatisch von ytimg.com)

## Karten

- [ ] `StaticMap.astro` für reine Adressanzeige verwenden
- [ ] `OpenStreetMap.astro` für interaktive Karte mit Click-to-Load-Gate
- [ ] Kein Google Maps einbetten ohne Cookie-Banner-Deklaration

## Kontaktformular

- [ ] `ContactForm.astro` mit Netlify-Attributen verwenden (nicht das AstroWind Standard-`Form.astro`)
- [ ] Kein reCAPTCHA ohne Cookie-Banner (Google-Dienst)
- [ ] Netlify Forms in Datenschutzerklärung erwähnt

## Cookie-Banner (NUR wenn GA / Tracking-Dienste aktiv)

- [ ] `PUBLIC_COOKIE_BANNER_ENABLED=true` in Netlify Env-Vars gesetzt
- [ ] Cookie-Banner-Bibliothek integriert (→ COOKIE-BANNER-SETUP.md)
- [ ] Consent Mode v2 konfiguriert (Google Analytics / Google Ads)
- [ ] Alle Tracking-Dienste im Cookie-Banner deklariert
- [ ] Banner auf Deployment getestet (Cookies wirklich geblockt vor Einwilligung?)

## Eingebettete Drittinhalte

- [ ] Für jeden eingebetteten Drittdienst: Abschnitt in Datenschutzerklärung vorhanden
- [ ] OpenStreetMap: eigener Abschnitt in DSE (wenn verwendet)
- [ ] YouTube: eigener Abschnitt in DSE (wenn verwendet)

## Technische Validierung

- [ ] Browser DevTools → Application → Cookies → beim ersten Seitenaufruf leer
- [ ] Online-Cookie-Scanner: https://www.cookiemetrix.com (URL eingeben)
- [ ] Datenschutzerklärung korrekt verlinkt (Footer + Kontaktformular)
- [ ] Impressum korrekt verlinkt (Footer)
- [ ] robots.txt schließt `/impressum` und `/datenschutz` nicht aus

## Go-Live

- [ ] Datenschutzerklärung von Juristen geprüft? (Empfehlung für Kunden mit höherem Risiko)
- [ ] Auftragsverarbeitungsvertrag (AVV) mit Netlify abgeschlossen?
  - Netlify DPA: https://www.netlify.com/legal/netlify-dpa.pdf
- [ ] AVV mit Sanity abgeschlossen?
  - Sanity DPA: https://www.sanity.io/legal/dpa
