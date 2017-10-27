import React, {PropTypes, Component} from 'react'
import Panel from '../Panel/Panel'
import ProjectType from '../ProjectType/ProjectType'
import ProjectStatusSection from '../ProjectStatusSection/ProjectStatusSection'
import ProjectProgress from '../ProjectProgress/ProjectProgress'
import DeleteProjectModal from './DeleteProjectModal'

require('./ProjectInfo.scss')

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
    const { projectId, description, type, directLinks, devices, currentMemberRole, status, onChangeStatus, duration,
      canDeleteProject } = this.props
    const { showDeleteConfirm } = this.state
    const displayProgress = status !== 'cancelled'
    return (
      <Panel>
        <Panel.Title>Project</Panel.Title>
        { canDeleteProject && !showDeleteConfirm &&
          <Panel.DeleteBtn onClick={this.toggleProjectDelete} />
        }
        { showDeleteConfirm &&
          <DeleteProjectModal
            onCancel={this.toggleProjectDelete}
            onConfirm={this.onConfirmDelete}
          />
        }
        <ProjectType projectId={projectId} type={type} devices={devices} description={ description } />
        <ProjectStatus directLinks={directLinks} currentMemberRole={currentMemberRole} status={status} onChangeStatus={onChangeStatus} />
        {displayProgress && <ProjectProgress {...duration}>
          {duration.text}
        </ProjectProgress>}
        {/* <ProjectProgress title="Budget" percent={budget.percent} type="working">
          {budget.text}
        </ProjectProgress> */}
      </Panel>
    )
  }
}

ProjectInfo.propTypes = {
  currentMemberRole: PropTypes.string,
  type: PropTypes.string.isRequired,
  devices: PropTypes.array.isRequired,
  directLinks: PropTypes.array,
  status: PropTypes.string.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  duration: PropTypes.object.isRequired,
  budget: PropTypes.object.isRequired
}

export default ProjectInfo
