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
import { loadProjectWorkstreams } from '../../actions/workstreams'
import { loadTopic } from '../../../actions/topics'

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

  componentWillMount() {
    const { project, workstreams, loadProjectWorkstreams, isLoadingWorkstreams } = this.props

    if (!workstreams && !isLoadingWorkstreams) {
      loadProjectWorkstreams(project)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      works,
      loadTopic,
      allTopics,
      match: { params: { projectId } },
    } = nextProps

    works.forEach((work) => {
      // start loading all the comments for work if not yet loaded or started loading
      [`work#${work.id}-details`, `work#${work.id}-requirements`].forEach((topicTag) => {
        if (!allTopics[topicTag]) {
          loadTopic(projectId, topicTag)
        }
      })
    })

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
      allTopics,
      isProcessing,
      location,
      workTopics
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
        phasesTopics={allTopics}
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
          <AssetsInfoContainer
            currentMemberRole={currentMemberRole}
            phases={phases}
            project={project}
            isSuperUser={isSuperUser}
            isManageUser={isManageUser}
            feeds={feeds}
            allTopics={allTopics}
            isFeedsLoading={isFeedsLoading}
            workTopics={workTopics}
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
  isLoadingWorkstreams: PT.bool.isRequired,
  project: PT.object.isRequired,
  phases: PT.array,
  productsTimelines: PT.object.isRequired,
  loadProjectWorkstreams: PT.func.isRequired,
  loadTopic: PT.func.isRequired,
}

const mapStateToProps = ({ projectState, projectTopics, topics, projectPlan, workstreams }) => {
  const isLoadingTopic = _.some(_.values(topics), { isLoading: true })

  let works = []
  if (workstreams.workstreams) {
    workstreams.workstreams.forEach((workstream) => {
      works = works.concat(workstream.works)
    })
  }

  let workTopics = []
  works.forEach((work) => {
    const tags = [`work#${work.id}-details`, `work#${work.id}-requirements`]
    const workTopicsTmp =  _.values(
      _.pick(topics, tags)
    ).filter(t => t.topic).map(t => t.topic)
    workTopics = workTopics.concat(workTopicsTmp)
  })

  // all feeds includes primary as well as private topics if user has access to private topics
  let allFeed = projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics
  if (checkPermission(PERMISSIONS.ACCESS_PRIVATE_POST)) {
    allFeed = [...allFeed, ...projectTopics.feeds[PROJECT_FEED_TYPE_MESSAGES].topics]
  }

  return {
    phases: projectPlan.isLoading ? null : projectState.phases, // is loading phase and phase topic
    feeds: allFeed,
    isFeedsLoading: projectTopics.isLoading,
    allTopics: topics,
    workstreams: workstreams.workstreams,
    works,
    workTopics: isLoadingTopic ? null : workTopics,
    isLoadingWorkstreams: workstreams.isLoading,
  }
}

const mapDispatchToProps = {
  expandProjectPhase,
  collapseAllProjectPhases,
  loadProjectWorkstreams,
  loadTopic
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AssetsLibraryContainer))
