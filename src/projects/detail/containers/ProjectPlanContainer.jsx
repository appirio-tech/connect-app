/**
 * ProjectPlanContainer container
 * displays content of the Project Plan tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'

import { updateProduct, fireProductDirty, fireProductDirtyUndo, deleteProjectPhase } from '../../actions/project'
import { addProductAttachment, updateProductAttachment, removeProductAttachment } from '../../actions/projectAttachment'

import TwoColsLayout from '../components/TwoColsLayout'
import ProjectPlanProgress from '../components/ProjectPlanProgress'
import ProjectStages from '../components/ProjectStages'
import ProjectPlanEmpty from '../components/ProjectPlanEmpty'
import MediaQuery from 'react-responsive'
import ProjectInfoContainer from './ProjectInfoContainer'
import { SCREEN_BREAKPOINT_MD, PHASE_STATUS_DRAFT, PROJECT_STATUS_COMPLETED,
  PROJECT_STATUS_CANCELLED, PROJECT_FEED_TYPE_PRIMARY, PHASE_STATUS_ACTIVE } from '../../../config/constants'
import Sticky from 'react-stickynode'
import { Link } from 'react-router-dom'

import './ProjectPlanContainer.scss'

const ProjectPlanContainer = (props) => {
  const {
    project,
    isSuperUser,
    isManageUser,
    currentMemberRole,
    phases,
    feeds,
  } = props

  // manager user sees all phases
  // customer user doesn't see unplanned (draft) phases
  const visiblePhases = phases.filter((phase) => (
    isSuperUser || isManageUser || phase.status !== PHASE_STATUS_DRAFT
  ))

  const activePhases = phases ? phases.filter((phase) => phase.status === PHASE_STATUS_ACTIVE) : []

  const isProjectLive = project.status !== PROJECT_STATUS_COMPLETED && project.status !== PROJECT_STATUS_CANCELLED

  const leftArea = (
    <ProjectInfoContainer
      currentMemberRole={currentMemberRole}
      phases={phases}
      project={project}
      phases={phases}
      isSuperUser={isSuperUser}
      feeds={feeds}
    />
  )
  return (
    <TwoColsLayout>
      {phaseId &&
        <TwoColsLayout.Content>
          {visiblePhases.length > 0 ? (
            [
              <ProjectStages
                {...{
                  ...props,
                  phases: visiblePhases,
                  phaseId,
                }}
                isManageUser={isManageUser}
                key="stages"
              />
            ]
          ) : (
            <ProjectPlanEmpty />
          )}
        </TwoColsLayout.Content>
      }
      { !phaseId &&
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
      }
      { !phaseId &&
        <TwoColsLayout.Content>
          {visiblePhases.length > 0 ? (
            [
              activePhases.length > 0 && <ProjectPlanProgress phases={visiblePhases} project={project} key="progress" />,
              <ProjectStages
                {...{
                  ...props,
                  phases: visiblePhases,
                  phaseId,
                }}
                isManageUser={isManageUser}
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
      }
    </TwoColsLayout>
  )
}

ProjectPlanContainer.propTypes = {
  currentMemberRole: PT.string.isRequired,
  isProcessing: PT.bool.isRequired,
  isSuperUser: PT.bool.isRequired,
  isManageUser: PT.bool.isRequired,
  project: PT.object.isRequired,
  productTemplates: PT.array.isRequired,
  phases: PT.array.isRequired,
}

const mapStateToProps = ({ projectState, projectTopics }) => ({
  productTemplates: projectState.allProductTemplates,
  phases: projectState.phases,
  feeds: projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics,
})

const mapDispatchToProps = {
  updateProduct,
  fireProductDirty,
  fireProductDirtyUndo,
  addProductAttachment,
  updateProductAttachment,
  removeProductAttachment,
  deleteProjectPhase,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectPlanContainer))
