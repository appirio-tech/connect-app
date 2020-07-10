import React, { Component } from 'react'
import MediaQuery from 'react-responsive'
import Sticky from 'react-stickynode'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SCREEN_BREAKPOINT_MD, PROJECT_FEED_TYPE_PRIMARY, PROJECT_FEED_TYPE_MESSAGES } from '../../../config/constants'
import TwoColsLayout from '../../../components/TwoColsLayout'
import FAQContainer from '../../../components/FAQ/FAQContainer'
import ProjectInfoContainer from './ProjectInfoContainer'
import { hasPermission } from '../../../helpers/permissions'
import PERMISSIONS from '../../../config/permissions'

class ProjectFAQContainer extends Component {

  render() {
    const {
      project,
      projectTemplate,
      phases,
      currentMemberRole,
      isSuperUser,
      isManageUser,
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
        currentMemberRole={currentMemberRole}
        project={project}
        phases={phases}
        isSuperUser={isSuperUser}
        isManageUser={isManageUser}
        feeds={feeds}
        isFeedsLoading={isFeedsLoading}
        productsTimelines={productsTimelines}
        phasesTopics={phasesTopics}
        isProjectProcessing={isProcessing}
      />
    )

    return (
      <TwoColsLayout noPadding>
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
          <FAQContainer contentKey={projectTemplate.metadata.contentful.projectFaqId} pageTitle="FAQ About Project" />
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}
const mapStateToProps = ({ loadUser, projectState, projectTopics, topics }) => {
  // all feeds includes primary as well as private topics if user has access to private topics
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectFAQContainer))