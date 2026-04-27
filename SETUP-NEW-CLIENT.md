# Setup — Neues Kundenprojekt

Schritt-für-Schritt-Anleitung für Linus, um einen neuen Kunden auf Basis
des PfuCon Starters aufzusetzen.

---

## Voraussetzungen (einmalig, pro Rechner)

- Node.js 18+ installiert (`node --version`)
- npm installiert
- Sanity-Account auf sanity.io (kostenlos)
- Netlify-Account (kostenlos für den Start)
- GitHub-Account

---

## Schritt 1 — Repo forken / klonen

```bash
# Einmalig: Repo bei GitHub forken (github.com/LinusPf/pfucon-starter-astrowind → Fork)
# Dann klonen:
git clone https://github.com/DEIN-GITHUB/pfucon-starter-astrowind.git mein-kunde
cd mein-kunde
npm install
```

> Tipp: Benenne das Repo direkt nach dem Kunden, z. B. `mueller-gmbh-website`.

---

## Schritt 2 — Setup-Skript ausführen

Das Skript übernimmt alles: .env, Studio-Config, Schema-Deploy, Sample-Inhalt.

```bash
bash scripts/setup-new-client.sh
```

Das Skript fragt interaktiv:
1. **Kundenname** — z. B. `Müller GmbH`
2. **Sanity Project ID** — entweder vorher auf sanity.io/manage anlegen oder via:
   ```bash
   npx sanity@latest projects create --name "Müller GmbH"
   ```
3. **Dataset** — Enter für `production`
4. **API Token** — für Sample-Inhalt (optional, kann übersprungen werden)

---

## Schritt 3 — Lokalen Dev-Server starten (Sanity-Konfiguration prüfen)

```bash
# Terminal 1 — Sanity Studio
cd studio
npm run dev
# → http://localhost:3333

# Terminal 2 — Astro Dev-Server
npm run dev
# → http://localhost:4321
```

Im Astro-Browser: Banner "Sanity nicht konfiguriert" sollte **nicht** mehr erscheinen.
Falls doch: `.env` prüfen (`cat .env`).

---

## Schritt 4 — Ersten echten Inhalt eingeben

1. Sanity Studio öffnen: http://localhost:3333
2. **Homepage** im linken Menü auswählen
3. Hero-Widget: Titel, Untertitel, Bild des Kunden eingeben
4. **"Publish"** klicken
5. Astro Dev-Server neu laden → Kundendaten erscheinen auf der Homepage

---

## Schritt 5 — Netlify deployen

```bash
# Astro-Build lokal testen
npm run build
```

Dann auf Netlify:
1. "Import an existing project" → GitHub-Repo auswählen
2. Build-Einstellungen werden aus `netlify.toml` gelesen (kein Anpassen nötig)
3. **Environment Variables setzen:**
   - `PUBLIC_SANITY_PROJECT_ID` = (aus deiner `.env`)
   - `PUBLIC_SANITY_DATASET` = `production`
4. Deploy starten

---

## Schritt 6 — Webhook einrichten (automatische Rebuilds)

Damit neue Sanity-Inhalte live gehen ohne manuellen Deploy:
→ Vollständige Anleitung in **DEPLOYMENT.md**

Kurzfassung:
1. Netlify → Build hooks → neue Hook-URL erstellen
2. Sanity Studio → API → Webhooks → Hook-URL eintragen, Filter: `_type == "homePage"`

---

## Schritt 7 — Domain verbinden

1. Netlify → Domain settings → Custom domain → Kundendomain eintragen
2. DNS beim Provider des Kunden: CNAME auf Netlify-URL setzen
   (oder A-Record auf Netlify-IP, falls Root-Domain)
3. SSL wird von Netlify automatisch via Let's Encrypt vergeben (~2 Min)

---

## Checkliste für Go-Live

- [ ] Sanity-Inhalt vollständig und published
- [ ] `npm run build` läuft lokal ohne Fehler durch
- [ ] Netlify-Deploy grün
- [ ] Webhook eingerichtet und getestet (Inhalt ändern → Build triggert)
- [ ] Custom Domain verbunden, SSL aktiv
- [ ] Google Search Console: Site hinzufügen, DNS-Verify, Sitemap einreichen
- [ ] Bing Webmaster Tools (wegen ChatGPT/Copilot wichtig): Sitemap einreichen
- [ ] Plausible Analytics: `PUBLIC_PLAUSIBLE_DOMAIN` in Netlify setzen (wenn gewünscht)

---

## Häufige Probleme

**"PLACEHOLDER_PROJECT_ID" erscheint im Studio**
→ Das Skript hat `studio/sanity.config.ts` nicht gepatcht. Manuell ersetzen:
```bash
sed -i 's/PLACEHOLDER_PROJECT_ID/DEINE_PROJECT_ID/g' studio/sanity.config.ts
```

**Schema-Deploy schlägt fehl mit "Unauthorized"**
→ `npx sanity@latest login` ausführen, dann erneut deployen.

**Sample-Inhalt fehlt nach Skript-Ausführung**
→ Ohne API-Token wurde das Sample übersprungen. Studio öffnen und Homepage-Dokument
   manuell anlegen: Studio → "+" → Homepage → Widgets hinzufügen.

**Astro-Build auf Netlify schlägt fehl**
→ Prüfen ob `PUBLIC_SANITY_PROJECT_ID` in Netlify-Env-Vars gesetzt ist.
→ Astro-Version in `package.json` mit Node.js-Version auf Netlify kompatibel?
   (Node 22 ist als `NODE_VERSION` in `netlify.toml` gesetzt)
