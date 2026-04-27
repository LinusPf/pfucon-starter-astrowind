# Deployment Guide — PfuCon Starter

## Voraussetzungen

- Netlify-Account (kostenloser Starter-Plan reicht)
- Sanity-Projekt angelegt (via `scripts/setup-new-client.sh` oder manuell)
- GitHub-Repo des Forks

---

## Erster Deploy auf Netlify

1. **Netlify → "Add new site" → "Import an existing project"**
2. GitHub-Repo auswählen
3. Build-Einstellungen werden automatisch aus `netlify.toml` gelesen:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Umgebungsvariablen setzen** (Site Settings → Environment variables):
   ```
   PUBLIC_SANITY_PROJECT_ID   = <deine Sanity Project ID>
   PUBLIC_SANITY_DATASET      = production
   ```
5. **Deploy starten** — beim ersten Deploy ohne Sanity-Daten erscheint der Fallback-Banner.
   Das ist OK. Sobald das homePage-Dokument in Sanity befüllt ist und der Webhook aktiv ist
   (siehe unten), wird der erste echte Build ausgelöst.

---

## Sanity-Webhook → Netlify-Build-Hook

Damit die Website automatisch neu gebaut wird, wenn du in Sanity Inhalte speicherst:

### Schritt 1 — Netlify Build Hook anlegen

1. Netlify-Dashboard → deine Site → **Site configuration → Build & deploy → Build hooks**
2. **"Add build hook"** klicken
3. Name: `Sanity Content Update`
4. Branch: `main`
5. Speichern → Hook-URL kopieren (Format: `https://api.netlify.com/build_hooks/XXXXXXXXXX`)

### Schritt 2 — Webhook in Sanity Studio konfigurieren

1. Sanity Studio öffnen (`cd studio && npm run dev` oder deployed Studio URL)
2. **API → Webhooks → "Create webhook"**
3. Einstellungen:
   - **Name:** `Netlify Rebuild`
   - **URL:** die kopierte Hook-URL aus Schritt 1
   - **Dataset:** `production`
   - **Trigger on:** ✅ Create, ✅ Update, ✅ Delete
   - **Filter:** `_type == "homePage"` (nur Homepage-Änderungen triggern Build)
   - **HTTP method:** POST
   - **HTTP Headers:** leer lassen
4. Speichern

### Schritt 3 — Testen

1. In Sanity Studio: Homepage-Dokument öffnen, Titel ändern, **Publish**
2. In Netlify-Dashboard → **Deploys** — ein neuer Build sollte starten
3. Nach ~1-2 Minuten ist die Änderung live

---

## Umgebungsvariablen Übersicht

| Variable | Pflicht | Beschreibung |
|----------|---------|--------------|
| `PUBLIC_SANITY_PROJECT_ID` | Ja | Sanity Project ID (aus sanity.io/manage) |
| `PUBLIC_SANITY_DATASET` | Nein | Default: `production` |
| `PUBLIC_GSC_VERIFICATION` | Nein | Google Search Console Meta-Tag Verify-Code |
| `PUBLIC_BING_VERIFICATION` | Nein | Bing Webmaster Tools Verify-Code |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Nein | Domain für Plausible Analytics (z. B. `example.com`) |

---

## Sanity Studio deployen (optional)

Das Studio kann auch als Netlify-Site deployed werden, damit der Kunde keinen lokalen
Node-Prozess laufen lassen muss:

```bash
cd studio
npm run deploy
```

Sanity hostet das Studio dann auf `https://<project-name>.sanity.studio/`.

Alternativ: eigene Netlify-Site für das Studio anlegen:
- Build command: `npm run build`
- Publish directory: `dist`
- Root directory: `studio`
- Env vars: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`

---

## Häufige Probleme

**Build schlägt fehl: "Cannot find PUBLIC_SANITY_PROJECT_ID"**
→ Umgebungsvariable in Netlify UI setzen (nicht in `netlify.toml` committen)

**Webhook triggert keinen Build**
→ Prüfen ob der Filter `_type == "homePage"` stimmt und ob das Dokument gepublished
(nicht nur als Draft gespeichert) wurde

**Homepage zeigt Fallback-Banner trotz Sanity-Setup**
→ Dataset in Sanity stimmt nicht überein (`PUBLIC_SANITY_DATASET` != Dataset in Studio)
→ Oder: homePage-Dokument existiert in Sanity noch nicht
