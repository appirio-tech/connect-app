import React from 'react'
import './ProjectDirectLinks.scss'

function ProjectDirectLink({ directLinks }) {
  if (!directLinks) return null

  return (
    <div className="project-direct-links">
      <ul>
        {directLinks.map((link, i) => <li key={i}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.name}</a></li>)}
      </ul>
    </div>
  )
}

export default ProjectDirectLink
