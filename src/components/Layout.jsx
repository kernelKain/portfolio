import { useEffect, useMemo, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { footerProfiles, homeSections, profile } from '../data/portfolio.js'
import { useActiveSection } from '../hooks/useActiveSection.js'
import { useTheme } from '../hooks/useTheme.js'
import { Brand } from './Brand.jsx'
import { ProfileLinks } from './ProfileLinks.jsx'
import { ThemeToggle } from './ThemeToggle.jsx'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
      if (hash) {
        const target = document.getElementById(hash.slice(1))
        if (target) { target.scrollIntoView({ behavior, block: 'start' }); target.focus({ preventScroll: true }); return }
      }
      window.scrollTo({ top: 0, behavior: 'auto' })
      document.getElementById('main-content')?.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [hash, pathname])
  return null
}

function Header() {
  const navRef = useRef(null)
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const onHome = pathname === '/'
  const sectionIds = useMemo(() => homeSections.map(({ id }) => id), [])
  const activeSection = useActiveSection(sectionIds, onHome)

  // Keep the active link visible when the nav row overflows horizontally (small screens).
  useEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector('.is-active')
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return
    const left = link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2
    nav.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [activeSection])

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand />
        <nav className="site-nav" aria-label="Primary navigation" ref={navRef}>
          {homeSections.map(({ id, label }) => {
            const active = onHome && activeSection === id
            const props = { className: `site-nav__link${active ? ' is-active' : ''}`, 'aria-current': active ? 'location' : undefined }
            return onHome ? <a {...props} href={`#${id}`} key={id}>{label}</a> : <Link {...props} to={`/#${id}`} key={id}>{label}</Link>
          })}
        </nav>
        <div className="site-header__actions"><ThemeToggle theme={theme} onToggle={toggleTheme} /></div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__compact">
        <Brand />
        <nav aria-label="Footer navigation">
          <Link to="/#about">About me</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/competitive-programming">Coding stats</Link>
          <Link to="/writing">Blog</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
        <div className="site-footer__end">
          <ProfileLinks items={footerProfiles} label="Profiles" compact />
          <span>© {new Date().getFullYear()} {profile.name}</span>
        </div>
      </div>
    </footer>
  )
}

export function Layout() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><ScrollManager /><Header /><main id="main-content" tabIndex="-1"><Outlet /></main><Footer /></>
}
