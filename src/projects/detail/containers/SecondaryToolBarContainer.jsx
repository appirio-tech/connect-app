/**
 * Secondary toolbar container for project details pages
 */
import React from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PT from 'prop-types'

import GenericMenu from 'components/GenericMenu'

const SecondaryToolBarContainer = ({
  isProjectLoading,
  match,
  project,
}) => {
  // if project is not loaded yet, we don't know if we should display Discussions link
  // if phases hasn't been loaded yet, we don't know if project has phases or no
  if (isProjectLoading || _.isUndefined(project.phases)) {
    return null
  }

  const hasPhases = _.isArray(project.phases)

  // different menu items depend on if project has phases (new) or no (old)
  const navLinks = hasPhases ? [
    { label: 'Dashboard', to: `/projects/${match.params.projectId}` },
    { label: 'Scope', to: `/projects/${match.params.projectId}/scope` },
    { label: 'Project Plan', to: `/projects/${match.params.projectId}/plan` },
  ] : [
    { label: 'Dashboard', to: `/projects/${match.params.projectId}` },
    { label: 'Specification', to: `/projects/${match.params.projectId}/specification` },
  ]

  if (!project.details.hideDiscussions) {
    navLinks.push({ label: 'Discussions', to: `/projects/${match.params.projectId}/discussions` })
  }

  return (
    <GenericMenu navLinks={navLinks} />
  )
}

SecondaryToolBarContainer.propTypes = {
  project: PT.object,
}

const mapStateToProps = (state) => ({
  isProjectLoading: state.projectState.isLoading,
  match: PT.shape({
    params: PT.shape({
      projectId: PT.string,
    })
  }),
  project: state.projectState.project,
})

export default connect(mapStateToProps)(withRouter(SecondaryToolBarContainer))
