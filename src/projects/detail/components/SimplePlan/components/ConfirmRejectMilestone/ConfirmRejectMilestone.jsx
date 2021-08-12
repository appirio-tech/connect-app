import React from 'react'
import PT from 'prop-types'
import IconHelp from '../../../../../../assets/icons/help-me.svg'

import './ConfirmRejectMilestone.scss'

class ConfirmRejectMilestone extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
    }
  }
  render() {
    const { onClose } = this.props
    return (
      <div styleName="confirm-reject-milestone">
        <h3 styleName="title">
          <IconHelp styleName="icon" />
          Rejection Confirmation
        </h3>
        <p styleName="text">
          Please enter the reason for rejection the selected milestones(s), so
          it can be reviewed by the project manager/copilot.
        </p>
        <textarea
          value={this.state.value}
          onChange={(e) => this.setState({ value: e.target.value })}
        />
        <div styleName="footer">
          <button
            type="button"
            className="tc-btn tc-btn-sm"
            onClick={() => onClose(true, this.state.value)}
          >
            DONE
          </button>
          <button
            type="button"
            className="tc-btn tc-btn-sm"
            onClick={() => onClose()}
          >
            CANCEL
          </button>
        </div>
      </div>
    )
  }
}

ConfirmRejectMilestone.propTypes = {
  onClose: PT.func,
}

export default ConfirmRejectMilestone
