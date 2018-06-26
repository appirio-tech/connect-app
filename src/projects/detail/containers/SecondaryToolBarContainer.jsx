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
  // we only know which menu items to render when we know project version
  if (isProjectLoading || !project) {
    return null
  }

  // choose set of menu links based on the project version
  const navLinks = project.version === 'v3' ? [
    { label: 'Dashboard', to: `/projects/${match.params.projectId}` },
    { label: 'Scope', to: `/projects/${match.params.projectId}/scope` },
    { label: 'Project Plan', to: `/projects/${match.params.projectId}/plan` },
  ] : [
    { label: 'Dashboard', to: `/projects/${match.params.projectId}` },
    { label: 'Specification', to: `/projects/${match.params.projectId}/specification` },
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

export default connect(mapStateToProps, null, null, {
  pure: false
})(withRouter(SecondaryToolBarContainer))
