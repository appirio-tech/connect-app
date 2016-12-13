import React from 'react'
import cn from 'classnames'

require('./FullHeightContainer.scss')

class FullHeightContainer extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let page = this.refs.fullHeightContainer
    const offset = this.props.offset || 0
    while(page && page.nodeName !== '#document') {
      page.style.height = 'calc(100vh - ' + offset + 'px)'
      page = page.parentNode
    }
  }

  render() {
    const containerClasses = cn('FullHeightContainer', {
      [`${this.props.className}`] : true
    })
    return (
      <div className={ containerClasses } ref="fullHeightContainer">
        { this.props.children }
      </div>
    )
  }
}

export default FullHeightContainer
