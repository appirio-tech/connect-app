import React from 'react'
import PT from 'prop-types'
import './MilestonePost.scss'



const MilestonePost = (props) => {
  const image = props.image ? props.image : require('../../../assets/icons/timeline-invoice.svg')
  const labelMilestoneStyle = {
    paddingLeft: '36px',
    position: 'relative',
    background: 'url('+ image +') 0 50% no-repeat',
    backgroundSize: '30px'
  }
  return (
    <div styleName={'milestone-post ' 
    + (props.theme ? props.theme : '')
    + (props.isCompleted ? 'completed' : '')
    + (props.inProgress ? 'in-progress' : '')
    }
    >
      {
        props.inProgress !== null && props.inProgress !== undefined && (
          <span styleName="dot" >{ props.inProgress}</span>
        )
      }
      <div styleName="label-layer">
        <span style={ labelMilestoneStyle }>{props.label}</span>
        <div styleName="group-right hide-sm">
          <a href={props.milestonePostLink} styleName="milestone-text" dangerouslySetInnerHTML={{ __html: props.milestonePostLink }} />
        </div>
      </div>
    </div>
  )
}

MilestonePost.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool
}

export default MilestonePost
