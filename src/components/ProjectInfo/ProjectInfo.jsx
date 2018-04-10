import React, { Component } from 'react'
import PT from 'prop-types'
import Panel from '../Panel/Panel'
import DeleteProjectModal from './DeleteProjectModal'
import ProjectCardHeader from '../../projects/list/components/Projects/ProjectCardHeader'
import ProjectCardBody from '../../projects/list/components/Projects/ProjectCardBody'
import ProjectDirectLinks from '../../projects/list/components/Projects/ProjectDirectLinks'
import MobileExpandable from '../MobileExpandable/MobileExpandable'
import MediaQuery from 'react-responsive'

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
    const { project, currentMemberRole, duration, canDeleteProject, onChangeStatus, directLinks, isSuperUser } = this.props
    const { showDeleteConfirm } = this.state
    return (
      <div className="project-info">
        <div className="project-info-header">
          <ProjectCardHeader
            project={project}
          />
          {canDeleteProject && !showDeleteConfirm &&
            <div className="project-delete-icon">
              <Panel.DeleteBtn onClick={this.toggleProjectDelete} />
            </div>
          }
        </div>
        <MobileExpandable title="DESCRIPTION" defaultOpen>
          <Panel>
            {showDeleteConfirm &&
              <DeleteProjectModal
                onCancel={this.toggleProjectDelete}
                onConfirm={this.onConfirmDelete}
              />
            }
          </Panel>
          <MediaQuery minWidth={768}>
            {(matches) => (
              <ProjectCardBody
                project={project}
                currentMemberRole={currentMemberRole}
                duration={duration}
                descLinesCount={matches ? 4 : Infinity}
                onChangeStatus={onChangeStatus}
                isSuperUser={isSuperUser}
                showLink
              />
            )}
          </MediaQuery>
          <ProjectDirectLinks
            directLinks={directLinks}
          />
        </MobileExpandable>
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
