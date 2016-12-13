import React, { PropTypes, Component } from 'react'

import classNames from 'classnames'
import NavLink from '../NavLink/NavLink'

require('./MenuBar.scss')

export default class MenuBar extends Component {
  componentWillMount() {
    this.handleResize = this.handleResize.bind(this)
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize() {
    this.setState({ mobile: window.innerWidth <= this.props.mobileBreakPoint })
  }


  renderLinkDom(item, linkContent, itemClass, linkTarget) {
    // _.self forces a full page refresh using underlying Link
    linkTarget = item.target || null
    return (
      <NavLink key={item.text} to={item.link} target={linkTarget} content={linkContent} classes={itemClass} />
    )
  }

  renderAnchorDom(item, linkContent, itemClass, linkTarget) {
    return (
      <li key={item.text} className={itemClass}>
        <a href={item.link} target={linkTarget}>{linkContent}</a>
      </li>
    )
  }
  render() {
    const { orientation, items, forReactRouter } = this.props

    const mbClasses = classNames({
      MenuBar: true,
      [orientation]: true
    })

    const menuItem = item => {
      const itemClass = classNames({
        [orientation]: true,
        mobile: this.state.mobile,
        selected: item.selected || (item.regex && window.location.href.match(item.regex) !== null)
      })

      const linkTarget = item.target || '_self'
      const linkContent = this.state.mobile ? <img src={item.img} /> : item.text

      return forReactRouter ?
        this.renderLinkDom(item, linkContent, itemClass, linkTarget)
        : this.renderAnchorDom(item, linkContent, itemClass, linkTarget)
    }

    return (
      <ul className={mbClasses}>
        { items.map(menuItem) }
      </ul>
    )
  }
}

MenuBar.propTypes = {
  items: PropTypes.array.isRequired,
  mobileBreakPoint: PropTypes.number,
  orientation: PropTypes.oneOf(['vertical', 'horizontal'])
}

MenuBar.defaultProps = {
  mobileBreakPoint: 768,
  orientation: 'horizontal'
}
