import React from 'react'
import './ProjectsTopBar.scss'
import {Link} from 'react-router'

const ProjectsTopBar = () => (

  <div className="topbar-container">
    <div className="topbar">
      <Link to="projects/create"  className="logo tc-btn-sm tc-btn-primary">+ New Project</Link>
      <span>All Projects</span>
    </div>
  </div>
)

export default ProjectsTopBar
