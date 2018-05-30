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

  onValueChange1 (event) {
    event.stopPropagation()
    const start = event.target.value
    this.setState({start})
  }

  onValueChange2 (event) {
    event.stopPropagation()
    const end = event.target.value
    this.setState({end})
  }

  render() {
    const props = this.props
    const labelStyle = {}
    if (props.titleSpace !== '') {
      labelStyle['marginRight'] = props.titleSpace
    }
    if (props.paddingLeft !== '') {
      labelStyle['paddingLeft'] = props.paddingLeft
    }
    return (
      <div styleName={'milestone-post ' 
      + (props.theme ? props.theme : '')
      }
      >
        <div styleName="label-layer">
          <div style={labelStyle} styleName="label-title">{'Start'}</div>
          <input type="text" onChange={this.onValueChange1} value={this.state.start}  placeholder={'Date'}/>
          <div styleName="label-title">{'End'}</div>
          <input type="text" onChange={this.onValueChange} value={this.state.end}  placeholder={'Date'}/>
        </div>
      </div>
    )
  }
}

MilestonePostEditDate.defaultProps = {
  titleSpace: '',
  paddingLeft: '',
}

MilestonePostEditDate.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool,
  titleSpace: PT.string,
  paddingLeft: PT.string
}

export default MilestonePostEditDate
