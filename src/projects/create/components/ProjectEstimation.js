import React from 'react'
import PT from 'prop-types'
import { flatten } from 'flat'

import { evaluate } from '../../../helpers/dependentQuestionsHelper'
import { getProductEstimate } from '../../../config/projectWizard'

import './ProjectEstimation.scss'

const numberWithCommas = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

function ProjectEstimation({ question, project, projectTemplate }) {
  const totalDuration = question.deliverables.reduce((p, c) => p+c.duration, 0)
  const isSelected = (item) => evaluate(item.enableCondition, flatten(project, { safe: true }))
  const phasesEnabled = question.deliverables.filter(isSelected)

  const { priceEstimate } = getProductEstimate({scope: projectTemplate}, project)

  return (
    <div styleName="ProjectEstimation">
      <div styleName="title">
        <h5>
          {question.title}
        </h5>
        <span>{phasesEnabled.length ? (
          phasesEnabled.length +' phases, ' + totalDuration + ' weeks'
        ) : 'No phase selected'}</span>
      </div>
      <ul styleName="project-estimate-timeline">
        {question.deliverables.map((item, i) => (
          <li key={i} style={{width: (item.duration / totalDuration * 100) + '%'}} className={(isSelected(item) ? 'selected' : '') + (' type-'+item.id)}>
            <div styleName="item-title">{item.title}</div>
            <span styleName="item-duration">{item.duration}W</span>
          </li>
        ))}
      </ul>
      <h3>Our estimate is from <span>$</span>{numberWithCommas(priceEstimate)}</h3>
    </div>
  )
}

ProjectEstimation.defaultProps = {
}

ProjectEstimation.propTypes = {
  project: PT.object.isRequired,
  question: PT.object.isRequired,
  projectTemplate: PT.object.isRequired,
}

export default ProjectEstimation
