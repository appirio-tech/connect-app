import React from 'react'
import PT from 'prop-types'
import TextTruncate from 'react-text-truncate'
import { withRouter } from 'react-router-dom'
import ProjectStatus from '../../../components/ProjectStatus/ProjectStatus'
import editableProjectStatus from '../../../components/ProjectStatus/editableProjectStatus'
import {
  PROJECT_STATUS_ACTIVE,
  PROJECT_STATUS_COMPLETED,
} from '../../../config/constants'
import './ProjectCardBody.scss'
import _ from 'lodash'
import { hasPermission } from '../../../helpers/permissions'
import { PERMISSIONS } from '../../../config/permissions'

const EnhancedProjectStatus = editableProjectStatus(ProjectStatus)

function ProjectCardBody({ project, descLinesCount = 8,
  onChangeStatus, showLink, showLinkURL, canEditStatus = true, hideStatus, history }) {
  if (!project) return null

  const canEdit = canEditStatus && (
    project.status !== PROJECT_STATUS_COMPLETED && hasPermission(PERMISSIONS.MANAGE_PROJECT_PLAN)
  )

  const goToProjectDetails = (evt, showLinkURL, projectDetailsURL) => {
    evt.stopPropagation()
    evt.preventDefault()
    evt.nativeEvent.stopImmediatePropagation()
    history.push(showLinkURL || projectDetailsURL)
  }

  const progress = _.get(process, 'percent', 0)

  const projectDetailsURL = ['v3', 'v4'].includes(project.version)
    ? `/projects/${project.id}/scope`
    : `/projects/${project.id}/specification`

  return (
    <div className="project-card-body">
      <TextTruncate
        containerClassName="project-description"
        line={descLinesCount}
        truncateText="..."
        text={_.unescape(project.description)}
        textTruncateChild={showLink ? <span className="read-more-link" onClick={(evt) => { goToProjectDetails(evt, showLinkURL, projectDetailsURL) }}>read more</span> : <span className="read-more-link">read more</span>}
      />
      {!hideStatus && <div className="project-status">
        {(project.status !== PROJECT_STATUS_ACTIVE || progress === 0) &&
          <EnhancedProjectStatus
            status={project.status}
            showText
            withoutLabel
            canEdit={canEdit}
            unifiedHeader={false}
            onChangeStatus={onChangeStatus}
            projectId={project.id}
          />
        }
      </div>}
    </div>
  )
}

ProjectCardBody.defaultTypes = {
  projectCanBeActive: true,
  showLink: false,
  showLinkURL: '',
  canEditStatus: true
}

ProjectCardBody.propTypes = {
  project: PT.object.isRequired,
  showLink: PT.bool,
  showLinkURL: PT.string,
  canEditStatus: PT.bool,
  hideStatus: PT.bool
}

export default withRouter(ProjectCardBody)
