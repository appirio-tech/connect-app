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
  let totalDuration = 0//_.sumBy(question.deliverables, 'duration')
  const phasesEnabled = question.deliverables.filter(isSelected)
  // const enabledDuration = _.sumBy(phasesEnabled, 'duration')

  const { priceEstimate, durationEstimate, estimateBlocks } = getProductEstimate({scope: template}, project)
  // console.log(estimateBlocks)
  const deliverables = _.map(question.deliverables, item => {
    // for now it assumes that there is only one block that matches the conditions per deliverable
    // if there are cases where we can have more than one blocks, we have to aggregate the blocks to come up
    // with representable values
    const buildingBlock = _.find(estimateBlocks, b => _.get(b, 'metadata.deliverable') === item.deliverableKey)
    // console.log(buildingBlock)
    if (buildingBlock) {
      totalDuration += buildingBlock.maxTime
    }
    return { ...item, buildingBlock }
  })
  // console.log(totalDuration)
  const renderBlock = (item) => {
    const durationText = item.duration ? `${item.duration} Days` : 'N/A'
    return (
      <li
        key={item.id}
        style={{
          width: (item.duration / totalDuration * 100) + '%'
        }}
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
          const duration = _.get(item, 'buildingBlock.maxTime')
          return renderBlock({ ...item, duration })
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
