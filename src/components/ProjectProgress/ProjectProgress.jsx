import _ from 'lodash';
import React, {PropTypes} from 'react'
import CircularProgressbar from 'react-circular-progressbar';
import './ProjectProgress.scss'
import cn from 'classnames'

const ViewTypes = {
  HBAR : 'hbar',
  CIRCLE: 'circle'
}

const Themes = {
  BLUE    : 'completed',
  GREEN   : 'working',
  RED     : 'error'
}

const ProjectProgress = ({title, type, percent, children, viewType=ViewTypes.HBAR }) => (
  <div className="project-progress">
    { viewType === ViewTypes.HBAR && 
      <div className="progress-bar">
        <div className={cn('progress', type)} style={{width: percent + '%'}} />
      </div>
    }
    { viewType === ViewTypes.CIRCLE && <CircularProgressbar textForPercentage="" strokeWidth={20} percentage={percent} /> }
    <div className="progress-remaining">
      {children}
    </div>
  </div>
)

ProjectProgress.ViewTypes = ViewTypes

ProjectProgress.Themes = Themes

ProjectProgress.defaultProps = {
  type: Themes.BLUE 
}

ProjectProgress.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(_.values(Themes)),
  percent: PropTypes.number.isRequired,
  children: PropTypes.any.isRequired
}

export default ProjectProgress
