import React from 'react'
import CoderBroken from '../assets/icons/coder-broken.svg'
import {hasPermission} from './permissions'

function protectComponent(Component, permission, pageName) {
  class ProtectedComponent extends React.Component {
    render() {
      if (!hasPermission(permission)) {
        return (
          <section className="content content-error">
            <div className="container">
              <div className="page-error">
                <CoderBroken className="icon-coder-broken" />
                <span>You don't have permission to access {pageName || 'this page'}</span>
              </div>
            </div>
          </section>
        )
      }
      return <Component {...this.props} />
    }
  }

  return ProtectedComponent
}

export default protectComponent
