import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { pages, site } from '../src/data/portfolio.js'

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

function pageTitle(page) {
  return page.title ? `${page.title} — ${site.name}` : site.title
}

function renderHead(template, page, siteUrl) {
  const values = {
    SITE_URL: siteUrl,
    PAGE_URL: `${siteUrl}${page.path}`,
    PAGE_TITLE: pageTitle(page),
    PAGE_DESCRIPTION: page.description,
    IMAGE_URL: `${siteUrl}${site.imagePath}`,
    IMAGE_ALT: site.imageAlt,
  }
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (match, key) => (key in values ? escapeHtml(values[key]) : match))
}

/**
 * Crawlers used for link previews (LinkedIn, X, WhatsApp, Discord) do not run JavaScript,
 * so every indexable route gets its own static HTML file with the correct title,
 * description, canonical URL, and absolute Open Graph URLs. Also emits sitemap.xml and robots.txt.
 */
export function staticHeadPlugin({ siteUrl }) {
  let template = null
  return {
    name: 'portfolio:static-head',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        template = html
        return renderHead(html, pages[0], siteUrl)
      },
    },
    generateBundle() {
      if (!template) this.error('index.html template was not captured')
      for (const page of pages.slice(1)) {
        // Served at /projects etc. through `cleanUrls` in vercel.json.
        this.emitFile({ type: 'asset', fileName: `${page.path.slice(1)}.html`, source: renderHead(template, page, siteUrl) })
      }
      const urls = pages.map((page) => `  <url><loc>${escapeHtml(`${siteUrl}${page.path}`)}</loc></url>`).join('\n')
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n` })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n` })
    },
  }
}

// Adds the Express-style helpers Vercel Functions provide on top of Node's ServerResponse.
function vercelResponse(res) {
  res.status = (code) => { res.statusCode = code; return res }
  res.json = (body) => {
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(body))
    return res
  }
  return res
}

function apiMiddleware(root) {
  return async (req, res, next) => {
    const match = req.url?.match(/^\/api\/([a-z-]+)\/?(?:\?.*)?$/)
    if (!match) return next()
    const file = resolve(root, 'api', `${match[1]}.js`)
    try {
      // Cache-bust so edits to api/*.js apply without restarting the dev server.
      const { default: handler } = await import(`${pathToFileURL(file).href}?t=${Date.now()}`)
      await handler(req, vercelResponse(res))
    } catch (error) {
      if (error?.code === 'ERR_MODULE_NOT_FOUND') return next()
      console.error(`[local-api] /api/${match[1]} failed:`, error)
      if (!res.headersSent) vercelResponse(res).status(500).json({ error: 'Local API handler failed' })
    }
  }
}

// Mirrors vercel.json headers and redirects in `vite preview` so CSP and caching can be tested locally.
// Only handles the simple patterns used in vercel.json (literal paths and "(.*)" wildcards).
function vercelConfigMiddleware(root) {
  const config = JSON.parse(readFileSync(resolve(root, 'vercel.json'), 'utf8'))
  const toRegExp = (source) => new RegExp(`^${source}$`)
  const headerRules = (config.headers ?? []).map((rule) => ({ pattern: toRegExp(rule.source), headers: rule.headers }))
  const redirects = config.redirects ?? []
  return (req, res, next) => {
    const path = req.url?.split('?')[0] ?? '/'
    const redirect = redirects.find((rule) => rule.source === path)
    if (redirect) {
      res.statusCode = redirect.permanent ? 308 : 307
      res.setHeader('Location', redirect.destination)
      return res.end()
    }
    for (const rule of headerRules) {
      if (rule.pattern.test(path)) rule.headers.forEach(({ key, value }) => res.setHeader(key, value))
    }
    next()
  }
}

/** Runs the Vercel Functions in api/ inside `npm run dev` and `npm run preview`. */
export function localApiPlugin() {
  let root = process.cwd()
  return {
    name: 'portfolio:local-api',
    configResolved(config) { root = config.root },
    configureServer(server) { server.middlewares.use(apiMiddleware(root)) },
    configurePreviewServer(server) {
      server.middlewares.use(vercelConfigMiddleware(root))
      server.middlewares.use(apiMiddleware(root))
    },
  }
}
