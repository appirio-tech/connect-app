import React, { Component } from 'react'

require('./ProjectLayout.scss')

class ProjectViewLayout extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { main } = this.props
    return (
      <div className="content-pane">
        <div className="top-bar" />
        {main}
      </div>
    )
    // return this.props.children
  }
}

export default ProjectViewLayout
