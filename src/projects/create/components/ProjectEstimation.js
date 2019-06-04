import React from 'react'
import _ from 'lodash'
import PT from 'prop-types'
import { flatten } from 'flat'
import cn from 'classnames'

import { evaluate } from 'expression-evaluator'
import { getProductEstimate } from '../../../config/projectWizard'

import './ProjectEstimation.scss'

const numberWithCommas = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

function ProjectEstimation({ question, project, template }) {
  const isSelected = (item) => evaluate(item.enableCondition, flatten(project, { safe: true }))
  let totalDuration = 0//_.sumBy(question.deliverables, 'duration')
  const phasesEnabled = question.deliverables.filter(isSelected)
  // const enabledDuration = _.sumBy(phasesEnabled, 'duration')

  const { priceEstimate, durationEstimate, estimateBlocks } = getProductEstimate({scope: template}, project)
  // console.log(estimateBlocks)
  const deliverables = _.map(question.deliverables, item => {
    const buildingBlocks = _.filter(estimateBlocks, b => _.get(b, 'metadata.deliverable') === item.deliverableKey)
    if (buildingBlocks) {
      totalDuration += _.sumBy(buildingBlocks, 'maxTime')
    }
    return { ...item, buildingBlocks }
  })
  // console.log(totalDuration)
  const renderBlock = (item) => {
    const durationText = item.duration ? `${item.duration} Days` : 'N/A'
    const style = {}
    if (item.duration > 0) {
      style['width'] = (item.duration / totalDuration * 100) + '%'
    }
    return (
      <li
        key={item.id}
        style={style}
        className={cn(`type-${item.id}`, { selected: isSelected(item) })}
      >
        <div styleName="item-title">{item.title}</div>
        <span styleName="item-duration">{durationText}</span>
      </li>
    )
  }
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
        {deliverables.map(item => {
          const duration = _.sumBy(item.buildingBlocks, 'maxTime')
          return renderBlock({ ...item, duration: duration ? duration : null })
        })}
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
