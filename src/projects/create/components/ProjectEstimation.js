import React from 'react'
import _ from 'lodash'
import PT from 'prop-types'
import { flatten } from 'flat'
import cn from 'classnames'

import { evaluate } from '../../../helpers/dependentQuestionsHelper'
import { getProductEstimate } from '../../../config/projectWizard'

import './ProjectEstimation.scss'

const numberWithCommas = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

function ProjectEstimation({ question, project, template }) {
  const isSelected = (item) => evaluate(item.enableCondition, flatten(project, { safe: true }))
  const totalDuration = _.sumBy(question.deliverables, 'duration')
  const phasesEnabled = question.deliverables.filter(isSelected)
  // const enabledDuration = _.sumBy(phasesEnabled, 'duration')

  const { priceEstimate, durationEstimate } = getProductEstimate({scope: template}, project)

  return (
    <div styleName="ProjectEstimation">
      <div styleName="title">
        <h5>{question.title}</h5>
        <span>{phasesEnabled.length ? (
          phasesEnabled.length + ' phases, ' + durationEstimate
        ) : (
          'No phase selected'
        )}</span>
      </div>
      <ul styleName="project-estimate-timeline">
        {question.deliverables.map(item => (
          <li
            key={item.id}
            style={{
              width: (item.duration / totalDuration * 100) + '%'
            }}
            className={cn(`type-${item.id}`, { selected: isSelected(item) })}
          >
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
  template: PT.object.isRequired,
}

export default ProjectEstimation
