/**
 * ProjectPlanContainer container
 * displays content of the Project Plan tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import {
  updateProduct,
  fireProductDirty,
  fireProductDirtyUndo,
  deleteProjectPhase,
  expandProjectPhase,
  collapseProjectPhase,
  collapseAllProjectPhases,
} from '../../actions/project'
import { addProductAttachment, updateProductAttachment, removeProductAttachment } from '../../actions/projectAttachment'

import TwoColsLayout from '../../../components/TwoColsLayout'
import ProjectStages from '../components/ProjectStages'
import ProjectPlanEmpty from '../components/ProjectPlanEmpty'
import MediaQuery from 'react-responsive'
import ProjectInfoContainer from './ProjectInfoContainer'
import NotificationsReader from '../../../components/NotificationsReader'
import {
  SCREEN_BREAKPOINT_MD,
  PHASE_STATUS_DRAFT,
  PROJECT_STATUS_COMPLETED,
  PHASE_STATUS_ACTIVE,
  PROJECT_STATUS_CANCELLED,
  PROJECT_FEED_TYPE_PRIMARY,
  EVENT_TYPE,
} from '../../../config/constants'
import Sticky from '../../../components/Sticky'
import { Link } from 'react-router-dom'

import './ProjectPlanContainer.scss'

class ProjectPlanContainer extends React.Component {
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
    const { expandProjectPhase } = this.props
    const scrollTo = window.location.hash ? window.location.hash.substring(1) : null
    if (scrollTo) {
      const phaseId = scrollTo.startsWith('phase-') ? parseInt(scrollTo.replace('phase-', ''), 10) : null
      if (phaseId) {
        let tab = scrollTo.replace(`phase-${phaseId}-`, '')
        tab = tab === scrollTo ? 'timeline' : tab
        // we just open tab, while smooth scrolling has to be caused by URL hash
        expandProjectPhase(phaseId, tab)
      }
    } else {
      // if the user is a customer and its not a direct link to a particular phase
      // then by default expand all phases which are active
      if (this.props.isCustomerUser) {
        _.forEach(this.props.phases, phase => {
          if (phase.status === PHASE_STATUS_ACTIVE) {
            expandProjectPhase(phase.id)
          }
        })
      }
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
      phasesNonDirty,
      productsTimelines,
      phasesTopics,
      isProcessing,
    } = this.props

    // manager user sees all phases
    // customer user doesn't see unplanned (draft) phases
    const visiblePhases = phases && phases.filter((phase) => (
      isSuperUser || isManageUser || phase.status !== PHASE_STATUS_DRAFT
    ))
    const visiblePhasesIds = _.map(visiblePhases, 'id')
    const visiblePhasesNonDirty = phasesNonDirty && phasesNonDirty.filter((phaseNonDirty) => (
      _.includes(visiblePhasesIds, phaseNonDirty.id)
    ))

    const isProjectLive = project.status !== PROJECT_STATUS_COMPLETED && project.status !== PROJECT_STATUS_CANCELLED
    const isProjectPlan = true

    const leftArea = (
      <ProjectInfoContainer
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
        <TwoColsLayout.Sidebar>
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            {(matches) => {
              if (matches) {
                return <Sticky top={110}>{leftArea}</Sticky>
              } else {
                return leftArea
              }
            }}
          </MediaQuery>
        </TwoColsLayout.Sidebar>

        <TwoColsLayout.Content>
          {visiblePhases && visiblePhases.length > 0 ? (
            <ProjectStages
              {...{
                ...this.props,
                phases: visiblePhases,
                phasesNonDirty: visiblePhasesNonDirty,
              }}
            />
          ) : (
            <ProjectPlanEmpty />
          )}
          {isProjectLive && isManageUser && (<div styleName="add-button-container">
            <Link to={`/projects/${project.id}/add-phase`} className="tc-btn tc-btn-primary tc-btn-sm action-btn">Add New Phase</Link>
          </div>)}
        </TwoColsLayout.Content>

      </TwoColsLayout>
    )
  }
}

ProjectPlanContainer.propTypes = {
  currentMemberRole: PT.string.isRequired,
  isProcessing: PT.bool.isRequired,
  isSuperUser: PT.bool.isRequired,
  isManageUser: PT.bool.isRequired,
  project: PT.object.isRequired,
  productTemplates: PT.array.isRequired,
  phases: PT.array.isRequired,
  productsTimelines: PT.object.isRequired,
}

const mapStateToProps = ({ projectState, projectTopics, phasesTopics, templates }) => ({
  productTemplates: templates.productTemplates,
  phases: projectState.phases,
  phasesNonDirty: projectState.phasesNonDirty,
  feeds: projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics,
  isFeedsLoading: projectTopics.isLoading,
  phasesTopics,
  phasesStates: projectState.phasesStates,
})

const mapDispatchToProps = {
  updateProduct,
  fireProductDirty,
  fireProductDirtyUndo,
  addProductAttachment,
  updateProductAttachment,
  removeProductAttachment,
  deleteProjectPhase,
  expandProjectPhase,
  collapseProjectPhase,
  collapseAllProjectPhases,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPlanContainer)
