'use strict'

import React, { Component } from 'react'

require('./Specification.scss')

class ProjectSpecification extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {project} = this.props
    let details = JSON.stringify(project.details||{}, null, 2)
    return (
      <div className="specification flex">
        <div className="specification-main">
          { details }
        </div>
        <div className="specification-sidebar">
          project specification sidebar
        </div>
      </div>
    )
  }
}

ProjectSpecification.propTypes = {}

ProjectSpecification.defaultProps = {}

export default ProjectSpecification
