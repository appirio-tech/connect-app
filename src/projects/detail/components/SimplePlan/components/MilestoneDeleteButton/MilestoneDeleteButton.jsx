import React from 'react'
import PT from 'prop-types'
import { Popper, Manager } from 'react-popper'
import ConfirmDeleteMilestone from '../ConfirmDeleteMilestone'
import IconTrash from '../../../../../../assets/icons/icon-ui-trash-simple.svg'

import './MilestoneDeleteButton.scss'

class MilestoneDeleteButton extends React.Component {
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
    const { onDelete } = this.props
    const { open } = this.state

    return (
      <span>
        <button
          type="button"
          className="tc-btn tc-btn-link"
          styleName="icon-button"
          onClick={(event) => {
            event.stopPropagation()

            this.setState({
              open: !open
            })
          }}
          ref={ref => this.btnRef = ref}
        >
          <IconTrash />
        </button>
        {open &&
          <Manager>
            <Popper placement="bottom-end" referenceElement={this.btnRef}>
              {({ ref, style, placement, arrowProps }) => (
                <div ref={ref} style={style} data-placement={placement} styleName="pane">
                  <div ref={ref2 => this.confirmRef = ref2}>
                    <ConfirmDeleteMilestone
                      onClose={(yes) => {
                        if (yes) {
                          onDelete()
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

MilestoneDeleteButton.propTypes = {
  onDelete: PT.func,
}

export default MilestoneDeleteButton
