
import React from 'react'
import {Link} from 'react-router-dom'
import SVGIconImage from '../../../../components/SVGIconImage'
import './ProjectCard.scss'

function NewProjectCard() {
  return (
    <Link to="/new-project" className="ProjectCard NewProjectCard">
      <div className="card-header">
      </div>
      <div className="card-body">
        <div className="new-project-button">
          <div className="new-project-icon"><SVGIconImage filePath="ui-16px-1_bold-add" /></div>
          <div>New Project</div>
        </div>
      </div>
      <div className="card-footer">
      </div>
    </Link>
  )
}

NewProjectCard.propTypes = {
}

export default NewProjectCard