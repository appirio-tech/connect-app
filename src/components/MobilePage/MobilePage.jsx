/**
 * Displays page in mobile resolution on top of the current page without changing URL address (kind of fullscreen popup)
 * While displaying the content it cuts the main content
 * so browser scrollbar works for the content of this mobile page
 */
import React from 'react'
import PropTypes from 'prop-types'
import './MobilePage.scss'

class MobilePage extends React.Component {
  componentWillMount() {
    document.body.classList.add('hidden-content')
  }

  componentWillUnmount() {
    document.body.classList.remove('hidden-content')
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
