import {client, isSanityConfigured} from './sanity'

export const homePageQuery = `*[_type == "homePage"][0]{
  title,
  description,
  pageBuilder[]{
    _type,
    _key,
    ...
  }
}`

export interface SanityHomePage {
  title?: string
  description?: string
  pageBuilder?: SanityWidget[]
}

export type SanityWidget = Record<string, unknown> & {
  _type: string
  _key: string
}

export async function fetchHomePage(): Promise<SanityHomePage | null> {
  if (!isSanityConfigured) return null
  try {
    return await client.fetch<SanityHomePage>(homePageQuery)
  } catch {
    return null
  }
}
