import React from 'react'
import PT from 'prop-types'
import './MilestonePostSpecification.scss'

class MilestonePostSpecification extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSpecificationLinkAdded: false
    }
  }

  render() {
    const props = this.props

    return (
      <div styleName={'milestone-post-specification '
        + (props.theme ? props.theme : '')
        + (props.isCompleted ? ' completed ' : '')
        + (props.inProgress ? 'in-progress' : '')
      }
      >
        <div styleName="add-specification-layer addlink-bar" className="flex center middle">
          <figure styleName={'thumb ' + (props.icon ? props.icon : '')} />
          <button className="tc-btn tc-btn-default"
            onClick={this.cancelDelete}
          ><strong>{props.label}</strong></button>
        </div>
      </div>
    )
  }
}

MilestonePostSpecification.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool
}

export default MilestonePostSpecification
