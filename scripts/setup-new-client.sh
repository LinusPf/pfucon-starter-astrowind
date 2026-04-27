#!/usr/bin/env bash
# setup-new-client.sh — PfuCon Starter: neues Kundenprojekt einrichten
# Usage: bash scripts/setup-new-client.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Farben ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()    { echo -e "${GREEN}[pfucon]${NC} $*"; }
warn()    { echo -e "${YELLOW}[pfucon]${NC} $*"; }
error()   { echo -e "${RED}[pfucon] ERROR:${NC} $*" >&2; }
confirm() { read -r -p "$(echo -e "${YELLOW}[pfucon]${NC} $* [j/N] ")" ans; [[ "$ans" =~ ^[jJyY]$ ]]; }

# ── Voraussetzungen prüfen ───────────────────────────────────────────────────
info "Prüfe Voraussetzungen..."
command -v node >/dev/null 2>&1 || { error "Node.js nicht gefunden. Installiere Node.js 18+."; exit 1; }
command -v npm  >/dev/null 2>&1 || { error "npm nicht gefunden."; exit 1; }

NODE_MAJOR=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
if [[ "$NODE_MAJOR" -lt 18 ]]; then
  error "Node.js 18+ erforderlich. Gefunden: $(node --version)"
  exit 1
fi

# ── Kundenname ───────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
echo "  PfuCon Starter — Neues Kundenprojekt"
echo "═══════════════════════════════════════════"
echo ""
read -r -p "$(echo -e "${YELLOW}[pfucon]${NC} Kundenname (z. B. 'Müller GmbH'): ")" CLIENT_NAME
if [[ -z "$CLIENT_NAME" ]]; then
  error "Kundenname darf nicht leer sein."; exit 1
fi

# Slug aus Name ableiten (lowercase, Leerzeichen → Bindestriche, Umlaute ersetzen)
CLIENT_SLUG=$(echo "$CLIENT_NAME" \
  | tr '[:upper:]' '[:lower:]' \
  | sed 's/ä/ae/g; s/ö/oe/g; s/ü/ue/g; s/ß/ss/g' \
  | sed 's/[^a-z0-9]/-/g' \
  | sed 's/--*/-/g; s/^-//; s/-$//')

info "Slug: $CLIENT_SLUG"

# ── Sanity Project ID ────────────────────────────────────────────────────────
echo ""
warn "Sanity-Projekt anlegen:"
echo "  Option A (empfohlen): Öffne https://sanity.io/manage → 'New project'"
echo "                        → Projekt anlegen → Project ID kopieren"
echo "  Option B (CLI):       Führe in einem neuen Terminal aus:"
echo "                        npx sanity@latest projects create --name \"$CLIENT_NAME\""
echo ""
read -r -p "$(echo -e "${YELLOW}[pfucon]${NC} Sanity Project ID eingeben: ")" SANITY_PROJECT_ID
if [[ -z "$SANITY_PROJECT_ID" ]]; then
  error "Project ID darf nicht leer sein."; exit 1
fi

SANITY_DATASET="production"
read -r -p "$(echo -e "${YELLOW}[pfucon]${NC} Dataset [production]: ")" SANITY_DATASET_INPUT
if [[ -n "$SANITY_DATASET_INPUT" ]]; then
  SANITY_DATASET="$SANITY_DATASET_INPUT"
fi

# ── .env anlegen ─────────────────────────────────────────────────────────────
ENV_FILE="$ROOT_DIR/.env"
if [[ -f "$ENV_FILE" ]]; then
  if ! confirm ".env existiert bereits. Überschreiben?"; then
    warn ".env nicht überschrieben. Überprüfe manuell ob PUBLIC_SANITY_PROJECT_ID gesetzt ist."
  else
    cat > "$ENV_FILE" <<EOF
# Generiert von scripts/setup-new-client.sh für: $CLIENT_NAME
PUBLIC_SANITY_PROJECT_ID=$SANITY_PROJECT_ID
PUBLIC_SANITY_DATASET=$SANITY_DATASET
EOF
    info ".env erstellt."
  fi
else
  cat > "$ENV_FILE" <<EOF
# Generiert von scripts/setup-new-client.sh für: $CLIENT_NAME
PUBLIC_SANITY_PROJECT_ID=$SANITY_PROJECT_ID
PUBLIC_SANITY_DATASET=$SANITY_DATASET
EOF
  info ".env erstellt."
fi

# ── studio/sanity.config.ts patchen ──────────────────────────────────────────
STUDIO_CONFIG="$ROOT_DIR/studio/sanity.config.ts"
if grep -q "PLACEHOLDER_PROJECT_ID" "$STUDIO_CONFIG"; then
  sed -i "s/PLACEHOLDER_PROJECT_ID/$SANITY_PROJECT_ID/g" "$STUDIO_CONFIG"
  info "studio/sanity.config.ts: Project ID gesetzt ($SANITY_PROJECT_ID)"
else
  warn "studio/sanity.config.ts: PLACEHOLDER_PROJECT_ID nicht gefunden. Bitte manuell prüfen."
fi

# ── Auch das Dataset im Studio setzen (falls abweichend von production) ──────
if [[ "$SANITY_DATASET" != "production" ]]; then
  sed -i "s/dataset: 'production'/dataset: '$SANITY_DATASET'/g" "$STUDIO_CONFIG"
  info "studio/sanity.config.ts: Dataset auf '$SANITY_DATASET' gesetzt."
fi

# ── Studio-Dependencies installieren ─────────────────────────────────────────
info "Studio-Dependencies installieren..."
(cd "$ROOT_DIR/studio" && npm install --silent)
info "npm install fertig."

# ── Schema deployen ───────────────────────────────────────────────────────────
echo ""
info "Schema in Sanity deployen..."
warn "Du wirst nach deinen Sanity-Zugangsdaten gefragt (Einmal-Login im Browser)."
(cd "$ROOT_DIR/studio" && npx sanity@latest deploy --no-spinner) || {
  error "Schema-Deploy fehlgeschlagen. Prüfe ob die Project ID korrekt ist und du eingeloggt bist."
  error "Manuell: cd studio && npx sanity deploy"
  exit 1
}
info "Schema deployed."

# ── Sample-Homepage-Dokument anlegen ─────────────────────────────────────────
echo ""
info "Sample-Homepage-Dokument anlegen..."
warn "Dafür wird ein Sanity API-Token benötigt."
echo "  Öffne: https://www.sanity.io/manage/project/$SANITY_PROJECT_ID/api"
echo "  → 'Add API token' → Name: 'Setup Script' → Permissions: Editor → Speichern"
echo ""
read -r -p "$(echo -e "${YELLOW}[pfucon]${NC} Sanity API Token (oder Enter zum Überspringen): ")" SANITY_TOKEN

if [[ -n "$SANITY_TOKEN" ]]; then
  SANITY_TOKEN="$SANITY_TOKEN" \
  SANITY_PROJECT_ID="$SANITY_PROJECT_ID" \
  SANITY_DATASET="$SANITY_DATASET" \
  CLIENT_NAME="$CLIENT_NAME" \
    node "$SCRIPT_DIR/create-sample-content.mjs" && info "Sample-Dokument angelegt." \
    || warn "Sample-Dokument konnte nicht angelegt werden. Bitte manuell im Studio befüllen."
else
  warn "Übersprungen. Bitte Homepage-Dokument manuell im Sanity Studio anlegen."
fi

# ── Zusammenfassung ───────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
echo -e "  ${GREEN}Setup abgeschlossen!${NC}"
echo "═══════════════════════════════════════════"
echo ""
echo "  Kunde:       $CLIENT_NAME"
echo "  Sanity ID:   $SANITY_PROJECT_ID"
echo "  Dataset:     $SANITY_DATASET"
echo ""
echo "  Nächste Schritte:"
echo "  1. Astro Dev-Server:   npm run dev"
echo "  2. Sanity Studio:      cd studio && npm run dev"
echo "  3. Netlify-Deploy:     Env-Vars in Netlify UI setzen (PUBLIC_SANITY_PROJECT_ID)"
echo "  4. Webhook einrichten: siehe DEPLOYMENT.md"
echo ""
