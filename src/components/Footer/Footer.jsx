/* global tcUniNav */
import React, { Component } from 'react'

let uniqueId = 0

class Footer extends Component {
  constructor(props) {
    super(props)
    uniqueId += 1
    this.footerIdRef = uniqueId
    this.uniNavInitialized = false
  }

  componentDidMount() {
    if (!!this.footerIdRef && !this.uniNavInitialized) {
      this.uniNavInitialized = true
      tcUniNav('init', `footerNav-${this.footerIdRef}`, {
        fullFooter: false,
        type: 'footer',
      })
    }
  }

  render() {
    return <div id={`footerNav-${this.footerIdRef}`} />
  }
}

Footer.propTypes = {}

Footer.defaultProps = {}

export default Footer
