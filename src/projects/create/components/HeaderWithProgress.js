import React from 'react'
import PT from 'prop-types'
import { flatten } from 'flat'

import { removeValuesOfHiddenNodes, getWizardProgress } from '../../../helpers/wizardHelper'
import { getProductEstimate } from '../../../config/projectWizard'

import './HeaderWithProgress.scss'

const numberWithCommas = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

function HeaderWithProgress({project, template, currentWizardStep}) {
  const flatProject = flatten(removeValuesOfHiddenNodes(template, project), { safe: true })
  const { priceEstimate } = getProductEstimate({scope: template}, flatProject)
  const progress = currentWizardStep ? getWizardProgress(template, currentWizardStep) : 0

  const currentStep = template.sections[(currentWizardStep || {}).sectionIndex || 0]

  return (
    <div styleName="HeaderWithProgress">
      <div styleName="title-estimate">
        <h3>{currentStep.title}</h3>
        <div>From ${numberWithCommas(priceEstimate)}</div>
      </div>
      <div styleName="progress-bar">
        <div styleName="progress" style={{width: (progress*100)+'%'}} />
      </div>
    </div>
  )
}

HeaderWithProgress.propTypes = {
  project: PT.object.isRequired,
  template: PT.object.isRequired,
  currentWizardStep: PT.object,
}

export default HeaderWithProgress
