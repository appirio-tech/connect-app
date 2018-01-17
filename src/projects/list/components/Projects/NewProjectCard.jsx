
import React from 'react'
import PT from 'prop-types'
import {Link} from 'react-router-dom'
import './ProjectCard.scss'
import BoldAdd from '../../../../assets/icons/ui-16px-1_bold-add.svg'

const IconBoldAdd = ({ className }) => {
  return <BoldAdd className={className}/>
}

IconBoldAdd.propTypes = {
  className: PT.string.Required
}


function NewProjectCard() {
  return (
    <Link to="/new-project" className="ProjectCard NewProjectCard">
      <div className="card-header">
      </div>
      <div className="card-body">
        <div className="new-project-button">
          <div className="new-project-icon"><IconBoldAdd className="icon-bold-add"/></div>
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