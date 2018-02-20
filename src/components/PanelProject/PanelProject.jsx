import React from 'react'
import PropTypes from 'prop-types'
import './PanelProject.scss'

const PanelProject = ({children}) => (
  <div className="panel-project">
    {children}
  </div>
)
PanelProject.propTypes = {
  children: PropTypes.any.isRequired
}

const Heading = ({children}) => (
  <div className="project-heading">
    {children}
  </div>
)
PanelProject.propTypes = {
  children: PropTypes.any.isRequired
}

PanelProject.Heading = Heading

export default PanelProject
