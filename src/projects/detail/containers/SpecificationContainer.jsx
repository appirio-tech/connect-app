/**
 * Displays Specification tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

import ScopeAndSpecificationContainer from './ScopeAndSpecificationContainer'
import { getProjectProductTemplates } from '../../../helpers/templates'

const SpecificationContainer = (props) => {
  // as for old projects we use productTemplate instead of projectTemplate
  // so we normalize template scheme for other components here
  const template = _.omit(props.productTemplates[0].template, 'sections')
  template.sections = props.productTemplates[0].template.sections

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
