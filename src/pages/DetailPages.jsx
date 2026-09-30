import { Link } from 'react-router-dom'
import { pages } from '../data/portfolio.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { BlogFeed } from '../components/BlogFeed.jsx'
import { Icon } from '../components/Icon.jsx'
import { ProjectTemplates } from '../components/PortfolioSections.jsx'
import { StatsDetail } from '../components/StatsPanels.jsx'
import { PageHeader } from '../components/UI.jsx'

// Title and meta description come from `pages` in portfolio.js, the same source used for the static HTML heads.
function DetailPage({ path, title, lead, children }) {
  const meta = pages.find((page) => page.path === path)
  usePageMeta({ title: meta.title, description: meta.description })
  return <div className="detail-page"><PageHeader title={title} description={lead} /><div className="container detail-page__content">{children}</div></div>
}

export function CompetitiveProgrammingPage() {
  return <DetailPage path="/competitive-programming" title="Competitive programming" lead="Current and last-known profile statistics."><StatsDetail /></DetailPage>
}

export function ProjectsPage() {
  return <DetailPage path="/projects" title="Projects" lead="Project templates ready for real content."><ProjectTemplates /></DetailPage>
}

export function WritingPage() {
  return <DetailPage path="/writing" title="Blog" lead="Articles from Dev.to, Hashnode, and Medium."><BlogFeed /></DetailPage>
}

export function NotFoundPage() {
  usePageMeta({ title: 'Page not found', description: 'The requested portfolio page could not be found.', noIndex: true })
  return <div className="not-found container"><span className="not-found__code">404</span><h1>Page not found.</h1><Link className="button button--primary" to="/"><Icon name="home" size={18} />Return home</Link></div>
}
