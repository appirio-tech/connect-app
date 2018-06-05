import React from 'react'
import PT from 'prop-types'
import './MilestonePostEditTextArea.scss'



class MilestonePostEditTextArea extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: '',
      currentCount: 0
    }
    this.onValueChange = this.onValueChange.bind(this)
  }
  /**get update value from textarea */
  onValueChange (event) {
    event.stopPropagation()
    const value = event.target.value
    this.setState({value})
  }

  render() {
    const props = this.props
    const title = props.title ? props.title : 'Title'
    return (
      <div styleName={'milestone-post ' 
      + (props.theme ? props.theme : '')
      }
      >
        <div styleName="label-layer">
          <div styleName="label-title">{title}</div>
          <textarea type="text" onChange={this.onValueChange} value={this.state.value}  placeholder={props.title} rows="5"/>
        </div>
      </div>
    )
  }
}

MilestonePostEditTextArea.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool
}

export default MilestonePostEditTextArea
