import React from 'react'
import PT from 'prop-types'
import './WizardWrapper.scss'
import ConnectLogo from 'appirio-tech-react-components/components/Icons/ConnectLogoWhite'

function WizardWrapper(props) {
  return (
    <div styleName="WizardWrapper" className={`WizardWrapper ${props.className}`}>
      <div styleName="left-sidebar">
        <ConnectLogo wrapperClass="top-logo with-text" title="CONNECT" />
      </div>
      <div styleName="content">
        <div styleName="content-inner">
          {props.children}
        </div>
      </div>
    </div>
  )
}

WizardWrapper.propTypes = {
  children: PT.node.isRequired,
}

export default WizardWrapper
