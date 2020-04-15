import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './NewProjectNavLink.scss'
import BoldAdd from '../../assets/icons/ui-16px-1_bold-add.svg'

const NewProjectNavLink = ({ compact=false, link }) => {
  if (compact && /^https?:\/\//.test(link)) {
    return (
      <a
        href={link}
        className="new-project-link"
      >
        <div className="new-project-icon">
          <BoldAdd className="icon-bold-add" />
        </div>
      </a>
    )
  } else if (compact) {
    return (
      <Link
        to={link} className="new-project-link"
      >
        <div className="new-project-icon">
          <BoldAdd className="icon-bold-add" />
        </div>
      </Link>
    )
  } else if (/^https?:\/\//.test(link)) {
    return (
      <button className="tc-btn tc-btn-sm tc-btn-primary"><a
        href={link}
      >+ New Project</a></button>
    )
  } else {
    return (
      <div className="new-project-link">
        <button className="tc-btn tc-btn-sm tc-btn-primary"><Link
          to={link} 
        >+ New Project</Link></button>
      </div>
    )
  }
}

NewProjectNavLink.propTypes = {
  compact: PropTypes.bool,
  link: PropTypes.string
}

export default NewProjectNavLink
