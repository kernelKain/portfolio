import { Link } from 'react-router-dom'
import { resume } from '../data/portfolio.js'
import { useCopy } from '../hooks/useCopy.js'
import { Icon } from './Icon.jsx'

export function SectionHeading({ id, eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id}>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function TextLink({ to, children, external = false, className = '' }) {
  const content = <>{children}<Icon name={external ? 'external' : 'arrowRight'} size={15} /></>
  if (external) return <a className={`text-link ${className}`} href={to} target="_blank" rel="noreferrer">{content}<span className="sr-only"> (opens in a new tab)</span></a>
  return <Link className={`text-link ${className}`} to={to}>{content}</Link>
}

export function ButtonLink({ to, children, external = false, variant = 'primary', icon }) {
  const content = <>{icon && <Icon name={icon} size={17} />}{children}{external && <Icon name="external" size={14} />}</>
  if (external) return <a className={`button button--${variant}`} href={to} target="_blank" rel="noreferrer">{content}<span className="sr-only"> (opens in a new tab)</span></a>
  return <Link className={`button button--${variant}`} to={to}>{content}</Link>
}

export function CopyValue({ value, displayValue = value, label }) {
  const { state, copy } = useCopy()
  const handleCopy = () => copy(value)

  const feedback = state === 'copied' ? 'Copied' : state === 'error' ? 'Copy failed' : ''
  return (
    <>
      <button
        aria-label={`Copy ${label} ${displayValue}`}
        className="email-copy"
        data-state={state}
        onClick={handleCopy}
        title={`Copy ${label}`}
        type="button"
      >
        <span className="email-copy__address">{displayValue}</span>
        <span className="email-copy__icon"><Icon name={state === 'copied' ? 'check' : 'copy'} size={15} /></span>
        {feedback && <span className="email-copy__feedback" aria-hidden="true">{feedback}</span>}
      </button>
      <span className="sr-only" role="status" aria-live="polite">{state === 'copied' ? `${label} copied: ${displayValue}` : state === 'error' ? `Unable to copy. ${label} is ${displayValue}` : ''}</span>
    </>
  )
}

export function CopyEmail({ email }) {
  return <CopyValue value={email} label="email address" />
}

// __RESUME_AVAILABLE__ is set at build time from whether public/resume.pdf exists (see vite.config.js).
export function ResumeButton({ variant = 'primary' }) {
  if (!__RESUME_AVAILABLE__) {
    return <span className="button button--disabled" aria-disabled="true"><Icon name="download" size={17} />Resume coming soon</span>
  }
  return (
    <a className={`button button--${variant}`} href={resume.path} download={resume.downloadName} type="application/pdf">
      <Icon name="download" size={17} />Download resume<span className="sr-only"> (PDF)</span>
    </a>
  )
}

export function StatusPill({ children, tone = 'success' }) {
  return <span className={`status-pill status-pill--${tone}`}><i aria-hidden="true" />{children}</span>
}

export function ComingSoon({ label, title, description }) {
  return <div className="coming-soon"><p className="eyebrow">{label}</p><h2>{title}</h2><p>{description}</p></div>
}

export function ProfilePhotoPlaceholder() {
  return <div className="profile-placeholder" aria-label="Profile photo coming soon" role="img"><span>KJ</span><small>Photo coming soon</small></div>
}

export function SkillCard({ group }) {
  return <article className="skill-group"><h3>{group.title}</h3><ul>{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></article>
}

export function PageHeader({ eyebrow, title, description }) {
  return <header className="page-header"><div className="container">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p>{description}</p>}</div></header>
}

export function InfoRow({ icon, label, children }) {
  return <div className="info-row"><Icon name={icon} size={17} /><div><span>{label}</span><div className="info-row__value">{children}</div></div></div>
}
