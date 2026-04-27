import {createClient} from '@sanity/client'
import imageUrlBuilder, {type SanityImageSource} from '@sanity/image-url'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production'

export const isSanityConfigured = Boolean(projectId && projectId !== 'PLACEHOLDER_PROJECT_ID')

export const client = createClient({
  projectId: projectId ?? 'placeholder',
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/** Gibt eine fertige URL mit festen Dimensionen zurück (verhindert CLS). */
export function urlForFixed(source: SanityImageSource, width: number, height: number): string {
  return builder.image(source).width(width).height(height).fit('crop').url()
}
