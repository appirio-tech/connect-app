/**
 * Displays page in mobile resolution on top of the current page without changing URL address (kind of fullscreen popup)
 * While displaying the content it cuts the main content
 * so browser scrollbar works for the content of this mobile page
 */
import React from 'react'
import PropTypes from 'prop-types'
import './MobilePage.scss'

class MobilePage extends React.Component {
  constructor(props) {
    super(props)

    // to remember page scroll position
    this.scrollTop
  }

  componentWillMount() {
    // save scroll position
    this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    document.body.classList.add('hidden-content')
  }

  componentWillUnmount() {
    document.body.classList.remove('hidden-content')
    // restore scroll position
    document.body.scrollTop = document.documentElement.scrollTop = this.scrollTop
  }

  render() {
    const { children } = this.props

    return (
      <div styleName="container">
        {children}
      </div>
    )
  }
}

MobilePage.defaultProps = {
  defaultOpen: false
}

MobilePage.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  defaultOpen: PropTypes.bool,
}

export default MobilePage
