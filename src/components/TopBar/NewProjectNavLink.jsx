import React, {PropTypes} from 'react'
import { Link } from 'react-router-dom'
import SVGIconImage from '../SVGIconImage'
import './NewProjectNavLink.scss'

const NewProjectNavLink = ({ compact=false, returnUrl }) => {
  if (compact) {
    return (
      <Link to={{
          pathname: '/new-project',
          search: returnUrl ? '?returnUrl=' + returnUrl : ''
        }} className="new-project-link">
        <div className="new-project-icon"><SVGIconImage filePath="ui-16px-1_bold-add" /></div>
      </Link>
    )
  } else {
    return (
      <div className="new-project-link">
        <Link to={{
          pathname: '/new-project',
          search: returnUrl ? '?returnUrl=' + returnUrl : '',
        }} className="tc-btn tc-btn-sm tc-btn-primary">+ New Project</Link>
      </div>
    )
  }
}

NewProjectNavLink.propTypes = {
  compact: PropTypes.bool
}

export default NewProjectNavLink