/**
 * As phases and works have many functionality in common we extract it here,
 * so we don't have to update functionality in two places.
 */

import {
  PHASE_STATUS_REVIEWED,
  PHASE_STATUS_ACTIVE,
  PROJECT_STATUS_DRAFT,
  PROJECT_STATUS_IN_REVIEW,
  PROJECT_STATUS_REVIEWED,
  PROJECT_STATUS_ACTIVE,
} from '../../config/constants'
import {
  updateProject,
} from './project'

/**
 * Synchronize project status based on changes done to the status of phase/work
 *
 * @param {Object}   project           project
 * @param {Object}   phaseBeforeUpdate phase/work before change
 * @param {Object}   phaseAfterUpdate  phase/work after change
 * @param {Function} dispatch          Redux dispatch method
 */
export const syncProjectStatus = (project, phaseBeforeUpdate, phaseAfterUpdate, dispatch) => {
  const projectId = project.id

  // if one phase/work moved to REVIEWED status, make project IN_REVIEW too
  if (
    _.includes([PROJECT_STATUS_DRAFT], project.status) &&
    phaseBeforeUpdate.status !== PHASE_STATUS_REVIEWED &&
    phaseAfterUpdate.status === PHASE_STATUS_REVIEWED
  ) {
    dispatch(
      updateProject(projectId, {
        status: PHASE_STATUS_REVIEWED
      }, true)
    )
  }

  // if one phase/work moved to ACTIVE status, make project ACTIVE too
  if (
    _.includes([PROJECT_STATUS_DRAFT, PROJECT_STATUS_IN_REVIEW, PROJECT_STATUS_REVIEWED], project.status) &&
    phaseBeforeUpdate.status !== PHASE_STATUS_ACTIVE &&
    phaseAfterUpdate.status === PHASE_STATUS_ACTIVE
  ) {
    dispatch(
      updateProject(projectId, {
        status: PROJECT_STATUS_ACTIVE
      }, true)
    )
  }
}
