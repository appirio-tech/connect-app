/**
 * Displays Scope tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import { connect } from 'react-redux'
import { getProjectTemplateById, buildTemplate } from '../../../helpers/templates'

import ScopeAndSpecificationContainer from './ScopeAndSpecificationContainer'

const ScopeContainer = (props) => {
  
  if (!props.projectTemplate) {
    return null
  }
  const forms = props.forms
  const priceConfigs = props.priceConfigs
  const planConfigs = props.planConfigs
  const projectTemplate = props.projectTemplate
  const template = buildTemplate(projectTemplate, forms, planConfigs, priceConfigs).scope

  return (
    <ScopeAndSpecificationContainer
      {...{
        ...props,
        template
      }}
    />
  )
}

const mapStateToProps = ({ projectState : { project }, templates: { projectTemplates }, templates }) => ({
  projectTemplate: project && project.templateId && projectTemplates ? (
    getProjectTemplateById(projectTemplates, project.templateId)
  ) : null,
  forms: templates.forms,
  priceConfigs: templates.priceConfigs,
  planConfigs: templates.planConfigs
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ScopeContainer)
