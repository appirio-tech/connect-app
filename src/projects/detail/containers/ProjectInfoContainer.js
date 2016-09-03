import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import ProjectInfo from '../../../components/ProjectInfo/ProjectInfo'
import LinksMenu from '../../../components/LinksMenu/LinksMenu'
import FooterV2 from '../../../components/FooterV2/FooterV2'
import TeamManagementContainer from './TeamManagementContainer'
import { updateProject } from '../../actions/project'

class ProjectInfoContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      duration: {
        percent: 0,
        text: 'Complete specification to get estimate'
      },
      budget: {
        percent: 80,
        text: '$1000 remaining'
      }
    }
    this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onAddNewLink = this.onAddNewLink.bind(this)
    this.onDeleteLink = this.onDeleteLink.bind(this)
  }

  onChangeStatus(status) {
    this.props.updateProject({status})
  }

  onAddNewLink(link) {
    const { updateProject, project } = this.props
    updateProject(project.id, {
      bookmarks: update(project.bookmarks || [], { $push: [link] })
    })
  }

  onDeleteLink(idx) {
    const { updateProject, project } = this.props
    updateProject(project.id, {
      bookmarks: update(project.bookmarks, { $splice: [[idx, 1]] })
    })
  }

  render() {
    const {duration, budget } = this.state
    const { project, isCurrentUserMember } = this.props
    return (
      <div>
        <ProjectInfo
          isEdittable={isCurrentUserMember}
          type={project.type}
          devices={project.details.devices}
          status={project.status} onChangeStatus={this.onChangeStatus}
          duration={duration}
          budget={budget}
        />
        <LinksMenu
          links={project.bookmarks || []}
          canDelete={isCurrentUserMember}
          onAddNewLink={this.onAddNewLink}
          onDelete={this.onDeleteLink}
        />
      <TeamManagementContainer projectId={project.id} members={project.members}/>
        <FooterV2 />
      </div>
    )
  }
}

ProjectInfoContainer.PropTypes = {
  isCurrentUserMember: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired
}

const mapDispatchToProps = { updateProject }

export default connect(null, mapDispatchToProps)(ProjectInfoContainer)
