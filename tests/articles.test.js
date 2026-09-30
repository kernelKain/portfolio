import { describe, expect, it } from 'vitest'
import { normalizeDevTo, normalizeHashnode, parseMediumFeed, safeUrl } from '../api/articles.js'

const mediumFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[Stories by Kshitij Jain on Medium]]></title>
    <item>
      <title><![CDATA[Designing idempotent REST APIs &amp; retries]]></title>
      <link>https://medium.com/@kernelKain/idempotent-apis-123</link>
      <guid isPermaLink="false">https://medium.com/p/123</guid>
      <category><![CDATA[spring-boot]]></category>
      <category><![CDATA[backend]]></category>
      <pubDate>Tue, 29 Sep 2026 10:00:00 GMT</pubDate>
      <content:encoded><![CDATA[<figure><img src="https://cdn-images.medium.com/cover.png" /></figure><p>Retries are <strong>safe</strong> only when requests are idempotent.</p>]]></content:encoded>
    </item>
    <item>
      <title><![CDATA[Malicious entry]]></title>
      <link>javascript:alert(1)</link>
      <guid isPermaLink="false">https://medium.com/p/456</guid>
      <pubDate>Mon, 28 Sep 2026 10:00:00 GMT</pubDate>
      <content:encoded><![CDATA[<p>Should be dropped.</p>]]></content:encoded>
    </item>
    <item>
      <title><![CDATA[Bad date]]></title>
      <link>https://medium.com/@kernelKain/bad-date</link>
      <pubDate>not a date</pubDate>
    </item>
  </channel>
</rss>`

describe('safeUrl', () => {
  it('accepts absolute https URLs', () => {
    expect(safeUrl('https://dev.to/kernelkain/post')).toBe('https://dev.to/kernelkain/post')
    expect(safeUrl('  https://example.com  ')).toBe('https://example.com/')
  })

  it.each(['javascript:alert(1)', 'JAVASCRIPT:alert(1)', 'data:text/html,<script>alert(1)</script>', 'http://example.com', '//example.com', '/relative', '', null, undefined, 42])(
    'rejects %s',
    (value) => expect(safeUrl(value)).toBeNull(),
  )
})

describe('parseMediumFeed', () => {
  const articles = parseMediumFeed(mediumFeed)

  it('keeps only entries with a safe URL and valid date', () => {
    expect(articles).toHaveLength(1)
  })

  it('decodes CDATA and entities and normalizes fields', () => {
    expect(articles[0]).toEqual({
      id: 'medium-https://medium.com/p/123',
      source: 'Medium',
      title: 'Designing idempotent REST APIs & retries',
      description: 'Retries are safe only when requests are idempotent.',
      url: 'https://medium.com/@kernelKain/idempotent-apis-123',
      publishedAt: '2026-09-29T10:00:00.000Z',
      readingTime: null,
      image: 'https://cdn-images.medium.com/cover.png',
      tags: ['spring-boot', 'backend'],
    })
  })

  it('does not double-decode escaped entities', () => {
    const [article] = parseMediumFeed(`<item><title>Use &amp;lt;T&amp;gt; generics</title><link>https://medium.com/p/1</link><pubDate>Tue, 29 Sep 2026 10:00:00 GMT</pubDate></item>`)
    expect(article.title).toBe('Use &lt;T&gt; generics')
  })

  it('returns an empty list for an empty feed', () => {
    expect(parseMediumFeed('<rss><channel></channel></rss>')).toEqual([])
  })
})

describe('normalizeDevTo', () => {
  it('maps fields and drops unsafe links and images', () => {
    const articles = normalizeDevTo([
      { id: 1, title: 'Spring Boot tips', description: 'Short', url: 'https://dev.to/kernelkain/tips', published_at: '2026-09-01T00:00:00Z', reading_time_minutes: 4, cover_image: 'javascript:alert(1)', tag_list: ['java'] },
      { id: 2, title: 'Unsafe', url: 'javascript:alert(1)', published_at: '2026-09-02T00:00:00Z' },
    ])
    expect(articles).toHaveLength(1)
    expect(articles[0]).toMatchObject({ id: 'devto-1', source: 'Dev.to', readingTime: 4, image: null, tags: ['java'] })
  })

  it('throws on a non-array response so the provider is marked unavailable', () => {
    expect(() => normalizeDevTo({ error: 'rate limited' })).toThrow()
  })
})

describe('normalizeHashnode', () => {
  it('flattens publications and posts', () => {
    const payload = { data: { user: { publications: { edges: [{ node: { posts: { edges: [{ node: { id: 'a', title: 'Go channels', brief: 'Intro', url: 'https://kernelkain.hashnode.dev/go', publishedAt: '2026-08-01T00:00:00Z', readTimeInMinutes: 6, coverImage: { url: 'https://cdn.hashnode.com/c.png' }, tags: [{ name: 'go' }] } }] } } }] } } } }
    expect(normalizeHashnode(payload)).toEqual([{ id: 'hashnode-a', source: 'Hashnode', title: 'Go channels', description: 'Intro', url: 'https://kernelkain.hashnode.dev/go', publishedAt: '2026-08-01T00:00:00.000Z', readingTime: 6, image: 'https://cdn.hashnode.com/c.png', tags: ['go'] }])
  })

  it('throws on GraphQL errors', () => {
    expect(() => normalizeHashnode({ errors: [{ message: 'blocked' }] })).toThrow()
  })
})
