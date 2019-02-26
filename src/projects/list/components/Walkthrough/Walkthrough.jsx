import React from 'react'
import PropTypes from 'prop-types'
import './Walkthrough.scss'
import NewProjectCard from '../../../components/projectsCard/NewProjectCard'



const Walkthrough = ({newProjectLink}) => (
  <div className="walkthrough-column">
    <div className="header-text-wrapper">
      <h3>Welcome to Topcoder.</h3>
      <h3>To get started, click the "Create a new project" button below.</h3>
    </div>

    <div className="project-card-new">
      <NewProjectCard link={newProjectLink} />
    </div>

    <div className="subtext">
      If you have already created a project with us and are not seeing it listed, contact
      <a href="mailto:support@topcoder.com" target="_blank">support@topcoder.com</a>
    </div>
  </div>
)

Walkthrough.PropTypes = {
  newProjectLink: PropTypes.string
}

export default Walkthrough
