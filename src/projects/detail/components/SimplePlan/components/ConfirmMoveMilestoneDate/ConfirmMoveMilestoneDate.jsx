import React from 'react'
import PT from 'prop-types'
import IconHelp from '../../../../../../assets/icons/help-me.svg'
import './ConfirmMoveMilestoneDate.scss'


class ConfirmMoveMilestoneDate extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: 0
    }
    this.onInputChange = this.onInputChange.bind(this)
  }
  onInputChange(e) {
    this.setState({
      value: e.target.value
    })
  }
  render() {
    const {
      onClose
    } = this.props
    return (
      <div styleName="confirm-delete-milestone">
        <h3 styleName="title">
          <IconHelp styleName="icon" />
        Move Milestone Dates
        </h3>
        <p styleName="text">
        Move selected milestone dates
        </p>
        <div styleName="input-row">
          <input type="number" min={0} value={this.state.value} onChange={this.onInputChange}/> days
        </div>
        <div styleName="footer">
          <button type="button" className="tc-btn tc-btn-primary tc-btn-sm" onClick={() => onClose(true, this.state.value)}>MOVE</button>
          <button type="button" className="tc-btn tc-btn-warning tc-btn-sm" onClick={() => onClose()}>CANCEL</button>
        </div>
      </div>
    )
  }
}

ConfirmMoveMilestoneDate.propTypes = {
  onClose: PT.func,
}

export default ConfirmMoveMilestoneDate
