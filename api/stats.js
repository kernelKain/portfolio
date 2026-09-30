import fallbackData from '../src/data/stats-fallback.json' with { type: 'json' }

// Single source of truth for usernames and last-known values, shared with the frontend.
const USERNAMES = fallbackData.usernames
const FALLBACK = fallbackData.providers

const leetcodeQuery = `
  query portfolioProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      badge { name }
    }
  }
`

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(6500),
  })
  if (!response.ok) throw new Error(`Provider returned ${response.status}`)
  return response.json()
}

export function normalizeGithub(data) {
  if (!data?.login) throw new Error('GitHub profile unavailable')
  return {
    status: 'live',
    data: {
      username: data.login,
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
      profileUrl: data.html_url,
    },
  }
}

export function normalizeLeetcode(payload) {
  if (payload?.errors?.length || !payload?.data?.matchedUser) throw new Error('LeetCode profile unavailable')
  const submissions = payload.data.matchedUser.submitStats?.acSubmissionNum ?? []
  const count = (difficulty) => submissions.find((entry) => entry.difficulty === difficulty)?.count ?? 0
  const contest = payload.data.userContestRanking

  return {
    // Solved counts are live either way; contest fields fall back to last-known values when missing.
    status: contest ? 'live' : 'fallback',
    asOf: contest ? undefined : FALLBACK.leetcode.asOf,
    data: {
      ...FALLBACK.leetcode.data,
      username: payload.data.matchedUser.username,
      solved: count('All'),
      easy: count('Easy'),
      medium: count('Medium'),
      hard: count('Hard'),
      ...(contest && {
        contestRating: contest.rating,
        badge: contest.badge?.name ?? null,
        globalRanking: contest.globalRanking,
        totalParticipants: contest.totalParticipants,
        contestsAttended: contest.attendedContestsCount,
      }),
    },
  }
}

export function normalizeCodeforces(payload) {
  if (payload?.status !== 'OK' || !payload.result?.[0]) throw new Error('Codeforces profile unavailable')
  const user = payload.result[0]
  return {
    status: 'live',
    data: {
      handle: user.handle,
      rating: user.rating ?? null,
      maxRating: user.maxRating ?? null,
      rank: user.rank ?? 'Unrated',
      maxRank: user.maxRank ?? null,
      profileUrl: `https://codeforces.com/profile/${encodeURIComponent(user.handle)}`,
    },
  }
}

async function githubStats() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'kernelKain-portfolio',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return normalizeGithub(await fetchJson(`https://api.github.com/users/${encodeURIComponent(USERNAMES.github)}`, { headers }))
}

async function leetcodeStats() {
  const payload = await fetchJson('https://leetcode.com/graphql/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'kernelKain-portfolio',
    },
    body: JSON.stringify({ query: leetcodeQuery, variables: { username: USERNAMES.leetcode } }),
  })
  return normalizeLeetcode(payload)
}

async function codeforcesStats() {
  return normalizeCodeforces(await fetchJson(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(USERNAMES.codeforces)}`))
}

function valueOrFallback(result, provider) {
  return result.status === 'fulfilled' ? result.value : FALLBACK[provider]
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const [github, leetcode, codeforces] = await Promise.allSettled([
    githubStats(),
    leetcodeStats(),
    codeforcesStats(),
  ])

  response.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=86400')
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  return response.status(200).json({
    checkedAt: new Date().toISOString(),
    providers: {
      github: valueOrFallback(github, 'github'),
      leetcode: valueOrFallback(leetcode, 'leetcode'),
      codeforces: valueOrFallback(codeforces, 'codeforces'),
    },
  })
}
