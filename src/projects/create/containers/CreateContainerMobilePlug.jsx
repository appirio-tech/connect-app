/**
 * Plug for create new project page for mobile resolutions
 */
import React from 'react'
import { Link } from 'react-router-dom'
import './CreateContainerMobilePlug.scss'
import Spaceship from '../../../assets/icons/spaceship.svg'

const CreateContainerMobilePlug = () => (
  <div styleName="container">
    <div styleName="illustration">
      <Spaceship />
    </div>
    <h1 styleName="title">CREATE NEW PROJECT</h1>
    <p styleName="text">For the full experience, Please log in to <a href="https://connect.topcoder.com/">connect.topcoder.com</a> using your desktop browser</p>
    <div styleName="back-home">
      <Link className="tc-btn tc-btn-primary tc-btn-md" to="/">Back to Homepage</Link>
    </div>
  </div>
)

export default CreateContainerMobilePlug
