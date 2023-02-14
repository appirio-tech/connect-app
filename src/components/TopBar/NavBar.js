/* global tcUniNav */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  HEADER_AUTH_URLS_HREF,
  HEADER_AUTH_URLS_LOCATION,
  DOMAIN,
} from '../../config/constants'

const HEADER_AUTH_URLS = {
  href: HEADER_AUTH_URLS_HREF,
  location: HEADER_AUTH_URLS_LOCATION,
}
const BASE = `https://www.${DOMAIN}`

let uniqueId = 0

class NavBar extends Component {
  constructor(props) {
    super(props)
    uniqueId += 1
    this.headerIdRef = uniqueId
    this.uniNavInitialized = false
  }

  componentDidMount() {
    if (!!this.headerIdRef && !this.uniNavInitialized) {
      this.uniNavInitialized = true
      const headerId = this.headerIdRef
      const authURLs = HEADER_AUTH_URLS

      const regSource = window.location.pathname.split('/')[1]
      const retUrl = encodeURIComponent(window.location.href)
      tcUniNav('init', `headerNav-${headerId}`, {
        type: 'tool',
        toolName: 'Connect',
        toolRoot: '/',
        user: 'auto',
        signOut: () => {
          window.location = `${BASE}/logout?ref=nav`
        },
        signIn: () => {
          window.location = `${authURLs.location
            .replace('%S', retUrl)
            .replace('member?', '#!/member?')}&regSource=${regSource}`
        },
        signUp: () => {
          window.location = `${authURLs.location
            .replace('%S', retUrl)
            .replace(
              'member?',
              '#!/member?'
            )}&mode=signUp&regSource=${regSource}`
        },
      })
    }
  }

  render() {
    return <div id={`headerNav-${this.headerIdRef}`} />
  }
}

NavBar.propTypes = {
  user : PropTypes.object,
}

NavBar.defaultProps = {}

export default NavBar
