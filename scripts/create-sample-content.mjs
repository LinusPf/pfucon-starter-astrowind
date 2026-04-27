#!/usr/bin/env node
// create-sample-content.mjs
// Legt ein erstes homePage-Dokument mit Sample-Widgets in Sanity an.
// Wird von setup-new-client.sh aufgerufen — Env-Vars werden von dort gesetzt.
import {createClient} from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset   = process.env.SANITY_DATASET   ?? 'production'
const token     = process.env.SANITY_TOKEN
const clientName = process.env.CLIENT_NAME     ?? 'Mein Unternehmen'

if (!projectId || !token) {
  console.error('[create-sample-content] SANITY_PROJECT_ID und SANITY_TOKEN erforderlich.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const doc = {
  _id: 'homePage',
  _type: 'homePage',
  title: `${clientName} — Startseite`,
  description: `Willkommen bei ${clientName}. Hier steht Ihre kurze Beschreibung für Suchmaschinen.`,
  pageBuilder: [
    {
      _key: 'hero-sample',
      _type: 'heroWidget',
      tagline: 'Willkommen',
      title: `${clientName}`,
      subtitle: 'Ihre professionelle Website — powered by PfuCon Starter.',
      actions: [
        {_key: 'cta-1', _type: 'ctaButton', text: 'Mehr erfahren', href: '#features', variant: 'primary'},
        {_key: 'cta-2', _type: 'ctaButton', text: 'Kontakt', href: '/contact', variant: 'secondary'},
      ],
    },
    {
      _key: 'note-sample',
      _type: 'noteWidget',
      title: 'Unsere Philosophie:',
      description: 'Qualität, Verlässlichkeit und persönlicher Service.',
      icon: 'tabler:info-square',
    },
    {
      _key: 'features-sample',
      _type: 'featuresWidget',
      variant: 'features',
      tagline: 'Leistungen',
      title: 'Was wir für Sie tun',
      subtitle: 'Ersetze diese Beispiel-Inhalte im Sanity Studio mit deinen echten Leistungen.',
      items: [
        {_key: 'f1', _type: 'widgetItem', title: 'Leistung 1', description: 'Beschreibung der ersten Leistung.', icon: 'tabler:star'},
        {_key: 'f2', _type: 'widgetItem', title: 'Leistung 2', description: 'Beschreibung der zweiten Leistung.', icon: 'tabler:rocket'},
        {_key: 'f3', _type: 'widgetItem', title: 'Leistung 3', description: 'Beschreibung der dritten Leistung.', icon: 'tabler:check'},
      ],
    },
    {
      _key: 'cta-sample',
      _type: 'callToActionWidget',
      title: 'Bereit loszulegen?',
      subtitle: 'Kontaktiere uns und wir melden uns innerhalb von 24 Stunden.',
      actions: [
        {_key: 'cta-main', _type: 'ctaButton', text: 'Jetzt anfragen', href: '/contact', variant: 'primary'},
      ],
    },
  ],
}

try {
  // createOrReplace so the script is idempotent
  await client.createOrReplace(doc)
  console.log(`[create-sample-content] homePage-Dokument angelegt (ID: ${doc._id})`)
} catch (err) {
  console.error('[create-sample-content] Fehler:', err.message)
  process.exit(1)
}
