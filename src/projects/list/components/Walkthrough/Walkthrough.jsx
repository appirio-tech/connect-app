import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import './Walkthrough.scss'
import IconShadow from '../../../../assets/icons/ground-shadow.svg'
import IconRobot from '../../../../assets/icons/coder-welcome.svg'
import IconTextImg from '../../../../assets/icons/pointer-new-project.svg'
import BoldAdd from '../../../../assets/icons/ui-16px-1_bold-add.svg'



const Walkthrough = ({currentUser}) => (
  <div className="walkthrough-column">
    
    <IconTextImg className="text-img"/>
    
    <div className="bubble">
      <IconRobot className="robot robotleft"/>
      <div>
        <span className="arrow"/>
        <h3>010010010010100101001000100100101 <br/>Bzzt …I mean… Hello, {currentUser.firstName}!</h3>
        <p>Welcome to Connect! I’m Coder the Robot. I see you have no projects yet. To get you started, press the “New Project” icon and let’s build something.</p>
        <Link to="/new-project">
          <div className="new-project-button">
            <div className="new-project-icon">
              <BoldAdd className="icon-bold-add"/>
            </div>
            <div className="title">Create a new project</div>
          </div>
        </Link>
      </div>
      <IconRobot className="robot"/>
      <IconShadow className="shadow"/>
    </div>
  </div>
)

Walkthrough.PropTypes = {
  currentUser: PropTypes.object.isRequired
}

export default Walkthrough
