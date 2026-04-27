import type {APIRoute} from 'astro'

export const GET: APIRoute = ({site}) => {
  const sitemapUrl = new URL('/sitemap-index.xml', site).href

  const content = `User-agent: *
Allow: /
Disallow: /admin/

# Sitemap
Sitemap: ${sitemapUrl}

# AI Crawlers — kommentierte Blöcke, pro Kundenprojekt aktivierbar:

# GPTBot (OpenAI / ChatGPT)
# User-agent: GPTBot
# Disallow: /

# ClaudeBot (Anthropic)
# User-agent: ClaudeBot
# Disallow: /

# Google-Extended (Gemini Training)
# User-agent: Google-Extended
# Disallow: /

# Applebot-Extended (Apple AI)
# User-agent: Applebot-Extended
# Disallow: /
`

  return new Response(content, {
    headers: {'Content-Type': 'text/plain; charset=utf-8'},
  })
}
