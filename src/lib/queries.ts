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

// ── Site Settings ────────────────────────────────────────────────────────────

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteName,
  tagline,
  siteDescription,
  defaultOgImage,
  businessType,
  logo,
  address,
  telephone,
  email,
  url,
  openingHours,
  socialProfiles
}`

export interface SanitySiteSettings {
  siteName?: string
  tagline?: string
  siteDescription?: string
  defaultOgImage?: unknown
  businessType?: string
  logo?: unknown
  address?: {
    streetAddress?: string
    addressLocality?: string
    postalCode?: string
    addressCountry?: string
  }
  telephone?: string
  email?: string
  url?: string
  openingHours?: Array<{days: string; hours: string}>
  socialProfiles?: string[]
}

export async function fetchSiteSettings(): Promise<SanitySiteSettings | null> {
  if (!isSanityConfigured) return null
  try {
    return await client.fetch<SanitySiteSettings>(siteSettingsQuery)
  } catch {
    return null
  }
}
