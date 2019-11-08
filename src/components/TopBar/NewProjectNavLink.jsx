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
      <a
        href={link}
        className="tc-btn tc-btn-sm tc-btn-primary"
      >+ New Project</a>
    )
  } else {
    return (
      <div className="new-project-link">
        <Link
          to={link} className="tc-btn tc-btn-sm tc-btn-primary"
        >+ New Project</Link>
      </div>
    )
  }
}

NewProjectNavLink.propTypes = {
  compact: PropTypes.bool,
  link: PropTypes.string
}

export default NewProjectNavLink
