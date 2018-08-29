import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import _ from 'lodash'
import LinksMenu from '../../../components/LinksMenu/LinksMenu'
import TeamManagementContainer from './TeamManagementContainer'
import { updateProject, deleteProject } from '../../actions/project'
import { setDuration } from '../../../helpers/projectHelper'
import { PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER,
  DIRECT_PROJECT_URL, SALESFORCE_PROJECT_LEAD_LINK, PROJECT_STATUS_CANCELLED, PROJECT_FEED_TYPE_PRIMARY } from '../../../config/constants'
import ProjectInfo from '../../../components/ProjectInfo/ProjectInfo'

class ProjectInfoContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      duration: {}
    }
    this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onDeleteProject = this.onDeleteProject.bind(this)
    this.onAddNewLink = this.onAddNewLink.bind(this)
    this.onDeleteLink = this.onDeleteLink.bind(this)
    this.onEditLink = this.onEditLink.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return !_.isEqual(nextProps.project, this.props.project) ||
      !_.isEqual(nextProps.feeds, this.props.feeds) ||
      !_.isEqual(nextProps.phases, this.props.phases) ||
      !_.isEqual(nextProps.productsTimelines, this.props.productsTimelines) ||
      nextProps.activeChannelId !== this.props.activeChannelId
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

  onEditLink(idx, title, address) {
    const { updateProject, project } = this.props
    const updatedLink = {
      title,
      address
    }
    updateProject(project.id, {
      bookmarks: update(project.bookmarks, { $splice: [[idx, 1, updatedLink]] })
    })
  }

  onDeleteProject() {
    const { deleteProject, project } = this.props
    deleteProject(project.id)
  }

  render() {
    const { duration } = this.state
    const { project, currentMemberRole, isSuperUser, phases, feeds,
      hideInfo, hideLinks, hideMembers, onChannelClick, activeChannelId, productsTimelines } = this.props
    let directLinks = null
    // check if direct links need to be added
    const isMemberOrCopilot = _.indexOf([PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER], currentMemberRole) > -1
    if (isMemberOrCopilot || isSuperUser) {
      directLinks = []
      if (project.directProjectId) {
        directLinks.push({name: 'Project in Topcoder Direct', href: `${DIRECT_PROJECT_URL}${project.directProjectId}`})
      } else {
        directLinks.push({name: 'Direct project not linked. Contact support.', href: 'mailto:support@topcoder.com'})
      }
      directLinks.push({name: 'Salesforce Lead', href: `${SALESFORCE_PROJECT_LEAD_LINK}${project.id}`})
    }

    const canDeleteProject = currentMemberRole === PROJECT_ROLE_OWNER && project.status === 'draft'
    const canManageLinks = !!currentMemberRole || isSuperUser

    let devices = []
    const primaryTarget = _.get(project, 'details.appDefinition.primaryTarget')
    if (primaryTarget && !primaryTarget.seeAttached) {
      devices.push(primaryTarget.value)
    } else {
      devices = _.get(project, 'details.devices', [])
    }

    let attachments = project.attachments
    // merges the product attachments to show in the links menu
    if (phases && phases.length > 0) {
      phases.forEach(phase => {
        if (phase.products && phase.products.length > 0) {
          phase.products.forEach(product => {
            if (product.attachments && product.attachments.length > 0) {
              attachments = attachments.concat(product.attachments)
            }
          })
        }
      })
    }
    attachments = _.sortBy(attachments, attachment => -new Date(attachment.updatedAt).getTime())
      .map(attachment => ({
        title: attachment.title,
        address: attachment.downloadUrl,
      }))

    const discussions = feeds.map((feed) => ({
      title: `${feed.title}`,
      address: feed.tag === PROJECT_FEED_TYPE_PRIMARY ? `/projects/${project.id}#feed-${feed.id}` : `/projects/${project.id}/plan#phase-${feed.phaseId}`,
      noNewPage: true,
      onClick: onChannelClick ? () => onChannelClick(feed) : null,
      isActive: feed.id === activeChannelId,
    }))

    return (
      <div>
        <div className="sideAreaWrapper">
          {!hideInfo &&
            <ProjectInfo
              project={project}
              phases={phases}
              currentMemberRole={currentMemberRole}
              duration={duration}
              canDeleteProject={canDeleteProject}
              onDeleteProject={this.onDeleteProject}
              onChangeStatus={this.onChangeStatus}
              directLinks={directLinks}
              isSuperUser={isSuperUser}
              productsTimelines = {productsTimelines}
            />
          }
          <LinksMenu
            links={discussions}
            title="Discussions"
            moreText="view all"
            noDots
            withHash
          />
          <LinksMenu
            links={attachments}
            title="Latest files"
            moreText="view all files"
            noDots
          />
          {!hideLinks &&
            <LinksMenu
              links={project.bookmarks || []}
              canDelete={canManageLinks}
              canEdit={canManageLinks}
              canAdd={canManageLinks}
              onAddNewLink={this.onAddNewLink}
              onDelete={this.onDeleteLink}
              onEdit={this.onEditLink}
            />
          }
          {!hideMembers &&
            <TeamManagementContainer projectId={project.id} members={project.members} />
          }
        </div>
      </div>
    )
  }
}

ProjectInfoContainer.PropTypes = {
  currentMemberRole: PropTypes.string,
  phases: PropTypes.array,
  project: PropTypes.object.isRequired,
  isSuperUser: PropTypes.bool,
  productsTimelines : PropTypes.object.isRequired,
}

const mapDispatchToProps = { updateProject, deleteProject }

export default connect(null, mapDispatchToProps)(ProjectInfoContainer)
