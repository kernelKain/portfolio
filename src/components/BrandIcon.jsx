import {
  siApachemaven,
  siCodeforces,
  siCss,
  siDevdotto,
  siDiscord,
  siDocker,
  siGit,
  siGnubash,
  siGo,
  siGradle,
  siHashnode,
  siHibernate,
  siHtml5,
  siIntellijidea,
  siJunit5,
  siLeetcode,
  siLinux,
  siMedium,
  siMysql,
  siOpenjdk,
  siPeerlist,
  siProducthunt,
  siPython,
  siSpring,
  siSpringboot,
  siX,
  siGithub,
} from 'simple-icons'
import { Icon } from './Icon.jsx'

const icons = {
  apachemaven: siApachemaven,
  codeforces: siCodeforces,
  css: siCss,
  devdotto: siDevdotto,
  discord: siDiscord,
  docker: siDocker,
  git: siGit,
  github: siGithub,
  gnubash: siGnubash,
  go: siGo,
  gradle: siGradle,
  hashnode: siHashnode,
  hibernate: siHibernate,
  html5: siHtml5,
  intellijidea: siIntellijidea,
  junit5: siJunit5,
  leetcode: siLeetcode,
  linux: siLinux,
  medium: siMedium,
  mysql: siMysql,
  openjdk: siOpenjdk,
  peerlist: siPeerlist,
  producthunt: siProducthunt,
  python: siPython,
  spring: siSpring,
  springboot: siSpringboot,
  x: siX,
}

const fallbackIcons = {
  code: 'code',
  database: 'database',
  linkedin: 'users',
  server: 'server',
  terminal: 'terminal',
  visualstudiocode: 'code',
}

// Near-black brand colors (GitHub, X, OpenJDK, ...) disappear on dark surfaces,
// so they fall back to the theme text color instead.
function brandColor(hex) {
  const [r, g, b] = [0, 2, 4].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance < 0.04 ? undefined : `#${hex}`
}

export function BrandIcon({ name, size = 24, plain = false }) {
  const icon = icons[name]
  const className = `brand-icon${plain ? ' brand-icon--plain' : ''}`
  if (!icon) return <span className={`${className} brand-icon--fallback`} aria-hidden="true"><Icon name={fallbackIcons[name] || 'code'} size={size} /></span>

  const color = brandColor(icon.hex)
  return (
    <span className={className} style={color ? { '--brand-color': color } : undefined} aria-hidden="true">
      <svg fill="currentColor" height={size} viewBox="0 0 24 24" width={size}><path d={icon.path} /></svg>
    </span>
  )
}
