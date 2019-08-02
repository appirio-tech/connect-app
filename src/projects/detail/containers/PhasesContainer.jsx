/**
 * PhasesContainer container
 * displays content of the phases section
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import _ from 'lodash'
import PT from 'prop-types'
import { withRouter, Link } from 'react-router-dom'

import { checkPermission } from '../../../helpers/permissions'
import PERMISSIONS from '../../../config/permissions'
import ProjectStages from '../components/ProjectStages'
import ProjectPlanEmpty from '../components/ProjectPlanEmpty'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import './PhasesContainer.scss'

import {
  PHASE_STATUS_ACTIVE,
  PROJECT_STATUS_COMPLETED,
  PROJECT_STATUS_CANCELLED,
  PHASE_STATUS_DRAFT,
} from '../../../config/constants'

class CreateView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { isCustomerUser, expandProjectPhase, location } = this.props

    // if the user is a customer and its not a direct link to a particular phase
    // then by default expand all phases which are active
    if (_.isEmpty(location.hash) && isCustomerUser) {
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
      phases,
      phasesNonDirty,
      project,
      isSuperUser,
      isManageUser,
      isLoadingPhases,
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

    return (
      <div>
        {(visiblePhases && visiblePhases.length > 0) ? (
          <ProjectStages
            {...{
              ...this.props,
              phases: visiblePhases,
              phasesNonDirty: visiblePhasesNonDirty,
            }}
          />) : (
          <ProjectPlanEmpty isManageUser={isManageUser} />
        )}
        {(isProjectLive && checkPermission(PERMISSIONS.EDIT_PROJECT_PLAN, project, phases)  && !isLoadingPhases) && (<div styleName="add-button-container">
          <Link to={`/projects/${project.id}/add-phase`} className="tc-btn tc-btn-primary tc-btn-sm action-btn">Add New Phase</Link>
        </div>)}
      </div>
    )
  }
}

// This handles showing a spinner while the state is being loaded async
const enhance = spinnerWhileLoading(props => !props.isLoadingPhases)
const EnhancedCreateView = enhance(CreateView)


class PhasesContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { project } = this.props
    this.props.loadProjectPlan(project)
  }

  render() {
    return (
      <EnhancedCreateView
        {...this.props}
      />
    )
  }
}

PhasesContainer.PropTypes = {
  phases: PT.arrayOf(PT.shape({
    status: PT.string.isRequired,
  })),
  project: PT.object.isRequired,
  isSuperUser: PT.bool.isRequired,
  isManageUser: PT.bool.isRequired,
  isLoadingPhases: PT.bool.isRequired,
  loadProjectPlan: PT.func.isRequired,
}

export default withRouter(PhasesContainer)
