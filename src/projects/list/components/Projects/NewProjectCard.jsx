
import React, { Component } from 'react'
import PT from 'prop-types'
import {Link} from 'react-router-dom'
import './ProjectCard.scss'
import BoldAdd from '../../../../assets/icons/ui-16px-1_bold-add.svg'


class NewProjectCard extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick(this)
  }

  onClick() {
    this.props.setInfiniteAutoload(false)
  }

  render() {
    return (
      <Link to="/new-project" className="ProjectCard NewProjectCard" onClick={this.onClick}>
        <div className="card-header" />
        <div className="card-body">
          <div className="new-project-button">
            <div className="new-project-icon"><BoldAdd className="icon-bold-add"/></div>
            <div>New Project</div>
          </div>
        </div>
        <div className="card-footer" />
      </Link>
    )
  }
}

NewProjectCard.propTypes = {
  setInfiniteAutoload: PT.func.isRequired
}

export default NewProjectCard