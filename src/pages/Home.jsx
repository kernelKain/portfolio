import { openSource, profile } from '../data/portfolio.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { BlogFeed } from '../components/BlogFeed.jsx'
import { Icon } from '../components/Icon.jsx'
import { ProfileLinks } from '../components/ProfileLinks.jsx'
import { AchievementsContent, CertificationTemplates, EducationCard, OpenSourceTemplates, ProjectTemplates } from '../components/PortfolioSections.jsx'
import { StatsOverview } from '../components/StatsPanels.jsx'
import { TechStack } from '../components/TechStack.jsx'
import { CopyEmail, CopyValue, InfoRow, ProfilePhotoPlaceholder, ResumeButton, SectionHeading, StatusPill, TextLink } from '../components/UI.jsx'

function HomeSection({ id, title, description, action, children, className = '' }) {
  const headingId = `${id}-title`
  return (
    <section className={`home-section ${className}`} id={id} tabIndex="-1" aria-labelledby={headingId}>
      <div className="container">
        <SectionHeading id={headingId} title={title} description={description} action={action} />
        {children}
      </div>
    </section>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__content">
          <StatusPill>{profile.status} · {profile.availability}</StatusPill>
          <h1 id="hero-title">{profile.name}</h1>
          <p className="hero__title">{profile.title}</p>
          <dl className="hero__contact" aria-label="Contact details">
            <div>
              <dt><Icon name="mail" size={16} />Email</dt>
              <dd><CopyEmail email={profile.email} /></dd>
            </div>
            <div>
              <dt><Icon name="phone" size={16} />Phone</dt>
              <dd><CopyValue value={profile.phoneCopyValue} displayValue={profile.phone} label="phone number" /></dd>
            </div>
          </dl>
          <div className="hero__actions"><ResumeButton /></div>
        </div>
        <ProfilePhotoPlaceholder />
      </div>
    </section>
  )
}

function About() {
  return (
    <HomeSection id="about" title="About me">
      <div className="about-layout">
        <div className="about-content">{profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <aside className="facts-panel" aria-label="Quick facts">
          <InfoRow icon="activity" label="Status"><StatusPill>{profile.status}</StatusPill></InfoRow>
          <InfoRow icon="clock" label="Availability">Immediately</InfoRow>
          <InfoRow icon="users" label="Work setup">{profile.workSetup}</InfoRow>
          <InfoRow icon="graduation" label="Education">B.Tech, MNIT Jaipur · 2025</InfoRow>
        </aside>
      </div>
    </HomeSection>
  )
}

function Contact() {
  return (
    <HomeSection id="contact" title="Contact" description="Available immediately for full-time roles, internships, freelance work, and open-source collaboration." className="home-section--soft">
      <div className="contact-values contact-values--home">
        <div><span>Email</span><CopyEmail email={profile.email} /></div>
        <div><span>Phone</span><CopyValue value={profile.phoneCopyValue} displayValue={profile.phone} label="phone number" /></div>
        <div><span>Resume</span><ResumeButton variant="secondary" /></div>
      </div>
      <div className="contact-profiles">
        <h3>Find me online</h3>
        <ProfileLinks label="Developer and social profiles" />
      </div>
    </HomeSection>
  )
}

export default function Home() {
  usePageMeta({})
  return (
    <>
      <Hero />
      <About />
      <HomeSection id="tech-stack" title="Tech stack" className="home-section--soft"><TechStack /></HomeSection>
      <HomeSection id="achievements" title="Achievements" description="Live statistics from LeetCode, GitHub, and Codeforces." className="home-section--feature">
        <StatsOverview />
        <AchievementsContent />
      </HomeSection>
      <HomeSection id="education" title="Education"><EducationCard /></HomeSection>
      <HomeSection id="projects" title="Projects" description="Six project slots are ready to replace with real project information." className="home-section--soft"><ProjectTemplates /></HomeSection>
      <HomeSection
        id="open-source"
        title="Open source"
        description="Contributions to other projects: pull requests, issues, reviews, and programs."
        action={<TextLink to={openSource.pullRequestsUrl} external>Pull requests on GitHub</TextLink>}
      >
        <OpenSourceTemplates />
      </HomeSection>
      <HomeSection id="certifications" title="Certifications" className="home-section--soft"><CertificationTemplates /></HomeSection>
      <HomeSection id="blog" title="Blog" description="Latest articles from Dev.to, Hashnode, and Medium." action={<TextLink to="/writing">All articles</TextLink>}><BlogFeed limit={3} /></HomeSection>
      <Contact />
    </>
  )
}
