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
} from '../../../config/constants'
import TwoColsLayout from '../../../components/TwoColsLayout'
import Sticky from '../../../components/Sticky'
import ProjectInfoContainer from './ProjectInfoContainer'
import PERMISSIONS from '../../../config/permissions'
import { checkPermission } from '../../../helpers/permissions'
import { loadProjectSummary } from '../../actions/projectSummary'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import ProjectSummaryReport from '../components/ProjectSummaryReport'

const EnhancedProjectSummaryReport = spinnerWhileLoading(props => {
  return props.project && !props.projectSummary.isLoading && props.projectSummary.projectId === props.project.id
})(ProjectSummaryReport)

class ProjectSummaryReportContainer extends React.Component {

  componentWillUpdate(nextProps) {
    if(nextProps.project && nextProps.projectSummary.projectId !== nextProps.project.id) {
      nextProps.loadProjectSummary(nextProps.project.id)
    }
  }

  render() {
    const {
      project,
      estimationQuestion,
      projectTemplate,
      projectSummary,
      isSuperUser,
      isManageUser,
      currentMemberRole,
      feeds,
      isFeedsLoading,
      phases,
      productsTimelines,
      phasesTopics,
      isProcessing,
      location,
    } = this.props

    const template = _.get(projectTemplate, 'scope')

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
        isProjectProcessing={isProcessing}
      />
    )

    return (
      <TwoColsLayout noPadding>
        <TwoColsLayout.Sidebar>
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            {(matches) => {
              if (matches) {
                return <Sticky top={60}>{leftArea}</Sticky>
              } else {
                return leftArea
              }
            }}
          </MediaQuery>
        </TwoColsLayout.Sidebar>
        <TwoColsLayout.Content>
          <EnhancedProjectSummaryReport
            projectSummary={projectSummary}
            project={project}
            template={template}
            estimationQuestion={estimationQuestion}
          />
        </TwoColsLayout.Content>

      </TwoColsLayout>
    )
  }
}

ProjectSummaryReportContainer.propTypes = {
  currentMemberRole: PT.string.isRequired,
  isProcessing: PT.bool.isRequired,
  isSuperUser: PT.bool.isRequired,
  isManageUser: PT.bool.isRequired,
  project: PT.object.isRequired,
  estimationQuestion: PT.object.isRequired,
  projectSummary: PT.object.isRequired,
  phases: PT.array.isRequired,
  productsTimelines: PT.object.isRequired,
}

const mapStateToProps = ({ projectState, projectTopics, phasesTopics, templates, projectSummary }) => {
  // all feeds includes primary as well as private topics if user has access to private topics
  let allFeed = projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics
  if (checkPermission(PERMISSIONS.ACCESS_PRIVATE_POST)) {
    allFeed = [...allFeed, ...projectTopics.feeds[PROJECT_FEED_TYPE_MESSAGES].topics]
  }

  return {
    phases: projectState.phases,
    feeds: allFeed,
    isFeedsLoading: projectTopics.isLoading,
    phasesTopics,
    projectTemplates: templates.projectTemplates,
    projectSummary,
  }
}

const mapDispatchToProps = {
  loadProjectSummary,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectSummaryReportContainer))
