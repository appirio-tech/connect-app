import React, { Component } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Panel from '../Panel/Panel'
import DeleteProjectModal from './DeleteProjectModal'
import ProjectCardBody from '../../projects/components/projectsCard/ProjectCardBody'
import MobileExpandable from '../MobileExpandable/MobileExpandable'
import MediaQuery from 'react-responsive'
import { SCREEN_BREAKPOINT_MD, PROJECT_STATUS_ACTIVE, PHASE_STATUS_ACTIVE, PHASE_STATUS_REVIEWED, PROJECT_ROLE_OWNER, PROJECT_ROLE_CUSTOMER } from '../../config/constants'
import ReviewProjectButton from '../../projects/detail/components/ReviewProjectButton'

import './ProjectInfo.scss'

class ProjectInfo extends Component {

  constructor(props) {
    super(props)
    this.toggleProjectDelete = this.toggleProjectDelete.bind(this)
    this.onConfirmDelete = this.onConfirmDelete.bind(this)
  }

  componentWillMount() {
    this.setState({ showDeleteConfirm: false })
  }

  toggleProjectDelete() {
    this.setState({ showDeleteConfirm: !this.state.showDeleteConfirm })
  }

  onConfirmDelete() {
    this.props.onDeleteProject()
  }

  render() {
    const { project, currentMemberRole, duration, canDeleteProject,
      onChangeStatus, isSuperUser, phases, onSubmitForReview, isProjectProcessing } = this.props
    const { showDeleteConfirm } = this.state

    const code = _.get(project, 'details.utm.code', '')

    const hasReviewedOrActivePhases = !!_.find(phases, (phase) => _.includes([PHASE_STATUS_REVIEWED, PHASE_STATUS_ACTIVE], phase.status))
    const isProjectActive = project.status === PROJECT_STATUS_ACTIVE
    const isV3Project = project.version === 'v3'
    const projectCanBeActive =  !isV3Project || (!isProjectActive && hasReviewedOrActivePhases) || isProjectActive


    // prepare review button
    const showReviewBtn = project.status === 'draft' &&
      _.indexOf([PROJECT_ROLE_OWNER, PROJECT_ROLE_CUSTOMER], currentMemberRole) > -1

    const reviewButtonSection = (
      <div className="project-info-review">
        <p>
          Your project "{_.unescape(project.name)}" has been drafted.
          If you have your requirements documented, just verify it against our checklist and then upload it on the <Link to={`/projects/${project.id}/scope`}>Scope</Link> section.
          Once you've finalized your scope, select the "Submit for Review" button.
          Topcoder will then review your drafted project and will assign a manager to get your delivery in-progress!
          Get stuck or need help? Email us at <a href="mailto:support@topcoder.com">support@topcoder.com</a>.
        </p>
        <ReviewProjectButton project={project} onClick={onSubmitForReview} disabled={isProjectProcessing} wrapperClass="no-bg" />
      </div>
    )

    return (
      <div className="project-info">
        {canDeleteProject && !showDeleteConfirm &&
        <div className="project-info-header">
          <div className="project-delete-icon">
            <Panel.DeleteBtn onClick={this.toggleProjectDelete} />
          </div>
        </div>}
        <div className="project-status">
          <div>
            <div styleName="project-name">{_.unescape(project.name)}</div>
            <div className="project-status-time">Created {moment(project.createdAt).format('MMM DD, YYYY')}</div>
            {!!code && <div className="project-status-ref">{_.unescape(code)}</div>}
          </div>
        </div>
        {showDeleteConfirm &&
          <DeleteProjectModal
            onCancel={this.toggleProjectDelete}
            onConfirm={this.onConfirmDelete}
          />
        }
        {showReviewBtn ? (
          reviewButtonSection
        ) : (
          <MobileExpandable title="DESCRIPTION" defaultOpen>
            <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
              {(matches) => (
                <ProjectCardBody
                  project={project}
                  projectCanBeActive={projectCanBeActive}
                  currentMemberRole={currentMemberRole}
                  duration={duration}
                  descLinesCount={
                    /* has to be not too big value here,
                      because the plugin will make this number of iterations
                      see https://github.com/ShinyChang/React-Text-Truncate/blob/master/src/TextTruncate.js#L133
                      too big value may cause browser tab to freeze
                    */
                    matches ? 4 : 1000
                  }
                  onChangeStatus={onChangeStatus}
                  isSuperUser={isSuperUser}
                  showLink
                  hideStatus
                />
              )}
            </MediaQuery>
          </MobileExpandable>
        )}
      </div>
    )
  }
}

ProjectInfo.propTypes = {
  project: PT.object.isRequired,
  currentMemberRole: PT.string,
  duration: PT.object.isRequired,
  productsTimelines: PT.object.isRequired,
  updateProject: PT.func,
  isProjectProcessing: PT.bool,
}

export default ProjectInfo
