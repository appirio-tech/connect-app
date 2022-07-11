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
import { PERMISSIONS } from '../../../config/permissions'
import { hasPermission } from '../../../helpers/permissions'

import './ProjectSummaryReportContainer.scss'

class ProjectSummaryReportContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      project,
      feeds,
      isFeedsLoading,
      phases,
      productsTimelines,
      phasesTopics,
      isLoading,
      location,
    } = this.props

    const leftArea = (
      <ProjectInfoContainer
        location={location}
        phases={phases}
        project={project}
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
          <div styleName="container">
            <p>
              This content has been moved. Please contact{' '}
              <a href="mailto:support@topcoder.com">support@topcoder.com</a> to
              receive an emailed copy of your report.
            </p>
          </div>
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}

ProjectSummaryReportContainer.propTypes = {
  isLoading: PT.bool.isRequired,
  project: PT.object.isRequired,
  phases: PT.array.isRequired,
  productsTimelines: PT.object.isRequired,
}

const mapStateToProps = ({ projectState, projectTopics, phasesTopics }) => {
  // all feeds includes primary as well as private topics if user has access to private topics
  let allFeed = projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics
  if (hasPermission(PERMISSIONS.ACCESS_PRIVATE_POST)) {
    allFeed = [
      ...allFeed,
      ...projectTopics.feeds[PROJECT_FEED_TYPE_MESSAGES].topics,
    ]
  }

  return {
    phases: projectState.phases,
    feeds: allFeed,
    phasesTopics,
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProjectSummaryReportContainer))
