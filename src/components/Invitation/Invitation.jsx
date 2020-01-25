/**
 * Flying chat button
 */
import React from 'react'
import PT from 'prop-types'

import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'
import cn from 'classnames'
import styles from './Invitation.scss'
import ArrowIcon from '../../assets/icons/arrow-9px-carret-down-normal.svg'
import CheckIcon from '../../assets/icons/ui-check.svg'
console.log(styles)

class Invitation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false
    }
    this.onLabelClick = this.onLabelClick.bind(this)
  }

  onLabelClick(event) {
    event.stopPropagation()
    this.setState({isShow: !this.state.isShow}) 
  }

  render() {
    const {
      onAcceptClick,
      onRejectClick,
      isLoading
    } = this.props

    const {
      isShow 
    } = this.state
    return (
      <div styleName="container">
        <div styleName="label" onClick={this.onLabelClick}>
          You're Invited
          <ArrowIcon fill="red"/>
        </div>
        {isShow &&<div styleName="popup">
          {!isLoading ?<div>
            <button
              onClick={(event) => {
                event.stopPropagation()
                onAcceptClick()
              }}
              className={cn('tc-btn tc-btn-primary', styles['btn'])}
            ><CheckIcon/>JOIN</button>
            <button
              onClick={(event) => {
                event.stopPropagation()
                onRejectClick()
              }}
              className={cn('tc-btn', styles['btn'], styles['reject-btn'])}
            >DECLINE</button>
          </div>: <LoadingIndicator isSmall />}
        </div>}
      </div>
    )
  }
}

Invitation.propTypes = {
  onAcceptClick: PT.func,
  onRejectClick: PT.func,
  isLoading: PT.bool,
}

export default Invitation
