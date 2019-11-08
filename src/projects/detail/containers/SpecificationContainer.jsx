/**
 * Displays Specification tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import { connect } from 'react-redux'

import ScopeAndSpecificationContainer from './ScopeAndSpecificationContainer'
import { getProjectProductTemplates } from '../../../helpers/templates'

const SpecificationContainer = (props) => {
  if (!props.productTemplates || !props.productTemplates[0]) {
    return null
  }

  // for old projects we use productTemplate instead of projectTemplate
  const template = props.productTemplates[0].template

  return (
    <ScopeAndSpecificationContainer
      {...{
        ...props,
        template
      }}
    />
  )
}

const mapStateToProps = ({ projectState, templates }) => {
  const { projectTemplates, productTemplates } = templates

  return {
    productTemplates: (productTemplates && projectTemplates) ? (
      getProjectProductTemplates(
        productTemplates,
        projectTemplates,
        projectState.project
      )
    ) : []
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SpecificationContainer)
