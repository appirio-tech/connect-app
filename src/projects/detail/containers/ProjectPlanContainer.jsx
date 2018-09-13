/**
 * ProjectPlanContainer container
 * displays content of the Project Plan tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'

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

import TwoColsLayout from '../components/TwoColsLayout'
import ProjectStages from '../components/ProjectStages'
import ProjectPlanEmpty from '../components/ProjectPlanEmpty'
import MediaQuery from 'react-responsive'
import ProjectInfoContainer from './ProjectInfoContainer'
import { SCREEN_BREAKPOINT_MD, PHASE_STATUS_DRAFT, PROJECT_STATUS_COMPLETED,
  PROJECT_STATUS_CANCELLED, PROJECT_FEED_TYPE_PRIMARY } from '../../../config/constants'
import Sticky from 'react-stickynode'
import { Link } from 'react-router-dom'
import { scrollToHash } from '../../../components/ScrollToAnchors'

import './ProjectPlanContainer.scss'

class ProjectPlanContainer extends React.Component {
  constructor(props) {
    super(props)

    this.onChannelClick = this.onChannelClick.bind(this)
  }

  onChannelClick(topic) {
    const { expandProjectPhase } = this.props
    const phaseId = parseInt(topic.tag.replace('phase#', ''), 10)

    expandProjectPhase(phaseId, 'posts')
    scrollToHash(`phase-${phaseId}`)
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
      phases,
      productsTimelines,
      phasesTopics,
    } = this.props

    // manager user sees all phases
    // customer user doesn't see unplanned (draft) phases
    const visiblePhases = phases && phases.filter((phase) => (
      isSuperUser || isManageUser || phase.status !== PHASE_STATUS_DRAFT
    ))

    const isProjectLive = project.status !== PROJECT_STATUS_COMPLETED && project.status !== PROJECT_STATUS_CANCELLED
    // get list of phase topic in same order as phases
    const topics = _.compact(
      visiblePhases.map((phase) => {
        const topic = _.get(phasesTopics, `[${phase.id}].topic`)

        if (!topic) {
          return null
        }

        return ({
          ...topic,
          phaseId: phase.id,
        })
      })
    )

    const leftArea = (
      <ProjectInfoContainer
        currentMemberRole={currentMemberRole}
        phases={phases}
        project={project}
        isSuperUser={isSuperUser}
        feeds={topics}
        productsTimelines={productsTimelines}
        onChannelClick={this.onChannelClick}
      />
    )

    return (
      <TwoColsLayout>
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
            [
              <ProjectStages
                {...{
                  ...this.props,
                  phases: visiblePhases
                }}
                key="stages"
              />
            ]
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

const mapStateToProps = ({ projectState, projectTopics, phasesTopics }) => ({
  productTemplates: projectState.allProductTemplates,
  phases: projectState.phases,
  feeds: projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics,
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
