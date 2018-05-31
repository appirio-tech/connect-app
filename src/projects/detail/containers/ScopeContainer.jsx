/**
 * Displays Scope tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import { connect } from 'react-redux'

import ScopeAndSpecificationContainer from './ScopeAndSpecificationContainer'

const ScopeContainer = (props) => {
  const sections = props.projectTemplate.scope.sections

  return (
    <ScopeAndSpecificationContainer
      {...{
        ...props,
        sections
      }}
    />
  )
}

const mapStateToProps = ({ projectState }) => ({
  projectTemplate: projectState.projectTemplate,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ScopeContainer)
