import React from 'react'
import PT from 'prop-types'
import { Popper, Manager } from 'react-popper'
import ConfirmMoveMilestoneDate from '../ConfirmMoveMilestoneDate'
import IconCalendar from '../../../../../../assets/icons/icon-calendar2.svg'

import './MilestoneMoveDateButton.scss'

class MilestoneMoveDateButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }

    this.onClickOutside = this.onClickOutside.bind(this)
  }

  componentDidUpdate() {
    const { open } = this.state

    if (open) {
      document.addEventListener('click', this.onClickOutside)
    } else {
      document.removeEventListener('click', this.onClickOutside)
    }
  }

  onClickOutside(event) {
    if (this.confirmRef.contains(event.target)) {
      return
    }

    this.setState({ open: false })
  }

  render() {
    const { onMove } = this.props
    const { open } = this.state

    return (
      <span>
        <span
          styleName="icon-button"
          onClick={(event) => {
            event.stopPropagation()

            this.setState({
              open: !open
            })
          }}
          ref={ref => this.btnRef = ref}
        >
          <IconCalendar />
        </span>
        {open &&
          <Manager>
            <Popper placement="bottom-end" referenceElement={this.btnRef}>
              {({ ref, style, placement, arrowProps }) => (
                <div ref={ref} style={style} data-placement={placement} styleName="pane">
                  <div ref={ref2 => this.confirmRef = ref2}>
                    <ConfirmMoveMilestoneDate
                      onClose={(yes, value) => {
                        if (yes) {
                          onMove(value)
                        }
                        this.setState({ open: false })
                      }}
                    />
                    <div ref={arrowProps.ref} style={arrowProps.style} styleName="arrow" />
                  </div>
                </div>
              )}
            </Popper>
          </Manager>
        }
      </span>
    )
  }
}

MilestoneMoveDateButton.propTypes = {
  onMove: PT.func,
}

export default MilestoneMoveDateButton
