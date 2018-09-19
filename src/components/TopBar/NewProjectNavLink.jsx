import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './NewProjectNavLink.scss'
import BoldAdd from '../../assets/icons/ui-16px-1_bold-add.svg'


const NewProjectNavLink = ({ compact=false }) => {
  if (compact) {
    return (
      <Link
        to="/new-project" className="new-project-link"
      >
        <div className="new-project-icon">
          <BoldAdd className="icon-bold-add" />
        </div>
      </Link>
    )
  } else {
    return (
      <div className="new-project-link">
        <Link
          to="/new-project" className="tc-btn tc-btn-sm tc-btn-primary"
        >+ New Project</Link>
      </div>
    )
  }
}

NewProjectNavLink.propTypes = {
  compact: PropTypes.bool
}

export default NewProjectNavLink