/**
 * Displays Scope tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import { connect } from 'react-redux'
import { getProjectTemplateById } from '../../../helpers/templates'

import ScopeAndSpecificationContainer from './ScopeAndSpecificationContainer'

const ScopeContainer = (props) => {
  const template = props.projectTemplate.scope

  return (
    <ScopeAndSpecificationContainer
      {...{
        ...props,
        template
      }}
    />
  )
}

const mapStateToProps = ({ projectState : { project }, templates: { projectTemplates } }) => ({
  projectTemplate: project && project.templateId && projectTemplates ? (
    getProjectTemplateById(projectTemplates, project.templateId)
  ) : null
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ScopeContainer)
