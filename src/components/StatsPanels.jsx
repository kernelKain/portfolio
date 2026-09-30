import { statsFallback, useLiveStats } from '../hooks/useLiveStats.js'
import { StatusPill, TextLink } from './UI.jsx'

const number = new Intl.NumberFormat('en-IN')
const formatAsOf = (isoDate) => new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

function ProviderStatus({ status, loading }) {
  if (loading) return <span className="data-status">Checking</span>
  if (status === 'live') return <span className="data-status data-status--live">Current</span>
  if (status === 'cached') return <span className="data-status data-status--live">Cached</span>
  if (status === 'fallback') return <span className="data-status">Last known</span>
  return <span className="data-status">Unavailable</span>
}

function Stat({ label, value }) {
  return <div className="stat"><strong>{value ?? '—'}</strong><span>{label}</span></div>
}

function LoadingStats({ label, count = 3 }) {
  return <div className="skeleton-grid" aria-label={label} aria-live="polite" aria-busy="true" role="status">{Array.from({ length: count }, (_, index) => <i key={index} />)}</div>
}

function GithubCard({ provider, loading, detailed }) {
  const data = provider.data
  return (
    <article className="data-card">
      <div className="data-card__heading"><div><p>GitHub</p><h3>@kernelKain</h3></div><ProviderStatus status={provider.status} loading={loading} /></div>
      {loading ? <LoadingStats label="Loading GitHub statistics" count={2} /> : data ? <div className="stats-grid"><Stat label="Public repos" value={number.format(data.publicRepos)} /><Stat label="Followers" value={number.format(data.followers)} />{detailed && <Stat label="Following" value={number.format(data.following)} />}</div> : <p className="data-card__message">Counts unavailable.</p>}
      <TextLink to="https://github.com/kernelKain" external>Open profile</TextLink>
    </article>
  )
}

function LeetCodeCard({ provider, loading, detailed }) {
  const data = provider.data
  return (
    <article className="data-card">
      <div className="data-card__heading"><div><p>LeetCode</p><h3>kernelKain</h3></div><ProviderStatus status={provider.status} loading={loading} /></div>
      {loading ? <LoadingStats label="Loading LeetCode statistics" /> : data ? <><div className="stats-grid stats-grid--three"><Stat label="Solved" value={number.format(data.solved)} /><Stat label="Rating" value={number.format(Math.round(data.contestRating))} /><Stat label="Level" value={data.badge || '—'} /></div>{detailed && <><div className="difficulty-list"><span>Easy <strong>{number.format(data.easy)}</strong></span><span>Medium <strong>{number.format(data.medium)}</strong></span><span>Hard <strong>{number.format(data.hard)}</strong></span></div><div className="stats-grid"><Stat label="Contests" value={number.format(data.contestsAttended)} /><Stat label="Global rank" value={data.globalRanking ? `#${number.format(data.globalRanking)}` : '—'} /></div></>}</> : <p className="data-card__message">Statistics unavailable.</p>}
      <TextLink to="https://leetcode.com/u/kernelKain/" external>Open profile</TextLink>
    </article>
  )
}

// Homepage highlight: larger accent numbers plus a proportional difficulty breakdown.
function LeetCodeFeatureCard({ provider, loading }) {
  const data = provider.data
  const total = data ? data.easy + data.medium + data.hard : 0
  const levels = data ? [
    { id: 'easy', label: 'Easy', value: data.easy },
    { id: 'medium', label: 'Medium', value: data.medium },
    { id: 'hard', label: 'Hard', value: data.hard },
  ] : []
  return (
    <article className="data-card data-card--feature">
      <div className="data-card__heading"><div><p>LeetCode</p><h3>kernelKain</h3></div><ProviderStatus status={provider.status} loading={loading} /></div>
      {loading ? <LoadingStats label="Loading LeetCode statistics" /> : data ? (
        <>
          <div className="feature-stats">
            <Stat label="Problems solved" value={number.format(data.solved)} />
            <Stat label="Contest rating" value={number.format(Math.round(data.contestRating))} />
            <Stat label="Level" value={data.badge || '—'} />
          </div>
          {total > 0 && (
            <div className="difficulty">
              <div className="difficulty__bar" aria-hidden="true">
                {levels.map((level) => <i className={`difficulty__segment difficulty__segment--${level.id}`} key={level.id} style={{ flexGrow: level.value }} />)}
              </div>
              <ul className="difficulty__legend">
                {levels.map((level) => <li key={level.id}><i className={`difficulty__dot difficulty__dot--${level.id}`} aria-hidden="true" />{level.label} <strong>{number.format(level.value)}</strong></li>)}
              </ul>
            </div>
          )}
        </>
      ) : <p className="data-card__message">Statistics unavailable.</p>}
      <TextLink to="https://leetcode.com/u/kernelKain/" external>Open profile</TextLink>
    </article>
  )
}

function CodeforcesCard({ provider, loading }) {
  const data = provider.data
  return <article className="data-card"><div className="data-card__heading"><div><p>Codeforces</p><h3>kernelKain</h3></div><ProviderStatus status={provider.status} loading={loading} /></div>{loading ? <LoadingStats label="Loading Codeforces statistics" count={2} /> : data ? <div className="stats-grid"><Stat label="Rank" value={data.rank || 'Unrated'} /><Stat label="Rating" value={data.rating ? number.format(data.rating) : '—'} /></div> : <p className="data-card__message">Statistics unavailable.</p>}<TextLink to="https://codeforces.com/profile/kernelKain" external>Open profile</TextLink></article>
}

export function StatsOverview() {
  const { loading, providers } = useLiveStats()
  return (
    <div className="stats-overview">
      <div className="data-grid data-grid--feature">
        <LeetCodeFeatureCard provider={providers.leetcode} loading={loading} />
        <GithubCard provider={providers.github} loading={loading} />
        <CodeforcesCard provider={providers.codeforces} loading={loading} />
      </div>
      <TextLink to="/competitive-programming" className="stats-overview__more">View full coding stats</TextLink>
    </div>
  )
}

export function StatsDetail() {
  const { loading, checkedAt, providers } = useLiveStats()
  const statuses = Object.values(providers).map((provider) => provider.status)
  const fallbackUsed = statuses.includes('fallback')
  const unavailableUsed = statuses.includes('unavailable')
  const summary = loading ? 'Checking data' : unavailableUsed ? 'Some data unavailable' : fallbackUsed ? 'Some last-known data shown' : 'Current data loaded'
  return <><div className="detail-status-line" aria-live="polite"><StatusPill tone={fallbackUsed || unavailableUsed ? 'neutral' : 'success'}>{summary}</StatusPill>{checkedAt && <span>Updated {new Date(checkedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>}</div><div className="data-grid data-grid--detail"><LeetCodeCard provider={providers.leetcode} loading={loading} detailed /><GithubCard provider={providers.github} loading={loading} detailed /><CodeforcesCard provider={providers.codeforces} loading={loading} /></div>{!loading && fallbackUsed && <p className="fallback-note">Last-known values are dated {formatAsOf(statsFallback.leetcode.asOf)}.</p>}</>
}
