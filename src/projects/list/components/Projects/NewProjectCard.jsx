import _ from 'lodash'
import moment from 'moment'
import React, { PropTypes as PT } from 'react'
import {Link} from 'react-router'
import SVGIconImage from '../../../../components/SVGIconImage'
import './ProjectCard.scss'

function NewProjectCard({ project, duration, disabled , currentUser, onChangeStatus}) {
  return (
    <div className='ProjectCard NewProjectCard'>
      <div className="card-header">
      </div>
      <div className="card-body">
        <Link to="/new-project" className="new-project-link">
          <div className="new-project-icon"><SVGIconImage filePath="ui-16px-1_bold-add" /></div>
          <div>New Project</div>
        </Link>
      </div>
      <div className="card-footer">
      </div>
    </div>
  )
}

NewProjectCard.propTypes = {
}

export default NewProjectCard