/**
 * Show project details
 */
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import * as constants from '../../../../../config/constants'
import ProjectProgress from '../../../../../components/ProjectProgress/ProjectProgress'
import ProjectManagerAvatars from '../../../../list/components/Projects/ProjectManagerAvatars'

import './ProjectDetailsWidget.scss'


function ProjectDetailsWidget({project, phases}) {
  const startDate = moment.min(phases.map(phase => moment(phase.startDate)))
  const endDate = moment.max(phases.map(phase => moment(phase.endDate)))
  const budget = phases.reduce((sum, phase) => sum + phase.budget, 0)
  const spent = phases.reduce((sum, phase) => sum + phase.spentBudget, 0)
  const numCompleted = phases.filter(phase => phase.status === constants.PHASE_STATUS_COMPLETED).length
  const numTotal = phases.length

  return (
    <div styleName="project-details-widget">
      <h2 styleName="title">
        {project.name}
      </h2>
      <div styleName="body">
        <p styleName="detail-item description">
          <span dangerouslySetInnerHTML={{__html: project.description}} />
        </p>
        <div styleName="detail-item dates">
          <div>
            <span styleName="caption">Start Date</span>
            <div styleName="text">{startDate.format('YYYY-MM-DD')}</div>
          </div>
          <div>
            <span styleName="caption">End Date</span>
            <div styleName="text">{endDate.format('YYYY-MM-DD')}</div>
          </div>
        </div>
        <div styleName="detail-item progress">
          <span styleName="caption">Progress</span>
          <div styleName="project-progress">
            <ProjectProgress viewType={ProjectProgress.ViewTypes.CIRCLE} percent={numTotal !== 0 ? numCompleted / numTotal * 100 : 0 } />
            <span styleName="value">{`${numCompleted}/${numTotal}`}</span>
          </div>
        </div>
        <div styleName="detail-item budget">
          <span styleName="caption">Budget</span>
          <div styleName="project-budget">
            <ProjectProgress viewType={ProjectProgress.ViewTypes.CIRCLE} percent={budget !== 0 ? spent / budget * 100 : 0 } />
            <span styleName="value">{`$${formatBudget(budget)}`}</span>
          </div>
        </div>
        <div styleName="detail-item team">
          <span styleName="caption">Team</span>
          <ProjectManagerAvatars managers={project.members} maxShownNum={5} size={50} />
        </div>
      </div>
    </div>
  )
}

ProjectDetailsWidget.propTypes = {
  project: PT.shape(),
  phases: PT.arrayOf(PT.shape())
}

export default ProjectDetailsWidget

function formatBudget(value) {
  return value < 1000
    ? `${Math.floor(value)}`
    : `${(value / 1000).toFixed(1)}K`
}
