import { useState } from 'react'
import { blogSources } from '../data/portfolio.js'
import { useArticles } from '../hooks/useArticles.js'
import { BrandIcon } from './BrandIcon.jsx'
import { Icon } from './Icon.jsx'

export function BlogFeed({ limit }) {
  const { loading, articles, providers } = useArticles()
  const [source, setSource] = useState('All')
  const sources = ['All', ...blogSources.map((item) => item.label)]
  const filtered = source === 'All' ? articles : articles.filter((article) => article.source === source)
  const visible = typeof limit === 'number' ? filtered.slice(0, limit) : filtered

  return (
    <div className="blog-feed">
      <div className="blog-filters" role="group" aria-label="Filter articles by source">
        {sources.map((item) => <button aria-pressed={source === item} className={source === item ? 'is-active' : ''} key={item} onClick={() => setSource(item)} type="button">{item}</button>)}
      </div>
      {loading ? (
        <div className="article-grid" aria-busy="true" aria-label="Loading articles"><i className="article-skeleton" /><i className="article-skeleton" /><i className="article-skeleton" /></div>
      ) : visible.length ? (
        <div className="article-grid">
          {visible.map((article) => (
            <article className="article-card" key={article.id}>
              <div className="article-card__source"><BrandIcon name={blogSources.find((item) => item.label === article.source)?.icon || 'code'} size={17} /><span>{article.source}</span></div>
              <h3><a href={article.url} target="_blank" rel="noreferrer">{article.title}<span className="sr-only"> (opens in a new tab)</span></a></h3>
              {article.description && <p>{article.description}</p>}
              <div className="article-card__meta"><time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time>{article.readingTime && <span>{article.readingTime} min read</span>}<Icon name="external" size={14} /></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="blog-empty"><p>No articles were returned by the selected source.</p><div>{blogSources.map((item) => <a href={item.href} key={item.label} target="_blank" rel="noreferrer"><BrandIcon name={item.icon} size={17} />{item.label}<Icon name="external" size={13} /><span className="sr-only"> (opens in a new tab)</span></a>)}</div></div>
      )}
      {!loading && providers.some((provider) => provider.status === 'unavailable') && <p className="provider-note">Some publishing services are temporarily unavailable. Available articles are still shown.</p>}
    </div>
  )
}
