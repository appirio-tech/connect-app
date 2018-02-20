
import React from 'react'
import {Link} from 'react-router-dom'
import './ProjectCard.scss'
import BoldAdd from '../../../../assets/icons/ui-16px-1_bold-add.svg'


function NewProjectCard() {
  return (
    <Link to="/new-project" className="ProjectCard NewProjectCard">
      <div className="card-header" />
      <div className="card-body">
        <div className="new-project-button">
          <div className="new-project-icon"><BoldAdd className="icon-bold-add"/></div>
          <div>New Project</div>
        </div>
      </div>
      <div className="card-footer" />
    </Link>
  )
}

NewProjectCard.propTypes = {
}

export default NewProjectCard