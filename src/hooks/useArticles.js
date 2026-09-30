import { useEffect, useState } from 'react'

let articlesPromise

async function requestArticles() {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch('/api/articles', { headers: { Accept: 'application/json' }, signal: controller.signal })
    if (!response.ok) throw new Error('Articles unavailable')
    const payload = await response.json()
    if (!Array.isArray(payload.articles)) throw new Error('Invalid article response')
    return { articles: payload.articles, providers: payload.providers ?? [], checkedAt: payload.checkedAt ?? null }
  } finally {
    window.clearTimeout(timeout)
  }
}

function loadArticles() {
  if (!articlesPromise) {
    articlesPromise = requestArticles().catch(() => {
      articlesPromise = undefined
      return { articles: [], providers: [], checkedAt: null }
    })
  }
  return articlesPromise
}

export function useArticles() {
  const [state, setState] = useState({ loading: true, articles: [], providers: [], checkedAt: null })
  useEffect(() => {
    let active = true
    loadArticles().then((result) => { if (active) setState({ loading: false, ...result }) })
    return () => { active = false }
  }, [])
  return state
}
