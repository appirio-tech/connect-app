import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import _ from 'lodash'
import LinksMenu from '../../../components/LinksMenu/LinksMenu'
import FooterV2 from '../../../components/FooterV2/FooterV2'
import TeamManagementContainer from './TeamManagementContainer'
import { updateProject, deleteProject } from '../../actions/project'
import { setDuration } from '../../../helpers/projectHelper'
import { PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER,
  DIRECT_PROJECT_URL, SALESFORCE_PROJECT_LEAD_LINK, PROJECT_STATUS_CANCELLED } from '../../../config/constants'
import ProjectInfo from '../../../components/ProjectInfo/ProjectInfo'

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

    this.setState({duration: setDuration(duration || {}, status)})
  }

  componentWillMount() {
    this.setDuration(this.props.project)
  }

  componentWillReceiveProps({project}) {
    this.setDuration(project)
  }

  onChangeStatus(projectId, status, reason) {
    const delta = {status}
    if (reason && status === PROJECT_STATUS_CANCELLED) {
      delta.cancelReason = reason
    }
    this.props.updateProject(projectId, delta)
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
    const { duration } = this.state
    const { project, currentMemberRole, isSuperUser } = this.props
    let directLinks = null
    // check if direct links need to be added
    const isMemberOrCopilot = _.indexOf([PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER], currentMemberRole) > -1
    if (isMemberOrCopilot) {
      directLinks = []
      if (project.directProjectId) {
        directLinks.push({name: 'Project in Topcoder Direct', href: `${DIRECT_PROJECT_URL}${project.directProjectId}`})
      } else {
        directLinks.push({name: 'Direct project not linked. Contact support.', href: 'mailto:support@topcoder.com'})
      }
      directLinks.push({name: 'Salesforce Lead', href: `${SALESFORCE_PROJECT_LEAD_LINK}${project.id}`})
    }

    const canDeleteProject = currentMemberRole === PROJECT_ROLE_OWNER && project.status === 'draft'

    let devices = []
    const primaryTarget = _.get(project, 'details.appDefinition.primaryTarget')
    if (primaryTarget && !primaryTarget.seeAttached) {
      devices.push(primaryTarget.value)
    } else {
      devices = _.get(project, 'details.devices', [])
    }
    return (
      <div>
        <div className="sideAreaWrapper">
          <ProjectInfo
            project={project}
            currentMemberRole={currentMemberRole}
            duration={duration}
            canDeleteProject={canDeleteProject}
            onDeleteProject={this.onDeleteProject}
            onChangeStatus={this.onChangeStatus}
            directLinks={directLinks}
            isSuperUser={isSuperUser}
          />
          <LinksMenu
            links={project.bookmarks || []}
            canDelete={!!currentMemberRole}
            onAddNewLink={this.onAddNewLink}
            onDelete={this.onDeleteLink}
          />
          <TeamManagementContainer projectId={project.id} members={project.members} />
        </div>
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
