import { profiles } from '../data/portfolio.js'
import { useCopy } from '../hooks/useCopy.js'
import { BrandIcon } from './BrandIcon.jsx'
import { Icon } from './Icon.jsx'

// Profiles without an href (Discord) copy their handle instead of navigating.
function CopyProfile({ item, iconSize }) {
  const { state, copy } = useCopy(1800)
  const tip = state === 'copied' ? 'Copied' : state === 'error' ? 'Copy failed' : `${item.label} · copy`
  const message = state === 'copied' ? `${item.label} handle copied` : state === 'error' ? `Unable to copy. ${item.label} handle is ${item.copyValue}` : ''
  return (
    <>
      <button className="profile-links__item" data-state={state} onClick={() => copy(item.copyValue)} type="button" aria-label={`Copy ${item.label} handle ${item.copyValue}`}>
        {state === 'copied' ? <span className="brand-icon brand-icon--plain" aria-hidden="true"><Icon name="check" size={iconSize} /></span> : <BrandIcon name={item.icon} size={iconSize} plain />}
        <span className="profile-links__tip" aria-hidden="true">{tip}</span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">{message}</span>
    </>
  )
}

/** Compact, icon-only row of profile links with visible labels on hover and focus. */
export function ProfileLinks({ items = profiles, label = 'Profiles', compact = false }) {
  const iconSize = compact ? 17 : 20
  return (
    <ul className={`profile-links${compact ? ' profile-links--compact' : ''}`} aria-label={label}>
      {items.map((item) => (
        <li key={item.label}>
          {item.href ? (
            <a className="profile-links__item" href={item.href} target="_blank" rel="noreferrer" aria-label={`${item.label} (${item.handle}), opens in a new tab`}>
              <BrandIcon name={item.icon} size={iconSize} plain />
              <span className="profile-links__tip" aria-hidden="true">{item.label}</span>
            </a>
          ) : <CopyProfile item={item} iconSize={iconSize} />}
        </li>
      ))}
    </ul>
  )
}
