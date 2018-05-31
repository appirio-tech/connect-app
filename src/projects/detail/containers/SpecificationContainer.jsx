/**
 * Displays Specification tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import { connect } from 'react-redux'

import ScopeAndSpecificationContainer from './ScopeAndSpecificationContainer'

const SpecificationContainer = (props) => {
  const sections = props.productTemplates[0].template.questions

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
  productTemplates: projectState.productTemplates,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SpecificationContainer)
