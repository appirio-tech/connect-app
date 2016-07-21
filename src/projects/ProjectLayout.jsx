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
        <div className="content flex">
          <div className="main-pane">
            {main}
          </div>
        </div>
      </div>
    )
  }
}

export default ProjectViewLayout
