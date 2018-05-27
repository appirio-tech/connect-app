/**
 * Secondary toolbar container for project details pages
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PT from 'prop-types'

import GenericMenu from 'components/GenericMenu'

const SecondaryToolBarContainer = ({
  isProjectLoading,
  match,
  project,
}) => {
  const navLinks = [
    { label: 'Dashboard', to: `/projects/${match.params.projectId}` },
    { label: 'Scope', to: `/projects/${match.params.projectId}/scope` },
    { label: 'Project Plan', to: `/projects/${match.params.projectId}/plan` },
  ]

  // `Discussions` items can be added as soon as project is loaded
  // if discussions are not hidden for it
  if (!isProjectLoading && project && project.details && !project.details.hideDiscussions) {
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
