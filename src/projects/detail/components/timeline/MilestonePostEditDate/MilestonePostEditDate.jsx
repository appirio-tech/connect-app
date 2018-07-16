import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import cn from 'classnames'

import './MilestonePostEditDate.scss'

class MilestonePostEditDate extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      startDate: moment(this.props.startDateValueDefault).format('YYYY-MM-DD'),
      endDate: moment(this.props.endDateValueDefault).format('YYYY-MM-DD'),
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
    const { startDate, endDate, theme } = this.state

    return (
      <div styleName={cn('milestone-post', theme)}>
        <div styleName="col-left">
          <div styleName="label-title">Start</div>
          <div styleName="label-title">End</div>{/* this is shown on narrow screens */}
        </div>
        <div styleName="col-right">
          <div styleName="label-layer">
            <input type="date" onChange={this.onStartDateChange} value={startDate}  placeholder="Date" />
            <div styleName="label-title">End</div>{/* this is hidden on narrow screens */}
            <input type="date" onChange={this.onEndDateChange} value={endDate}  placeholder="Date" />
          </div>
        </div>
      </div>
    )
  }
}

MilestonePostEditDate.defaultProps = {
  endDateValueDefault: '',
  startDateValueDefault: '',
  theme: '',
}

MilestonePostEditDate.propTypes = {
  endDateValueDefault: PT.string,
  startDateValueDefault: PT.string,
  theme: PT.string,
}

export default MilestonePostEditDate
