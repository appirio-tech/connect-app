/**
 * View / edit milestone record
 */
import React from 'react'
import PT from 'prop-types'
import IconApprove from '../../../../../../assets/icons/icon-ui-approve.svg'
import IconReject from '../../../../../../assets/icons/icon-ui-reject.svg'

import { Manager, Popper } from 'react-popper'
import ConfirmRejectMilestone from '../ConfirmRejectMilestone/ConfirmRejectMilestone'
import './MilestoneApprovalButton.scss'

class MilestoneApprovalButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  render() {
    const {type, onClick, global, title, hidePoper} = this.props
    const color = type === 'approve' ? 'green' : 'red'

    return (
      <span styleName="wrapper">
        <button
          type="submit"
          className="tc-btn tc-btn-link"
          styleName={`icon-button ${
            global ? 'icon-button-global' : ''
          } ${color} ${title ? 'with-title' : ''}`}
          onClick={() => {
            if(type === 'reject') {
              this.setState({open: true})
            } else {
              onClick()
            }
          }}
          ref={ref => this.btnRef = ref}
        >
          {type === 'approve' ? <IconApprove /> : <IconReject />}
          {title && <div styleName="title">{title}</div>}
        </button>

        {this.state.open && type==='reject' && !hidePoper && (
          <Manager>
            <Popper placement="bottom-end" referenceElement={this.btnRef} >
              {({ ref, style, placement, arrowProps }) => (
                <div
                  ref={ref}
                  style={style}
                  data-placement={placement}
                  styleName={`pane ${title ? 'with-title': ''}`}
                >
                  <div ref={(ref2) => (this.confirmRef = ref2)}>
                    <ConfirmRejectMilestone
                      onClose={(yes, value) => {
                        if (yes) {
                          onClick(value)
                        }
                        this.setState({ open: false })
                      }}
                    />
                    <div
                      ref={arrowProps.ref}
                      style={arrowProps.style}
                      styleName="arrow"
                    />
                  </div>
                </div>
              )}
            </Popper>
          </Manager>
        )}
      </span>
    )
  }
}

MilestoneApprovalButton.propTypes = {
  type: PT.string,
  onClick: PT.func,
  global: PT.bool,
  title: PT.string,
  hidePoper: PT.bool
}

export default MilestoneApprovalButton
