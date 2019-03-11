
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import './ProjectCard.scss'
import BoldAdd from '../../../assets/icons/ui-16px-1_bold-add.svg'


function NewProjectCard({ link }) {
  if (/^https?:\/\//.test(link)) {
    return (
      <a
        href={link}
        className="ProjectCard NewProjectCard"
      >
        <div className="card-header" />
        <div className="card-body">
          <div className="new-project-button">
            <div className="new-project-icon"><BoldAdd className="icon-bold-add"/></div>
            <div>Create a new project</div>
          </div>
        </div>
        <div className="card-footer" />
      </a>
    )
  } else {
    return (
      <Link to={link} className="ProjectCard NewProjectCard">
        <div className="card-header" />
        <div className="card-body">
          <div className="new-project-button">
            <div className="new-project-icon"><BoldAdd className="icon-bold-add"/></div>
            <div>Create a new project</div>
          </div>
        </div>
        <div className="card-footer" />
      </Link>
    )
  }
}

NewProjectCard.propTypes = {
  link: PropTypes.string
}

export default NewProjectCard
