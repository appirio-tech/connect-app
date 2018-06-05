import React from 'react'
import PT from 'prop-types'
import './MilestonePostEditDate.scss'



class MilestonePostEditDate extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      start: '',
      end: '',
      currentCount: 0
    }
    this.onValueChange1 = this.onValueChange1.bind(this)
    this.onValueChange2 = this.onValueChange2.bind(this)
  }

  // update text for text box 1
  onValueChange1 (event) {
    event.stopPropagation()
    const start = event.target.value
    this.setState({start})
  }

  // update text for text box 2
  onValueChange2 (event) {
    event.stopPropagation()
    const end = event.target.value
    this.setState({end})
  }

  render() {
    const props = this.props
    return (
      <div styleName={'milestone-post ' 
      + (props.theme ? props.theme : '')
      }
      >
        <div styleName="label-layer">
          <div styleName={'label-title ' + props.titleExtraStyle}>{'Start'}</div>
          <input type="date" onChange={this.onValueChange1} value={this.state.start}  placeholder={'Date'}/>
          <div styleName="label-title">{'End'}</div>
          <input type="date" onChange={this.onValueChange} value={this.state.end}  placeholder={'Date'}/>
        </div>
      </div>
    )
  }
}

MilestonePostEditDate.defaultProps = {
  titleExtraStyle: '',
}

MilestonePostEditDate.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool,
  titleExtraStyle: PT.string,
}

export default MilestonePostEditDate
