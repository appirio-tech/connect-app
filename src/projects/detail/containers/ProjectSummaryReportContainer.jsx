import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'

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
import { checkPermission } from '../../../helpers/permissions'
import { loadProjectSummary, loadProjectReportsUrls, refreshLookerSession } from '../../actions/projectReports'
import spinnerWhileLoading from '../../../components/LoadingSpinner'

import './ProjectSummaryReportContainer.scss'

const LookerEmbedReport = (props) => {
  return (<iframe width="100%" src={props.projectSummaryEmbedUrl} onLoad={props.onLoad} />)
}

const EnhancedLookerEmbedReport = spinnerWhileLoading(props => {
  return !props.isLoading
})(LookerEmbedReport)

let timer

class ProjectSummaryReportContainer extends React.Component {

  constructor(props) {
    super(props)
    this.setLookerSessionTimer = this.setLookerSessionTimer.bind(this)
  }

  componentWillUpdate(nextProps) {
    const nextReportProjectId = _.get(nextProps, 'reportsProjectId')
    const nextProjectId = _.get(nextProps, 'project.id')
    const lookerSessionExpired = !this.props.lookerSessionExpired && nextProps.lookerSessionExpired
    if(lookerSessionExpired || (nextProjectId && nextReportProjectId !== nextProjectId)) {
      nextProps.loadProjectReportsUrls(nextProjectId, PROJECT_REPORTS.PROJECT_SUMMARY)
      this.setLookerSessionTimer()
    }
  }

  setLookerSessionTimer() {
    console.log('Setting Looker Session Timer')
    if (timer) {
      clearTimeout(timer)
    }
    const thisRef = this
    let timeoutDuration = 60*1000
    if (REPORT_SESSION_LENGTH > 2*60) {
      timeoutDuration = REPORT_SESSION_LENGTH*1000 - 2*60*1000
    }
    // set timeout for raising alert to refresh the token 2 minutes before the session expire
    timer = setTimeout(() => {
      console.log('Calling refresh looker session action')
      thisRef.props.refreshLookerSession()
    }, (timeoutDuration))
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
          {
            <EnhancedLookerEmbedReport
              isLoading={isLoading}
              projectSummaryEmbedUrl={projectSummaryEmbedUrl}
              onLoad={this.setLookerSessionTimer}
            />
          }
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
  if (checkPermission(PERMISSIONS.ACCESS_PRIVATE_POST)) {
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
  loadProjectSummary,
  loadProjectReportsUrls,
  refreshLookerSession,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectSummaryReportContainer))
