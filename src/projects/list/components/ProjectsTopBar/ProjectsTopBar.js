import React from 'react'
import './ProjectsTopBar.scss'
import {Link} from 'react-router-dom'

const ProjectsTopBar = () => (

  <div className="topbar-container">
    <div className="topbar">
      <Link className="logo tc-btn-sm tc-btn-primary" to="/new-project" >+ New Project</Link>
      <span>All Projects</span>
    </div>
  </div>
)

export default ProjectsTopBar
