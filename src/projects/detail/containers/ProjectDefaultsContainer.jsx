import React, { Component } from 'react'
import MediaQuery from 'react-responsive'
import Sticky from 'react-stickynode'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SCREEN_BREAKPOINT_MD, PROJECT_FEED_TYPE_PRIMARY, PROJECT_FEED_TYPE_MESSAGES } from '../../../config/constants'
import TwoColsLayout from '../../../components/TwoColsLayout'
import ProjectInfoContainer from './ProjectInfoContainer'
import EditProjectDefaultsForm from '../components/EditProjectDefaultsForm'
import { hasPermission } from '../../../helpers/permissions'
import { PERMISSIONS } from '../../../config/permissions'

class ProjectDefaultsContainer extends Component {
  render() {
    const {
      project,
      phases,
      isProcessing,
      feeds,
      isFeedsLoading,
      productsTimelines,
      phasesTopics,
      location,
    } = this.props

    const leftArea = (
      <ProjectInfoContainer
        location={location}
        project={project}
        phases={phases}
        feeds={feeds}
        isFeedsLoading={isFeedsLoading}
        productsTimelines={productsTimelines}
        phasesTopics={phasesTopics}
        isProjectProcessing={isProcessing}
      />
    )

    return (
      <TwoColsLayout>
        <TwoColsLayout.Sidebar>
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            {(matches) => {
              if (matches) {
                return (
                  <Sticky top={60} bottomBoundary="#wrapper-main">
                    {leftArea}
                  </Sticky>
                )
              } else {
                return leftArea
              }
            }}
          </MediaQuery>
        </TwoColsLayout.Sidebar>
        <TwoColsLayout.Content>
          <EditProjectDefaultsForm project={this.props.project} />
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}
const mapStateToProps = ({ loadUser, projectState, projectTopics, topics }) => {
  let allFeed = projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics
  if (hasPermission(PERMISSIONS.ACCESS_PRIVATE_POST)) {
    allFeed = [...allFeed, ...projectTopics.feeds[PROJECT_FEED_TYPE_MESSAGES].topics]
  }

  return {
    user: loadUser.user,
    isProcessing: projectState.processing,
    phases: projectState.phases,
    phasesNonDirty: projectState.phasesNonDirty,
    isLoadingPhases: projectState.isLoadingPhases,
    feeds: allFeed,
    isFeedsLoading: projectTopics.isLoading,
    phasesTopics: topics,
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectDefaultsContainer))
