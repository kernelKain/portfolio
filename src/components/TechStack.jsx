import { useState } from 'react'
import { techCategories } from '../data/portfolio.js'
import { BrandIcon } from './BrandIcon.jsx'

const allSkills = techCategories.flatMap((category) => category.skills.map((skill) => ({ ...skill, category: category.id })))

export function TechStack() {
  const [selected, setSelected] = useState('all')
  const [hovered, setHovered] = useState(null)
  const active = hovered || selected
  const filters = [{ id: 'all', label: 'All', count: allSkills.length }, ...techCategories.map((category) => ({ id: category.id, label: category.label, count: category.skills.length }))]

  return (
    <div className="tech-stack">
      <div className="stack-filters" role="group" aria-label="Filter technologies by category">
        {filters.map((filter) => (
          <button
            aria-pressed={selected === filter.id}
            className={selected === filter.id ? 'is-active' : ''}
            key={filter.id}
            onBlur={() => setHovered(null)}
            onClick={() => setSelected(filter.id)}
            onFocus={() => setHovered(filter.id)}
            onMouseEnter={() => setHovered(filter.id)}
            onMouseLeave={() => setHovered(null)}
            type="button"
          >
            {filter.label}<span>{filter.count}</span>
          </button>
        ))}
      </div>
      <ul className="stack-matrix">
        {allSkills.map((skill) => {
          const muted = active !== 'all' && active !== skill.category
          return (
            <li className={muted ? 'is-muted' : undefined} key={`${skill.category}-${skill.name}`}>
              <BrandIcon name={skill.icon} size={22} plain />
              <span>{skill.name}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
