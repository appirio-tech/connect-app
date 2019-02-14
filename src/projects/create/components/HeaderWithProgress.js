import React from 'react'
import PT from 'prop-types'
import { flatten } from 'flat'

import { removeValuesOfHiddenNodes } from '../../../helpers/wizardHelper'
import { getProductEstimate } from '../../../config/projectWizard'

import './HeaderWithProgress.scss'

const numberWithCommas = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

function HeaderWithProgress({project, template, step, progress}) {
  const flatProject = flatten(removeValuesOfHiddenNodes(template, project), { safe: true })
  const { priceEstimate } = getProductEstimate({scope: template}, flatProject)

  const currentStep = template.sections[(step || {}).sectionIndex || 0]

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

HeaderWithProgress.defaultProps = {
  progress: 0,
  step: {sectionIndex: 0},
}

HeaderWithProgress.propTypes = {
  project: PT.object.isRequired,
  template: PT.object.isRequired,
  progress: PT.number.isRequired,
  step: PT.object,
}

export default HeaderWithProgress
