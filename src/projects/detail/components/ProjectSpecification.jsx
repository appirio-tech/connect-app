'use strict'

import React, { PropTypes, Component } from 'react'


class ProjectSpecification extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    // TODO - add more
    return (
      <div className=''>
        {this.props.project.details}
      </div>
    )
  }
}

ProjectSpecification.propTypes = {}

ProjectSpecification.defaultProps = {}

export default ProjectSpecification
