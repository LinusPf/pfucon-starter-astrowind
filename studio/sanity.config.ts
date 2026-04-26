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
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
