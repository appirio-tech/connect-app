import React, {PropTypes} from 'react'
import './ProjectProgress.scss'
import cn from 'classnames'
import PanelProject from '../PanelProject/PanelProject'

const ProjectProgress = ({title, type, percent, children }) => (
  <PanelProject>
    <PanelProject.Heading>
      {title}
    </PanelProject.Heading>
    <div className="project-progress">
      <div className="progress-bar">
        <div className={cn('progress', type)} style={{width: percent + '%'}} />
      </div>
      <div className="progress-remaining">
        {children}
      </div>
    </div>
  </PanelProject>
)

ProjectProgress.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['working', 'error', 'completed']),
  percent: PropTypes.number.isRequired,
  children: PropTypes.any.isRequired
}

export default ProjectProgress
