/**
 * Secondary toolbar container for project details pages
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PT from 'prop-types'

import GenericMenu from 'components/GenericMenu'

const SecondaryToolBarContainer = ({
  isMetaDataLoading,
  metadata,
}) => {
  // we only know which menu items to render when we know project version
  if (isMetaDataLoading || !metadata) {
    return null
  }

  // choose set of menu links based on the project version
  const navLinks = [
    { label: 'Project Templates', to: '/metadata/projectTemplates' },
    { label: 'Product Templates', to: '/metadata/productTemplates' },
    { label: 'Project Types', to: '/metadata/projectTypes' },
    { label: 'Product Categories', to: '/metadata/productCategories' },
  ]

  return (
    <GenericMenu navLinks={navLinks} />
  )
}

SecondaryToolBarContainer.propTypes = {
  project: PT.object,
}

const mapStateToProps = (state) => ({
  isMetaDataLoading: state.templates.isLoading,
  metadata: state.templates,
})

export default connect(mapStateToProps)(withRouter(SecondaryToolBarContainer))
