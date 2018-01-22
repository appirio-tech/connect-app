import React from 'react'
import PT from 'prop-types'
import './ProjectDirectLinks.scss'
import DirectArrow from '../../../../assets/icons/icon-direct-arrow.svg'


function ProjectDirectLink({ directLinks }) {
  if (!directLinks) return null

  return (
    <div className="project-direct-links">
      <ul>
        {directLinks.map((link, i) => 
        <li key={i}><DirectArrow className="icon-direct-arrow" />
        <a href={link.href} target="_blank" rel="noopener noreferrer">{link.name}</a></li>)}
      </ul>
    </div>
  )
}

export default ProjectDirectLink
