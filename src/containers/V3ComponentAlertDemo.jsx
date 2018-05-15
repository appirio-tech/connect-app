import React from 'react'
import { NavLink } from 'react-router-dom'
import AlertComponent from '../components/v3/AlertComponent'
import './V3ComponentDemo.scss'

class V3ComponentAlertDemo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="v3-component-demolist">
        <section>
          <div styleName="viewport">
            <h2 styleName="group-title">Demo Links</h2>
            <ul>
              <li><NavLink to="/V3ComponentDemo"> Progress & menu components </NavLink></li>
              <li><NavLink to="/V3ComponentTimelineDemo"> Timeline & Child Timeline components </NavLink></li>
              <li><NavLink to="/V3ComponentPostcardDemo"> Posts card and post feed components </NavLink></li>
              <li><NavLink to="/V3ComponentSubmissionSelectionDemo"> Submission selection component </NavLink></li>
              <li><NavLink to="/V3ComponentWinnerSelectionDemo"> Winner selection component </NavLink></li>
              <li><NavLink to="/V3ComponentAlertDemo"> Alert component </NavLink></li>
            </ul>
         
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
              type = "warning"
            />
            <h3>OFFLINE</h3>
            <AlertComponent
              title="NO INTERNET CONNECTION"
              message="We’re offline. We can’t save any changes"
              type = "offline"
            />
          </div>

        </section>
      </div >
    )
  }
}

export default V3ComponentAlertDemo