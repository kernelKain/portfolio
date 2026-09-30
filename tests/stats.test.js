import { describe, expect, it } from 'vitest'
import { normalizeCodeforces, normalizeGithub, normalizeLeetcode } from '../api/stats.js'
import fallbackData from '../src/data/stats-fallback.json'

const leetcodePayload = (contest) => ({
  data: {
    matchedUser: {
      username: 'kernelKain',
      submitStats: {
        acSubmissionNum: [
          { difficulty: 'All', count: 800 },
          { difficulty: 'Easy', count: 200 },
          { difficulty: 'Medium', count: 480 },
          { difficulty: 'Hard', count: 120 },
        ],
      },
    },
    userContestRanking: contest,
  },
})

describe('normalizeLeetcode', () => {
  it('returns live solved counts and contest data', () => {
    const result = normalizeLeetcode(leetcodePayload({ attendedContestsCount: 50, rating: 1912.4, globalRanking: 40000, totalParticipants: 900000, badge: { name: 'Knight' } }))
    expect(result.status).toBe('live')
    expect(result.asOf).toBeUndefined()
    expect(result.data).toMatchObject({ solved: 800, easy: 200, medium: 480, hard: 120, contestRating: 1912.4, badge: 'Knight', globalRanking: 40000, totalParticipants: 900000, contestsAttended: 50 })
  })

  it('keeps live solved counts but falls back to last-known contest data when ranking is missing', () => {
    const result = normalizeLeetcode(leetcodePayload(null))
    expect(result.status).toBe('fallback')
    expect(result.asOf).toBe(fallbackData.providers.leetcode.asOf)
    expect(result.data.solved).toBe(800)
    expect(result.data.contestRating).toBe(fallbackData.providers.leetcode.data.contestRating)
  })

  it('treats a missing badge as null', () => {
    const result = normalizeLeetcode(leetcodePayload({ attendedContestsCount: 1, rating: 1500, globalRanking: 1, totalParticipants: 2, badge: null }))
    expect(result.data.badge).toBeNull()
  })

  it.each([
    ['GraphQL errors', { errors: [{ message: 'That user does not exist.' }], data: { matchedUser: null } }],
    ['a missing user', { data: { matchedUser: null } }],
    ['an empty body', null],
  ])('throws on %s', (_, payload) => {
    expect(() => normalizeLeetcode(payload)).toThrow()
  })
})

describe('normalizeCodeforces', () => {
  it('maps a rated user', () => {
    const result = normalizeCodeforces({ status: 'OK', result: [{ handle: 'kernelKain', rating: 1400, maxRating: 1450, rank: 'specialist', maxRank: 'specialist' }] })
    expect(result).toEqual({ status: 'live', data: { handle: 'kernelKain', rating: 1400, maxRating: 1450, rank: 'specialist', maxRank: 'specialist', profileUrl: 'https://codeforces.com/profile/kernelKain' } })
  })

  it('reports an unrated user as Unrated', () => {
    const result = normalizeCodeforces({ status: 'OK', result: [{ handle: 'kernelKain' }] })
    expect(result.data).toMatchObject({ rating: null, rank: 'Unrated' })
  })

  it('throws on a failed response', () => {
    expect(() => normalizeCodeforces({ status: 'FAILED', comment: 'handles: User not found' })).toThrow()
  })
})

describe('normalizeGithub', () => {
  it('maps public profile counts', () => {
    expect(normalizeGithub({ login: 'kernelKain', public_repos: 12, followers: 5, following: 3, html_url: 'https://github.com/kernelKain' }).data).toEqual({ username: 'kernelKain', publicRepos: 12, followers: 5, following: 3, profileUrl: 'https://github.com/kernelKain' })
  })

  it('throws when the profile is missing', () => {
    expect(() => normalizeGithub({ message: 'Not Found' })).toThrow()
  })
})

describe('shared fallback data', () => {
  it('has a valid provider shape for the frontend', () => {
    const { providers } = fallbackData
    expect(providers.github).toEqual({ status: 'unavailable', data: null })
    for (const name of ['leetcode', 'codeforces']) {
      expect(providers[name].status).toBe('fallback')
      expect(providers[name].asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(providers[name].data).toBeTruthy()
    }
  })
})
