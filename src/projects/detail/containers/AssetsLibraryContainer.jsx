/**
 * AssetsInfoContainer container
 * displays content of the Assets Info tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'

import {
  expandProjectPhase,
  collapseAllProjectPhases,
} from '../../actions/project'

import TwoColsLayout from '../../../components/TwoColsLayout'

import MediaQuery from 'react-responsive'
import ProjectInfoContainer from './ProjectInfoContainer'
import AssetsInfoContainer from './AssetsInfoContainer'
import NotificationsReader from '../../../components/NotificationsReader'
import {
  SCREEN_BREAKPOINT_MD,
  PHASE_STATUS_ACTIVE,
  PROJECT_FEED_TYPE_PRIMARY,
  PROJECT_FEED_TYPE_MESSAGES,
  EVENT_TYPE,
} from '../../../config/constants'
import Sticky from '../../../components/Sticky'
import PERMISSIONS from '../../../config/permissions'
import { checkPermission } from '../../../helpers/permissions'

import './AssetsLibraryContainer.scss'

class AssetsLibraryContainer extends React.Component {
  constructor(props) {
    super(props)

    this.onChannelClick = this.onChannelClick.bind(this)
  }

  onChannelClick(topic) {
    const { expandProjectPhase } = this.props
    const phaseId = parseInt(topic.tag.replace('phase#', ''), 10)

    if (!phaseId) {
      return
    }

    // we just open Posts tab, while smooth scrolling will be caused by URL hash update
    expandProjectPhase(phaseId, 'posts')
  }

  componentDidMount() {
    const { expandProjectPhase, location } = this.props

    // if the user is a customer and its not a direct link to a particular phase
    // then by default expand all phases which are active
    if (_.isEmpty(location.hash) && this.props.isCustomerUser) {
      _.forEach(this.props.phases, phase => {
        if (phase.status === PHASE_STATUS_ACTIVE) {
          expandProjectPhase(phase.id)
        }
      })
    }
  }

  componentWillUnmount() {
    const { collapseAllProjectPhases } = this.props

    collapseAllProjectPhases()
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
      isProcessing,
      location,
    } = this.props

    const isProjectPlan = true

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
        isProjectPlan={isProjectPlan}
        isProjectProcessing={isProcessing}
      />
    )

    return (
      <TwoColsLayout>
        <NotificationsReader
          id="project-plan"
          criteria={[
            { eventType: EVENT_TYPE.PROJECT_PLAN.READY, contents: { projectId: project.id } },
            { eventType: EVENT_TYPE.PROJECT_PLAN.MODIFIED, contents: { projectId: project.id } },
            { eventType: EVENT_TYPE.PROJECT_PLAN.PROGRESS_UPDATED, contents: { projectId: project.id } },
          ]}
        />
        <TwoColsLayout.Sidebar wrapperClass="gray-bg">
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
          <AssetsInfoContainer
            currentMemberRole={currentMemberRole}
            phases={phases}
            project={project}
            isSuperUser={isSuperUser}
            isManageUser={isManageUser}
            feeds={feeds}
            phasesTopics={phasesTopics}
          />
        </TwoColsLayout.Content>

      </TwoColsLayout>
    )
  }
}

AssetsLibraryContainer.propTypes = {
  currentMemberRole: PT.string.isRequired,
  isProcessing: PT.bool.isRequired,
  isSuperUser: PT.bool.isRequired,
  isManageUser: PT.bool.isRequired,
  project: PT.object.isRequired,
  phases: PT.array.isRequired,
  productsTimelines: PT.object.isRequired,
}

const mapStateToProps = ({ projectState, projectTopics, phasesTopics }) => {
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
  }
}

const mapDispatchToProps = {
  expandProjectPhase,
  collapseAllProjectPhases,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AssetsLibraryContainer))
