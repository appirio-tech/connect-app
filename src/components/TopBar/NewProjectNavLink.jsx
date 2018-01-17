import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './NewProjectNavLink.scss'
import BoldAdd from '../../assets/icons/ui-16px-1_bold-add.svg'

/**
 * @params {string} class name
 */
const IconBoldAdd = ({ className }) => {
  return <BoldAdd className={className}/>
}

IconBoldAdd.propTypes = {
  className: PropTypes.string.isRequired
}

const NewProjectNavLink = ({ compact=false, returnUrl }) => {
  if (compact) {
    return (
      <Link
        to={{
          pathname: '/new-project',
          search: returnUrl ? '?returnUrl=' + returnUrl : ''
        }} className="new-project-link"
      >
        <div className="new-project-icon">
          <IconBoldAdd className="icon-bold-add" />
        </div>
      </Link>
    )
  } else {
    return (
      <div className="new-project-link">
        <Link
          to={{
            pathname: '/new-project',
            search: returnUrl ? '?returnUrl=' + returnUrl : ''
          }} className="tc-btn tc-btn-sm tc-btn-primary"
        >+ New Project</Link>
      </div>
    )
  }
}

NewProjectNavLink.propTypes = {
  compact: PropTypes.bool
}

export default NewProjectNavLink