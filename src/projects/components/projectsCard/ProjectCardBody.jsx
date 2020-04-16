import React from 'react'
import PT from 'prop-types'
import TextTruncate from 'react-text-truncate'
import ProjectStatus from '../../../components/ProjectStatus/ProjectStatus'
import editableProjectStatus from '../../../components/ProjectStatus/editableProjectStatus'
import {
  PROJECT_STATUS_ACTIVE,
  PROJECT_STATUS_COMPLETED,
  PROJECT_ROLE_COPILOT,
  PROJECT_ROLE_MANAGER,
  PROJECT_ROLE_PROGRAM_MANAGER, PROJECT_ROLE_SOLUTION_ARCHITECT, PROJECT_ROLE_PROJECT_MANAGER
} from '../../../config/constants'
import './ProjectCardBody.scss'
import _ from 'lodash'

const EnhancedProjectStatus = editableProjectStatus(ProjectStatus)

class ProjectCardBody extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        redirectToDetails: false,
        redirectToUrl: ''
      }

      this.redirectTo = this.redirectTo.bind(this)
    }

    redirectTo(evt, link) {
      evt.preventDefault()
      evt.stopPropagation()
      this.setState({redirectToDetails: true, redirectToUrl: link});
    }

  render () {
    const { project, projectCanBeActive, currentMemberRole, descLinesCount = 8, 
      onChangeStatus, isSuperUser, showLink, showLinkURL, canEditStatus = true, hideStatus } = this.props
    
    if (!project) return null

    if (this.state.redirectToDetails) {
      return <Redirect push to={this.state.redirectToUrl} />;
    }
    
    const canEdit = canEditStatus && (
      project.status !== PROJECT_STATUS_COMPLETED && (isSuperUser || (currentMemberRole
        && (_.indexOf([
          PROJECT_ROLE_COPILOT,
          PROJECT_ROLE_MANAGER,
          PROJECT_ROLE_PROGRAM_MANAGER,
          PROJECT_ROLE_PROJECT_MANAGER,
          PROJECT_ROLE_SOLUTION_ARCHITECT,
        ], currentMemberRole) > -1)))
        )
        
    const progress = _.get(process, 'percent', 0)
    
    const projectDetailsURL = project.version === 'v3'
    ? `/projects/${project.id}/scope`
    : `/projects/${project.id}/specification`
    const readMoreLink = showLinkURL || projectDetailsURL
    return (
      <div className="project-card-body">
        <TextTruncate
          containerClassName="project-description"
          line={descLinesCount}
          truncateText="..."
          text={_.unescape(project.description)}
          
          textTruncateChild={showLink ? <li key={project.id} className="read-more-link" onClick={() => this.redirectTo(evt, readMoreLink)}>read more</li> : <span className="read-more-link">read more</span>}
          />
        {!hideStatus && <div className="project-status">
          {(project.status !== PROJECT_STATUS_ACTIVE || progress === 0) &&
            <EnhancedProjectStatus
            status={project.status}
            projectCanBeActive={projectCanBeActive}
            showText
            withoutLabel
            currentMemberRole={currentMemberRole}
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
}

ProjectCardBody.defaultTypes = {
  projectCanBeActive: true,
  showLink: false,
  showLinkURL: '',
  canEditStatus: true
}

ProjectCardBody.propTypes = {
  project: PT.object.isRequired,
  projectCanBeActive: PT.bool,
  currentMemberRole: PT.string,
  showLink: PT.bool,
  showLinkURL: PT.string,
  canEditStatus: PT.bool,
  hideStatus: PT.bool
}

export default ProjectCardBody
