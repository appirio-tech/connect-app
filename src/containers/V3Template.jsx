import React from 'react'
import './V3ComponentDemo.scss'
import { NavLink } from 'react-router-dom'

class V3Template extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {

    return (
      <div styleName="v3-component-demolist">
        <div>
          <div styleName="viewport">
            <h2 styleName="group-title">Demo Links</h2>
            <ul>
              <li><NavLink to="/V3ComponentDemo"> Progress & menu components </NavLink></li>
              <li><NavLink to="/V3ComponentTimelineDemo"> Timeline component </NavLink></li>
              <li><NavLink to="/V3ComponentPostcardDemo"> Posts card and post feed components </NavLink></li>
              <li><NavLink to="/V3ComponentSubmissionSelectionDemo"> Submission selection component </NavLink></li>
              <li><NavLink to="/V3ComponentWinnerSelectionDemo"> Winner selection component </NavLink></li>
              <li><NavLink to="/V3ComponentAlertDemo"> Alert component </NavLink></li>
              <li><NavLink to="/V3PhaseCard"> PhaseCard </NavLink></li>
              <li><NavLink to="/V3TimeChildComponents"> Timeline child components </NavLink></li>
            </ul>
          </div>

          <div styleName="component-container">
            {this.props.children}
          </div>


        </div>
      </div>
    )
  }
}

export default V3Template
