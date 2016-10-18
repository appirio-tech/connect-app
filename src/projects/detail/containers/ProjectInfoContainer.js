import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import _ from 'lodash'
import ProjectInfo from '../../../components/ProjectInfo/ProjectInfo'
import LinksMenu from '../../../components/LinksMenu/LinksMenu'
import FooterV2 from '../../../components/FooterV2/FooterV2'
import TeamManagementContainer from './TeamManagementContainer'
import { updateProject, deleteProject } from '../../actions/project'
import { PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER,
   DIRECT_PROJECT_URL, SALESFORCE_PROJECT_LEAD_LINK } from '../../../config/constants'

class ProjectInfoContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      duration: {},
      budget: { // FIXME
        percent: 80,
        text: '$1000 remaining'
      }
    }
    this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onDeleteProject = this.onDeleteProject.bind(this)
    this.onAddNewLink = this.onAddNewLink.bind(this)
    this.onDeleteLink = this.onDeleteLink.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return !_.isEqual(nextProps.project, this.props.project)
  }

  setDuration({duration, status}) {
    let percent =''
    let title = ''
    let text = ''
    let type = 'completed' // default
    if (duration) {
      const {actualDuration, plannedDuration} = duration
      if (status === 'draft') {
        title = 'Duration'
        percent = 0
        text = 'Complete specification to get estimate'
      } else if (status === 'in_review') {
        title = 'Duration'
        percent = 0
        text = 'Pending review'
      } else if (status === 'reviewed') {
        title = `${plannedDuration} days (projected)`
        percent = 0
        text = `${plannedDuration} days remaining`
      } else if (status === 'completed') {
        title = 'Completed'
        percent = 100
        text = ''
        type = 'completed'
      } else {
        text = `Day ${actualDuration} of ${plannedDuration}`
        percent = actualDuration / plannedDuration * 100
        if (0 <= percent && percent < 100) {
          const diff = plannedDuration - actualDuration
          title = `${diff} ${diff > 1 ? 'days' : 'day'} remaining`
          type = 'working'
        } else {
          percent = 100
          type = 'error'
          const diff = actualDuration - plannedDuration
          title = `${diff} ${diff > 1 ? 'days' : 'day'} over`
        }
      }
    } else {
      title = 'Duration'
      percent = 0
      text = 'Complete specification to get estimate'
    }
    this.setState({duration: { title, text, percent, type }})
  }

  componentWillMount() {
    this.setDuration(this.props.project)
  }

  componentWillReceiveProps({project}) {
    this.setDuration(project)
  }

  onChangeStatus(status) {
    this.props.updateProject(this.props.project.id, {status})
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

  onDeleteProject() {
    const { deleteProject, project } = this.props
    deleteProject(project.id)
  }

  render() {
    const {duration, budget } = this.state
    const { project, currentMemberRole } = this.props

    let directLinks = null
    // check if direct links need to be added
    const isMemberOrCopilot = _.indexOf([PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER], currentMemberRole) > -1
    if (isMemberOrCopilot) {
      directLinks = []
      if (project.directProjectId) {
        directLinks.push({name: 'Project in Topcoder Direct', href: `${DIRECT_PROJECT_URL}${project.directProjectId}`})
      }
      directLinks.push({name: 'Salesforce Lead', href: `${SALESFORCE_PROJECT_LEAD_LINK}${project.id}`})
    }

    const canDeleteProject = currentMemberRole === PROJECT_ROLE_OWNER
      && project.status === 'draft'
    return (
      <div>
        <ProjectInfo
          projectId={project.id}
          canDeleteProject={canDeleteProject}
          onDeleteProject={this.onDeleteProject}
          directLinks={directLinks}
          currentMemberRole={currentMemberRole}
          description={project.description}
          type={project.type}
          devices={project.details.devices || []}
          status={project.status} onChangeStatus={this.onChangeStatus}
          duration={duration}
          budget={budget}
        />
        <LinksMenu
          links={project.bookmarks || []}
          canDelete={!!currentMemberRole}
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
  currentMemberRole: PropTypes.string,
  project: PropTypes.object.isRequired
}

const mapDispatchToProps = { updateProject, deleteProject }

export default connect(null, mapDispatchToProps)(ProjectInfoContainer)
