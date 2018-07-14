import React from 'react'
import PT from 'prop-types'
import moment from 'moment'

import './MilestonePostEditDate.scss'

class MilestonePostEditDate extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      startDate: moment.utc(this.props.startDateValueDefault).format('YYYY-MM-DD'),
      endDate: moment.utc(this.props.endDateValueDefault).format('YYYY-MM-DD'),
    }

    this.onStartDateChange = this.onStartDateChange.bind(this)
    this.onEndDateChange = this.onEndDateChange.bind(this)
  }

  onStartDateChange(evt) {
    const value = evt.target.value

    this.setState({ startDate: value })
    this.props.onStartDateChange(value)
  }

  onEndDateChange(evt) {
    const value = evt.target.value

    this.setState({ endDate: value })
    this.props.onEndDateChange(value)
  }

  render() {
    const props = this.props
    const { startDate, endDate } = this.state

    return (
      <div styleName={'milestone-post '
      + (props.theme ? props.theme : '')
      }
      >
        <div styleName="label-layer">
          <div styleName={'label-title ' + props.titleExtraStyle}>{'Start'}</div>
          <input type="date" onChange={this.onStartDateChange} value={startDate}  placeholder={'Date'}/>
          <div styleName="label-title">{'End'}</div>
          <input type="date" onChange={this.onEndDateChange} value={endDate}  placeholder={'Date'}/>
        </div>
      </div>
    )
  }
}

MilestonePostEditDate.defaultProps = {
  endDateValueDefault: '',
  startDateValueDefault: '',
  theme: '',
  titleExtraStyle: '',
}

MilestonePostEditDate.propTypes = {
  endDateValueDefault: PT.string,
  startDateValueDefault: PT.string,
  theme: PT.string,
  titleExtraStyle: PT.string,
}

export default MilestonePostEditDate
