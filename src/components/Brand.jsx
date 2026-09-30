import { Link } from 'react-router-dom'

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Kshitij Jain — home">
      <span className="brand__initials">KJ</span>
      <span>Kshitij Jain</span>
    </Link>
  )
}
