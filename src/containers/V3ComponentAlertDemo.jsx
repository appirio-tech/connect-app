import React from 'react'
import V3Template from './V3Template'
import AlertComponent from '../components/v3/AlertComponent'
import './V3ComponentDemo.scss'

class V3ComponentAlertDemo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="v3-component-demolist">
        <V3Template>
          <div styleName="viewport">

            <h2 styleName="group-title">Alerts</h2>
            <h3>NORMAL/SUCCESS</h3>
            <AlertComponent
              title="PROJECT DATA SAVED"
              message="All looks good. Keep it going."
            />
            <h3>WARNING</h3>
            <AlertComponent
              title="PROJECT DATA SAVED"
              message="All looks good. Keep it going."
              type="warning"
            />
            <h3>OFFLINE</h3>
            <AlertComponent
              title="NO INTERNET CONNECTION"
              message="We’re offline. We can’t save any changes"
              type="offline"
            />
          </div>

        </V3Template>
      </div>
    )
  }
}

export default V3ComponentAlertDemo