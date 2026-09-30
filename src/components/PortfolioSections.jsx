import { achievementSlots, certificationSlots, education, openSource, projectSlots } from '../data/portfolio.js'
import { useLiveStats } from '../hooks/useLiveStats.js'
import { Icon } from './Icon.jsx'
import { StatusPill } from './UI.jsx'

const number = new Intl.NumberFormat('en-IN')

// Built from the same live/last-known data as the stats cards, so the numbers never drift.
function leetcodeAchievements(data) {
  if (!data) return []
  const items = []
  if (data.badge) items.push(`Reached the ${data.badge} level on LeetCode.`)
  if (data.contestRating) items.push(`Achieved a LeetCode contest rating of ${number.format(Math.round(data.contestRating))}.`)
  if (data.solved) items.push(`Solved ${number.format(data.solved)} problems on LeetCode (${number.format(data.easy)} Easy, ${number.format(data.medium)} Medium, ${number.format(data.hard)} Hard).`)
  if (data.contestsAttended) items.push(`Participated in ${number.format(data.contestsAttended)} LeetCode contests.`)
  return items.map((text) => ({ text, source: 'LeetCode' }))
}

export function AchievementsContent() {
  const { providers } = useLiveStats()
  const achievements = leetcodeAchievements(providers.leetcode.data)
  return (
    <ul className="achievement-list">
      {achievements.map((item) => (
        <li key={item.text}>
          <span className="achievement-list__marker" aria-hidden="true"><Icon name="check" size={14} /></span>
          <span className="achievement-list__text">{item.text}</span>
          <span className="achievement-list__source">{item.source}</span>
        </li>
      ))}
      {achievementSlots.map((slot) => (
        <li className="is-placeholder" key={slot.id}>
          <span className="achievement-list__marker" aria-hidden="true" />
          <span className="achievement-list__text">{slot.name} <small>({slot.fields.join(' · ')})</small></span>
          <span className="achievement-list__source">TODO {slot.number}</span>
        </li>
      ))}
    </ul>
  )
}

export function EducationCard({ headingLevel = 'h3' }) {
  const Heading = headingLevel
  return (
    <article className="education-card">
      <span className="education-card__icon" aria-hidden="true"><Icon name="graduation" size={22} /></span>
      <div>
        <Heading>{education.institution}</Heading>
        <p>{education.degree}</p>
        <small>{education.campus}</small>
      </div>
      <div className="education-card__meta"><StatusPill>{education.status}</StatusPill><span>{education.period}</span></div>
    </article>
  )
}

export function ProjectTemplates() {
  return (
    <div className="project-grid">
      {projectSlots.map((project) => (
        <article className="project-template" key={project.id}>
          <div className="project-template__media"><Icon name="folder" size={22} /><span>Image / video</span></div>
          <div className="project-template__body">
            <span className="project-template__tag">TODO · Project {project.number}</span>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <ul>{project.fields.map((field) => <li key={field}>{field}</li>)}</ul>
          </div>
        </article>
      ))}
    </div>
  )
}

// Laid out like a pull-request list rather than project cards: recruiters scan for
// repository, change type, merge status, and evidence links.
export function OpenSourceTemplates() {
  return (
    <div className="oss">
      <dl className="oss-metrics">
        {openSource.metrics.map((metric) => (
          <div key={metric.id}>
            <dt><Icon name={metric.icon} size={15} />{metric.label}</dt>
            <dd>{metric.value ?? <span className="oss-metrics__todo">TODO</span>}</dd>
          </div>
        ))}
      </dl>

      <h3 className="oss__subheading">Contributions</h3>
      <ol className="oss-list">
        {openSource.contributions.map((item) => (
          <li className="oss-item" key={item.id}>
            <span className="oss-item__icon" aria-hidden="true"><Icon name="gitPullRequest" size={18} /></span>
            <div className="oss-item__body">
              <p className="oss-item__repo">{item.repository}</p>
              <h4>{item.title}</h4>
              <p className="oss-item__summary">{item.summary}</p>
              <ul className="oss-item__fields">{item.fields.map((field) => <li key={field}>{field}</li>)}</ul>
            </div>
            <div className="oss-item__meta">
              <span className="oss-item__status">Status · date</span>
              <span className="oss-item__type">{item.type}</span>
              <span className="oss-item__todo">TODO {item.number}</span>
            </div>
          </li>
        ))}
      </ol>

      <h3 className="oss__subheading">Programs & events</h3>
      <div className="todo-grid todo-grid--two">
        {openSource.programs.map((slot) => (
          <article className="todo-card" key={slot.id}>
            <div><Icon name="award" size={18} /><span>TODO {slot.number}</span></div>
            <h4>{slot.name}</h4>
            <p>{slot.fields.join(' · ')}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export function CertificationTemplates() {
  return (
    <div className="todo-grid">
      {certificationSlots.map((slot) => (
        <article className="todo-card" key={slot.id}>
          <div><Icon name="graduation" size={18} /><span>TODO {slot.number}</span></div>
          <h3>{slot.name}</h3>
          <p>{slot.fields.join(' · ')}</p>
        </article>
      ))}
    </div>
  )
}
