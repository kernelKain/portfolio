import { useEffect, useState } from 'react'
import fallbackData from '../data/stats-fallback.json'

// Same last-known values the /api/stats function falls back to.
export const statsFallback = fallbackData.providers

let statsPromise

function validProvider(provider, fallback) {
  if (!provider || !['live', 'cached', 'fallback', 'unavailable'].includes(provider.status)) return fallback
  if (provider.status !== 'unavailable' && !provider.data) return fallback
  return provider
}

async function requestStats() {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 9000)
  try {
    const response = await fetch('/api/stats', {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    if (!response.ok) throw new Error('Statistics are unavailable')
    const payload = await response.json()
    if (!payload?.providers) throw new Error('Invalid statistics response')
    return {
      checkedAt: payload.checkedAt ?? null,
      providers: {
        github: validProvider(payload.providers.github, statsFallback.github),
        leetcode: validProvider(payload.providers.leetcode, statsFallback.leetcode),
        codeforces: validProvider(payload.providers.codeforces, statsFallback.codeforces),
      },
    }
  } finally {
    window.clearTimeout(timeout)
  }
}

function getStats() {
  if (!statsPromise) {
    statsPromise = requestStats().catch(() => {
      statsPromise = undefined
      return { checkedAt: null, providers: statsFallback }
    })
  }
  return statsPromise
}

export function useLiveStats() {
  const [state, setState] = useState({ loading: true, checkedAt: null, providers: statsFallback })

  useEffect(() => {
    let active = true
    getStats().then((result) => {
      if (active) setState({ loading: false, ...result })
    })
    return () => { active = false }
  }, [])

  return state
}
