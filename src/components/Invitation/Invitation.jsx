/**
 * Flying chat button
 */
import React from 'react'
import PT from 'prop-types'

import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'
import cn from 'classnames'
import styles from './Invitation.scss'
import EnhancedDropdown from '../NotificationsDropdown/EnhancedDropdown'
import ArrowIcon from '../../assets/icons/arrow-6px-carret-down-active.svg'
import CheckIcon from '../../assets/icons/ui-check.svg'

class Invitation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false
    }
    this.onToggle = this.onToggle.bind(this)
  }

  onToggle(isShow) {
    if(typeof isShow === 'object') {
      this.setState({isShow: !this.state.isShow}) 
    }else {
      this.setState({isShow}) 
    }
  }

  render() {
    const {
      onAcceptClick,
      onRejectClick,
      isLoading
    } = this.props

    return (
      <div styleName="container">
        <EnhancedDropdown theme="UserDropdownMenu" pointerShadow  noAutoclose onToggle={this.onToggle}>
          <div className="dropdown-menu-header">
            <div styleName="label" onClick={this.onToggle}>
                YOU'RE INVITED
              <ArrowIcon className={this.state.isShow ? styles.rotate : ''}/>
            </div>
          </div>
          <div className={cn('dropdown-menu-list', styles['popup'] )}>
            {(!isLoading) ?<div>
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  onAcceptClick()
                }}
                className={cn('tc-btn tc-btn-primary dropdown-wrap', styles['btn'])}
              ><CheckIcon/>JOIN</button>
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  onRejectClick()
                }}
                className={cn('tc-btn tc-btn-warning dropdown-wrap', styles['btn'], styles['reject-btn'])}
              >DECLINE</button>
            </div>: <LoadingIndicator isSmall />}
          </div>

        </EnhancedDropdown>
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
