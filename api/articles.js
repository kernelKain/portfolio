const DEV_TO_URL = 'https://dev.to/api/articles?username=kernelkain&per_page=100'
const MEDIUM_URL = 'https://medium.com/feed/@kernelKain'
const HASHNODE_URL = 'https://gql.hashnode.com/graphql'
const HASHNODE_USERNAME = 'itskernelkain'

async function fetchWithTimeout(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(7000) })
  if (!response.ok) throw new Error(`Provider returned ${response.status}`)
  return response
}

// Feed values end up in href/src attributes, so only absolute https: URLs are accepted.
// This blocks javascript:, data:, and protocol-relative values from a compromised feed.
export function safeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

function safeDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function decodeXml(value = '') {
  return value
    .replace(/^<!\[CDATA\[|\]\]>$/g, '')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim()
}

function xmlValue(block, tag) {
  const escapedTag = tag.replace(':', '\\:')
  const match = block.match(new RegExp(`<${escapedTag}[^>]*>([\\s\\S]*?)<\\/${escapedTag}>`, 'i'))
  return decodeXml(match?.[1] ?? '')
}

function plainText(value) {
  return decodeXml(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).trim()
}

// Drops entries without a usable title, https URL, or date.
function finalize(articles) {
  return articles
    .map((article) => ({ ...article, url: safeUrl(article.url), image: safeUrl(article.image), publishedAt: safeDate(article.publishedAt) }))
    .filter((article) => article.title && article.url && article.publishedAt)
}

export function normalizeDevTo(articles) {
  if (!Array.isArray(articles)) throw new Error('Dev.to returned an invalid response')
  return finalize(articles.map((article) => ({
    id: `devto-${article.id}`,
    source: 'Dev.to',
    title: article.title,
    description: article.description || '',
    url: article.url,
    publishedAt: article.published_at,
    readingTime: article.reading_time_minutes ?? null,
    image: article.cover_image || article.social_image || null,
    tags: article.tag_list || [],
  })))
}

export function parseMediumFeed(xml) {
  return finalize([...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match, index) => {
    const block = match[1]
    const content = xmlValue(block, 'content:encoded')
    return {
      id: `medium-${xmlValue(block, 'guid') || index}`,
      source: 'Medium',
      title: xmlValue(block, 'title'),
      description: plainText(content).slice(0, 180),
      url: xmlValue(block, 'link'),
      publishedAt: xmlValue(block, 'pubDate'),
      readingTime: null,
      image: content.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? null,
      tags: [...block.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/gi)].map((entry) => decodeXml(entry[1])),
    }
  }))
}

export function normalizeHashnode(payload) {
  if (payload?.errors?.length) throw new Error('Hashnode returned an invalid response')
  const publications = payload?.data?.user?.publications?.edges ?? []
  return finalize(publications.flatMap(({ node: publication }) => publication.posts?.edges ?? []).map(({ node: article }) => ({
    id: `hashnode-${article.id}`,
    source: 'Hashnode',
    title: article.title,
    description: article.brief || '',
    url: article.url,
    publishedAt: article.publishedAt,
    readingTime: article.readTimeInMinutes ?? null,
    image: article.coverImage?.url ?? null,
    tags: article.tags?.map((tag) => tag.name) ?? [],
  })))
}

async function devToArticles() {
  const response = await fetchWithTimeout(DEV_TO_URL, { headers: { Accept: 'application/json' } })
  return normalizeDevTo(await response.json())
}

async function mediumArticles() {
  const response = await fetchWithTimeout(MEDIUM_URL, { headers: { Accept: 'application/rss+xml, application/xml, text/xml' } })
  return parseMediumFeed(await response.text())
}

async function hashnodeArticles() {
  const query = `
    query PortfolioPosts($username: String!) {
      user(username: $username) {
        publications(first: 10) {
          edges {
            node {
              posts(first: 50) {
                edges {
                  node {
                    id title brief url publishedAt readTimeInMinutes
                    coverImage { url }
                    tags { name }
                  }
                }
              }
            }
          }
        }
      }
    }
  `
  const response = await fetchWithTimeout(HASHNODE_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'kernelKain-portfolio' },
    body: JSON.stringify({ query, variables: { username: HASHNODE_USERNAME } }),
  })
  return normalizeHashnode(await response.json())
}

function providerResult(result, source) {
  return result.status === 'fulfilled'
    ? { source, status: 'available', count: result.value.length }
    : { source, status: 'unavailable', count: 0 }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const results = await Promise.allSettled([devToArticles(), mediumArticles(), hashnodeArticles()])
  const articles = results
    .flatMap((result) => result.status === 'fulfilled' ? result.value : [])
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  response.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400')
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  return response.status(200).json({
    checkedAt: new Date().toISOString(),
    articles,
    providers: [providerResult(results[0], 'Dev.to'), providerResult(results[1], 'Medium'), providerResult(results[2], 'Hashnode')],
  })
}
