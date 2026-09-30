import { useEffect, useState } from 'react'

// Tracks which homepage section is currently under the sticky header while scrolling.
// A section becomes active once its top edge passes a line just below the header.
export function useActiveSection(sectionIds, enabled) {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    if (!enabled) return undefined
    let frame = 0

    const update = () => {
      frame = 0
      const headerHeight = document.querySelector('.site-header')?.offsetHeight ?? 0
      const line = headerHeight + Math.min(window.innerHeight * 0.3, 240)
      let current = ''
      for (const id of sectionIds) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= line) current = id
      }
      // The last sections may be too short to reach the line; activate the final one at page bottom.
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (scrolledToBottom && current) current = sectionIds[sectionIds.length - 1]
      setActiveSection(current)
    }

    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [enabled, sectionIds])

  return enabled ? activeSection : ''
}
