import React from 'react'
import './ProjectDirectLinks.scss'
import SVGIcons from '../../../../components/Icons/Icons'

function ProjectDirectLink({ directLinks }) {
  if (!directLinks) return null

  return (
    <div className="project-direct-links">
      <ul>
        {directLinks.map((link, i) => 
        <li key={i}><SVGIcons.IconDirectArrow className="icon-direct-arrow" />
        <a href={link.href} target="_blank" rel="noopener noreferrer">{link.name}</a></li>)}
      </ul>
    </div>
  )
}

export default ProjectDirectLink
