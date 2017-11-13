import React, { PropTypes as PT, Component } from 'react'
import Panel from '../Panel/Panel'
import DeleteProjectModal from './DeleteProjectModal'
import ProjectCardHeader from '../../projects/list/components/Projects/ProjectCardHeader'
import ProjectCardBody from '../../projects/list/components/Projects/ProjectCardBody'

import './ProjectInfo.scss'

class ProjectInfo extends Component {

  constructor(props) {
    super(props)
    this.toggleProjectDelete = this.toggleProjectDelete.bind(this)
    this.onConfirmDelete = this.onConfirmDelete.bind(this)
  }

  componentWillMount() {
    this.setState({ showDeleteConfirm: false })
  }

  toggleProjectDelete() {
    this.setState({ showDeleteConfirm: !this.state.showDeleteConfirm })
  }

  onConfirmDelete() {
    this.props.onDeleteProject()
  }

  render() {
    const { project, currentMemberRole, duration, canDeleteProject } = this.props
    const { showDeleteConfirm } = this.state
    return (
      <div className="project-info">
        <div className="project-info-header">
          <ProjectCardHeader
            project={project}
          />
          <Panel className="project-delete-icon">
            {canDeleteProject && !showDeleteConfirm &&
              <Panel.DeleteBtn onClick={this.toggleProjectDelete} />
            }
            {showDeleteConfirm &&
              <DeleteProjectModal
                onCancel={this.toggleProjectDelete}
                onConfirm={this.onConfirmDelete}
              />
            }
          </Panel>
        </div>
        <ProjectCardBody
          project={project}
          currentMemberRole={currentMemberRole}
          duration={duration}
          descLinesCount={4}
        />
      </div>
    )
  }
}

ProjectInfo.propTypes = {
  project: PT.object.isRequired,
  currentMemberRole: PT.string,
  duration: PT.object.isRequired
}

export default ProjectInfo
