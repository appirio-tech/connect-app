/**
 * Makes children component collapsible/expandable with provided title
 *
 * This component only takes effect for mobile resolutions
 */
import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import ArrowDownIcon from '../../assets/icons/arrows-16px-3_small-down.svg'
import './MobileExpandable.scss'

class MobileExpandable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: this.props.defaultOpen
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const { title, children } = this.props
    const { isOpen } = this.state

    return (
      <div styleName={cn({open: isOpen})}>
        <div styleName="header" onClick={this.toggle}>
          <div styleName="title">{title}</div>
          <ArrowDownIcon styleName="arrow" />
        </div>
        <div styleName="body">{children}</div>
      </div>
    )
  }
}

MobileExpandable.defaultProps = {
  defaultOpen: false
}

MobileExpandable.propTypes = {
  defaultOpen: PropTypes.bool
}

export default MobileExpandable
