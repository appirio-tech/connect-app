import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import Modal from 'react-modal'

import {
  SCREEN_BREAKPOINT_MD,
  PROJECT_FEED_TYPE_PRIMARY,
  PROJECT_FEED_TYPE_MESSAGES,
  PROJECT_REPORTS,
  REPORT_SESSION_LENGTH,
} from '../../../config/constants'
import TwoColsLayout from '../../../components/TwoColsLayout'
import Sticky from '../../../components/Sticky'
import ProjectInfoContainer from './ProjectInfoContainer'
import PERMISSIONS from '../../../config/permissions'
import { hasPermission } from '../../../helpers/permissions'
import { loadProjectReportsUrls, setLookerSessionExpired } from '../../actions/projectReports'
import spinnerWhileLoading from '../../../components/LoadingSpinner'

import './ProjectSummaryReportContainer.scss'

const LookerEmbedReport = (props) => {
  return (<iframe width="100%" src={props.projectSummaryEmbedUrl} onLoad={props.onLoad} />)
}

const EnhancedLookerEmbedReport = spinnerWhileLoading(props => {
  return !props.isLoading
})(LookerEmbedReport)

class ProjectSummaryReportContainer extends React.Component {

  constructor(props) {
    super(props)

    this.timer = null
    this.setLookerSessionTimer = this.setLookerSessionTimer.bind(this)
    this.reloadProjectReport = this.reloadProjectReport.bind(this)
  }

  reloadProjectReport() {
    this.props.loadProjectReportsUrls(_.get(this.props, 'project.id'), PROJECT_REPORTS.PROJECT_SUMMARY)
    // don't have to set session expire timer here, it would be set of iframe load
  }

  componentWillMount() {
    this.reloadProjectReport()
    // don't have to set session expire timer here, it would be set of iframe load
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  componentWillUpdate(nextProps) {
    const nextReportProjectId = _.get(nextProps, 'reportsProjectId')
    const nextProjectId = _.get(nextProps, 'project.id')

    if (nextProjectId && nextReportProjectId !== nextProjectId) {
      this.props.loadProjectReportsUrls(nextProjectId, PROJECT_REPORTS.PROJECT_SUMMARY)
      // don't have to set session expire timer here, it would be set of iframe load
    }
  }

  setLookerSessionTimer() {
    console.log('Setting Looker Session Timer')

    if (this.timer) {
      clearTimeout(this.timer)
    }

    // set timeout for raising alert to refresh the token when session expires
    this.timer = setTimeout(() => {
      console.log('Looker Session is expired by timer')
      this.props.setLookerSessionExpired(true)
      window.analytics && window.analytics.track('Looker Session Expired')
    }, REPORT_SESSION_LENGTH * 1000)
  }

  render() {
    const {
      project,
      isSuperUser,
      isManageUser,
      currentMemberRole,
      feeds,
      isFeedsLoading,
      phases,
      productsTimelines,
      phasesTopics,
      isLoading,
      location,
      projectSummaryEmbedUrl,
      lookerSessionExpired,
    } = this.props

    const leftArea = (
      <ProjectInfoContainer
        location={location}
        currentMemberRole={currentMemberRole}
        phases={phases}
        project={project}
        isSuperUser={isSuperUser}
        isManageUser={isManageUser}
        feeds={feeds}
        isFeedsLoading={isFeedsLoading}
        productsTimelines={productsTimelines}
        phasesTopics={phasesTopics}
        onChannelClick={this.onChannelClick}
        isProjectProcessing={isLoading}
      />
    )

    return (
      <TwoColsLayout noPadding>
        <TwoColsLayout.Sidebar>
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            {(matches) => {
              if (matches) {
                return <Sticky top={60} bottomBoundary="#wrapper-main">{leftArea}</Sticky>
              } else {
                return leftArea
              }
            }}
          </MediaQuery>
        </TwoColsLayout.Sidebar>
        <TwoColsLayout.Content>
          <Modal
            isOpen={lookerSessionExpired && !isLoading}
            className="delete-post-dialog"
            overlayClassName="delete-post-dialog-overlay"
            contentLabel=""
          >
            <div className="modal-title">
            Report sessions expired
            </div>

            <div className="modal-body">
            To keep the data up to date, please, hit "Refresh" button to reload the report.
            </div>

            <div className="button-area flex center action-area">
              <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={this.reloadProjectReport}>Refresh</button>
            </div>
          </Modal>
          <EnhancedLookerEmbedReport
            isLoading={isLoading}
            projectSummaryEmbedUrl={projectSummaryEmbedUrl}
            onLoad={this.setLookerSessionTimer}
          />
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}

ProjectSummaryReportContainer.propTypes = {
  currentMemberRole: PT.string.isRequired,
  isLoading: PT.bool.isRequired,
  isSuperUser: PT.bool.isRequired,
  isManageUser: PT.bool.isRequired,
  project: PT.object.isRequired,
  phases: PT.array.isRequired,
  productsTimelines: PT.object.isRequired,
  reportsProjectId: PT.number,
}

const mapStateToProps = ({ projectState, projectTopics, phasesTopics, projectReports }) => {
  // all feeds includes primary as well as private topics if user has access to private topics
  let allFeed = projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics
  if (hasPermission(PERMISSIONS.ACCESS_PRIVATE_POST)) {
    allFeed = [...allFeed, ...projectTopics.feeds[PROJECT_FEED_TYPE_MESSAGES].topics]
  }

  return {
    phases: projectState.phases,
    feeds: allFeed,
    phasesTopics,
    isLoading: projectReports.isLoading,
    reportsProjectId: projectReports.projectId,
    lookerSessionExpired: projectReports.lookerSessionExpired,
    projectSummaryEmbedUrl: projectReports.projectSummaryEmbedUrl,
  }
}

const mapDispatchToProps = {
  loadProjectReportsUrls,
  setLookerSessionExpired,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectSummaryReportContainer))
