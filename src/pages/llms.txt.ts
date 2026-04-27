import type {APIRoute} from 'astro'
import {fetchSiteSettings, fetchHomePage} from '~/lib/queries'
import {SITE} from 'astrowind:config'
import {fetchPosts} from '~/utils/blog'
import {getPermalink} from '~/utils/permalinks'

export const GET: APIRoute = async ({site}) => {
  const siteUrl = site?.href ?? SITE?.site ?? ''
  const [settings, homePage, posts] = await Promise.all([
    fetchSiteSettings().catch(() => null),
    fetchHomePage().catch(() => null),
    fetchPosts().catch(() => []),
  ])

  const siteName = settings?.siteName ?? SITE?.name ?? 'PfuCon Website'
  const tagline = settings?.tagline ?? ''
  const description = settings?.siteDescription ?? homePage?.description ?? ''

  // Blog-Posts der letzten 6 Monate
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const recentPosts = posts.filter((p) => p.publishDate >= sixMonthsAgo).slice(0, 20)

  const lines: string[] = []

  // Header gemäß llmstxt.org Spezifikation
  lines.push(`# ${siteName}`)
  if (tagline) lines.push(`> ${tagline}`)
  lines.push('')
  if (description) {
    lines.push(description)
    lines.push('')
  }

  // Hauptseiten
  lines.push('## Seiten')
  lines.push('')
  lines.push(`- [Startseite](${siteUrl}): Hauptseite`)
  lines.push(`- [Blog](${new URL('/blog', siteUrl).href}): Artikel und Neuigkeiten`)
  lines.push(`- [Kontakt](${new URL('/contact', siteUrl).href}): Kontaktformular`)
  lines.push('')

  // Aktuelle Blog-Posts
  if (recentPosts.length > 0) {
    lines.push('## Aktuelle Beiträge (letzte 6 Monate)')
    lines.push('')
    for (const post of recentPosts) {
      const url = new URL(getPermalink(post.permalink, 'post'), siteUrl).href
      const excerpt = post.excerpt ? `: ${post.excerpt}` : ''
      lines.push(`- [${post.title}](${url})${excerpt}`)
    }
    lines.push('')
  }

  // Optional: Seiteninfo für AI-Crawler
  lines.push('## Über diese Website')
  lines.push('')
  lines.push(`Diese Website wurde mit dem PfuCon Starter gebaut (Astro + Sanity + Tailwind CSS).`)
  lines.push(`Inhalte werden über Sanity CMS verwaltet und als statische Site deployed.`)

  return new Response(lines.join('\n'), {
    headers: {'Content-Type': 'text/plain; charset=utf-8'},
  })
}
