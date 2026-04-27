import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'PfuCon Studio',

  // Swap PLACEHOLDER_PROJECT_ID with the actual Sanity project ID per customer.
  // Run: npx sanity init --project-id <id> OR set via scripts/setup-new-client.sh
  projectId: 'PLACEHOLDER_PROJECT_ID',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Inhalt')
          .items([
            // Singletons — jeweils genau ein Dokument
            S.listItem()
              .title('Homepage')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem()
              .title('Site-Einstellungen')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            // Alle anderen Dokument-Typen normal
            ...S.documentTypeListItems().filter(
              (item) => !['homePage', 'siteSettings'].includes(item.getId() ?? '')
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
