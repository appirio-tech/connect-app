/**
 * Displays page in mobile resolution on top of the current page without changing URL address (kind of fullscreen popup)
 * While displaying the content it cuts the main content
 * so browser scrollbar works for the content of this mobile page
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import { Gateway } from 'react-gateway'

import './MobilePage.scss'

// unique id of the page
let uid = 0
const openedPages = []

class MobilePage extends React.Component {
  constructor(props) {
    super(props)

    // to remember page scroll position
    this.scrollTop
    this.topToolbarPaddingRight

    // assign a unique id to each of the components
    uid += 1
    this.uid = uid
  }

  componentWillMount() {
    // if browser window has scrollbar, we add class to body to keep scrollbar
    // no matter what content is, to avoid content jumping
    const hasVScroll = document.body.scrollHeight > window.innerHeight
    if (hasVScroll) {
      document.body.classList.add('persist-scrollbar')
    }

    // save scroll position
    this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    document.body.classList.add('hidden-content')

    // add to the list of opened components
    openedPages.push(this.uid)
  }

  componentDidMount() {
    // scroll to the top when open
    document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  componentWillUnmount() {
    // remove from list of opened components
    _.remove(openedPages, (uid) => uid === this.uid)

    // only if there are no opened components left, we clear body classes
    if (openedPages.length === 0) {
      document.body.classList.remove('hidden-content')
      document.body.classList.remove('persist-scrollbar')
    }

    // restore scroll position
    document.body.scrollTop = document.documentElement.scrollTop = this.scrollTop
  }

  render() {
    const { children, keepToolbar } = this.props

    return (
      <Gateway into="fullscreen-page">
        <div styleName={cn('container', { 'keep-toolbar': keepToolbar })}>
          {children}
        </div>
      </Gateway>
    )
  }
}

MobilePage.defaultProps = {
  keepToolbar: false,
}

MobilePage.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  keepToolbar: PropTypes.bool,
}

export default MobilePage
