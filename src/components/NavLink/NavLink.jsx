import React, { PropTypes, Component } from 'react'
import {withRouter, Link} from 'react-router'

class NavLink extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { to, content, target } = this.props
    let classes = this.props.classes
    const isActive = this.props.router.isActive(this.props.to, true)
    if (isActive) {
      classes += ' selected'
    }
    const attrs = { to }
    if (target || target !== '_self') {
      attrs.target = target
      if (attrs.target === '_blank') {
        attrs.rel = 'noopener noreferrer'
      }
    }
    return (
      <li className={classes}>
        <Link {...attrs}>{content}</Link>
      </li>
    )
  }
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  target: PropTypes.string,
  content: PropTypes.string.isRequired,
  classes: PropTypes.string.isRequired
}

export default withRouter(NavLink)
