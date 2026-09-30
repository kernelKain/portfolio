import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { legacyRedirects, pages } from '../src/data/portfolio.js'

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
const globalHeaders = vercel.headers.find((rule) => rule.source === '/(.*)').headers
const csp = globalHeaders.find((header) => header.key === 'Content-Security-Policy').value

describe('Content-Security-Policy', () => {
  it('allows every executable inline script in index.html by hash', () => {
    // Plain <script> blocks run and need a hash. JSON-LD (type="application/ld+json") is data and is not subject to script-src.
    const inlineScripts = [...indexHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1])
    expect(inlineScripts.length).toBeGreaterThan(0)
    for (const script of inlineScripts) {
      const hash = `'sha256-${createHash('sha256').update(script).digest('base64')}'`
      expect(csp, 'Update the hash in vercel.json after editing the inline theme script').toContain(hash)
    }
  })

  it('does not allow unsafe inline or eval scripts', () => {
    const scriptSrc = csp.split(';').map((part) => part.trim()).find((part) => part.startsWith('script-src'))
    expect(scriptSrc).not.toMatch(/unsafe-inline|unsafe-eval/)
  })
})

describe('routing config', () => {
  it('keeps vercel.json redirects in sync with legacyRedirects', () => {
    const fromVercel = vercel.redirects.map(({ source, destination }) => ({ from: source, to: destination }))
    expect(fromVercel).toEqual(legacyRedirects)
  })

  it('does not redirect any indexable page', () => {
    const redirected = new Set(legacyRedirects.map(({ from }) => from))
    expect(pages.filter((page) => redirected.has(page.path))).toEqual([])
  })
})
