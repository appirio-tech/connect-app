import React from 'react'

import {getFreshToken} from 'tc-accounts'
import {ACCOUNTS_APP_LOGIN_URL} from '../config/constants'

export function requiresAuthentication(Component) {

  class AuthenticatedComponent extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        isLoggedIn: false
      }
    }

    componentWillMount() {
      this.checkAuth()
    }

    checkAuth() {
      getFreshToken().then(() => {
        this.setState({isLoggedIn: true})
      }).catch(() => {
        // FIXME should we include hash, search etc
        const redirectBackToUrl = window.location.origin + '/' + this.props.location.pathname
        const newLocation = ACCOUNTS_APP_LOGIN_URL + '?retUrl=' + redirectBackToUrl
        console.log('redirecting... ', newLocation)
        window.location = newLocation
      })
    }

    render() {
      return (
        <div>
          {
            this.state.isLoggedIn === true
            ? <Component { ...this.props}/>
            : null
          }
        </div>
      )
    }
  }

  return AuthenticatedComponent
}
