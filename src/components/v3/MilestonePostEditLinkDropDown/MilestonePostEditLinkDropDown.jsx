import React from 'react'
import PT from 'prop-types'
import './MilestonePostEditLinkDropDown.scss'

class MilestonePostEditLinkDropDown extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: 'test',
      currentCount: 0
    }
    this.onValueChange = this.onValueChange.bind(this)
  }

  /**use for update value for input text */
  onValueChange (event) {
    event.stopPropagation()
    const value = event.target.value
    this.setState({value})
  }

  render() {
    const props = this.props
    const title = props.title ? props.title : 'Title'
    const value = props.value ? props.value : ''
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
          <div style={labelStyle} styleName="label-title">{title}</div>
          <input type="text" onChange={this.onValueChange} value={value}  placeholder={'title'} />
          <span />
        </div>
      </div>
    )
  }
}

MilestonePostEditLinkDropDown.defaultProps = {
  titleSpace: '',
  paddingLeft: '',
}

MilestonePostEditLinkDropDown.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool,
  titleSpace: PT.string,
  paddingLeft: PT.string
}

export default MilestonePostEditLinkDropDown
