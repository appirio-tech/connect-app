import React from 'react'
import { withRouter } from 'react-router-dom'
import { getFreshToken } from 'tc-accounts'
//import { ACCOUNTS_APP_LOGIN_URL } from '../config/constants'

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
      }).catch((error) => {
        console.log('Authentication Failed', error)
        // we have to to redirect to the same page, so we use the whole URL
        //const redirectBackToUrl = encodeURIComponent(window.location.href)
        //const newLocation = ACCOUNTS_APP_LOGIN_URL + '?retUrl=' + redirectBackToUrl
        const homeUrl = window.location.protocol + '//' + window.location.host
        console.log('redirecting... ', homeUrl)
        window.location = homeUrl
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

  return withRouter(AuthenticatedComponent)
}
