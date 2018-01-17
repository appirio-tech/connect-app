import React from 'react'
import PropTypes from 'prop-types'
import './Walkthrough.scss'
import Shadow from '../../../../assets/icons/ground-shadow.svg'
import Robot from '../../../../assets/icons/coder-welcome.svg'
import TextImg from '../../../../assets/icons/pointer-new-project.svg'

/**
 * @params {string} class name
 */
const IconRobot = ({ className }) => {
  return <Robot className={className}/>
}

IconRobot.propTypes = {
  className: PropTypes.string.isRequired
}

/**
 * @params {string} class name
 */
const IconShadow = ({ className }) => {
  return <Shadow className={className}/>
}

IconShadow.propTypes = {
  className: PropTypes.string.isRequired
}

/**
 * @params {string} class name
 */
const IconTextImg = ({ className }) => {
  return <TextImg className={className}/>
}

IconTextImg.propTypes = {
  className: PropTypes.string.isRequired
}

const Walkthrough = ({currentUser}) => (
  <div className="walkthrough-column">
    
    <IconTextImg className="text-img"/>
    
    <div className="bubble">
      <IconRobot className="robot"/>
      <IconShadow className="shadow"/>
      <div>
        <span className="arrow"/>
        <h3>010010010010100101001000100100101 <br/>Bzzt …I mean… Hello, {currentUser.firstName}!</h3>
        <p>Welcome to Connect! I’m Coder the Robot. I see you have no projects yet. To get you started, press the “New Project” icon and let’s build something.</p>
      </div>
    </div>
  </div>
)

Walkthrough.PropTypes = {
  currentUser: PropTypes.object.isRequired
}

export default Walkthrough
