import React, { Component } from 'react'

require('./ProjectLayout.scss')

class ProjectViewLayout extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {topbar, main} = this.props
    return (
      <div className="content-pane">
        <div className="top-bar">
          {topbar}
        </div>
        {main}
      </div>
    )
  }
}

export default ProjectViewLayout
