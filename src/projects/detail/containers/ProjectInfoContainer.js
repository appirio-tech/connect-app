import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import update from 'react-addons-update'
import _ from 'lodash'
import TeamManagementContainer from './TeamManagementContainer'
import { updateProject, deleteProject } from '../../actions/project'
import { loadDashboardFeeds, loadProjectMessages } from '../../actions/projectTopics'
import { loadPhaseFeed } from '../../actions/phasesTopics'
import { loadProjectPlan } from '../../actions/projectPlan'
import { setDuration, getProjectNavLinks } from '../../../helpers/projectHelper'
import { PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER,
  DIRECT_PROJECT_URL, SALESFORCE_PROJECT_LEAD_LINK, PROJECT_STATUS_CANCELLED,  PROJECT_STATUS_ACTIVE,
  PROJECT_STATUS_COMPLETED, PHASE_STATUS_REVIEWED, PHASE_STATUS_ACTIVE } from '../../../config/constants'
import PERMISSIONS from '../../../config/permissions'
import { checkPermission } from '../../../helpers/permissions'
import Panel from '../../../components/Panel/Panel'
import ProjectInfo from '../../../components/ProjectInfo/ProjectInfo'
import ProjectDirectLinks from '../../../projects/list/components/Projects/ProjectDirectLinks'
import ProjectStatus from '../../../components/ProjectStatus/ProjectStatus'
import {
  updateProjectAttachment, uploadProjectAttachments,
  removeProjectAttachment
} from '../../actions/projectAttachment'
import { saveFeedComment } from '../../actions/projectTopics'

import TailLeft from '../../../assets/icons/arrows-16px-1_tail-left.svg'

import './ProjectInfoContainer.scss'
import MenuList from '../../../components/MenuList/MenuList'
import editableProjectStatus from '../../../components/ProjectStatus/editableProjectStatus'
import {
  filterNotificationsByProjectId,
  filterReadNotifications,
  filterPostsMentionNotifications,
} from '../../../routes/notifications/helpers/notifications'

const EnhancedProjectStatus = editableProjectStatus(ProjectStatus)

class ProjectInfoContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      duration: {},
      showDeleteConfirm: false
    }
    this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onDeleteProject = this.onDeleteProject.bind(this)
    this.onAddNewLink = this.onAddNewLink.bind(this)
    this.onDeleteLink = this.onDeleteLink.bind(this)
    this.onEditLink = this.onEditLink.bind(this)
    this.onEditAttachment = this.onEditAttachment.bind(this)
    this.onAddFile = this.onAddFile.bind(this)
    this.onUploadAttachment = this.onUploadAttachment.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.onSubmitForReview = this.onSubmitForReview.bind(this)
    this.extractLinksFromPosts = this.extractLinksFromPosts.bind(this)
    this.extractMarkdownLink = this.extractMarkdownLink.bind(this)
    this.extractHtmlLink = this.extractHtmlLink.bind(this)
    this.extractRawLink = this.extractRawLink.bind(this)
    this.getFileAttachmentName = this.getFileAttachmentName.bind(this)
    this.extractAttachmentLinksFromPosts = this.extractAttachmentLinksFromPosts.bind(this)
    this.deletePostAttachment = this.deletePostAttachment.bind(this)
    this.toggleProjectDelete = this.toggleProjectDelete.bind(this)
    this.onConfirmDelete = this.onConfirmDelete.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return !_.isEqual(nextProps.project, this.props.project) ||
      !_.isEqual(nextProps.feeds, this.props.feeds) ||
      !_.isEqual(nextProps.phases, this.props.phases) ||
      !_.isEqual(nextProps.productsTimelines, this.props.productsTimelines) ||
      !_.isEqual(nextProps.phasesTopics, this.props.phasesTopics) ||
      !_.isEqual(nextProps.isFeedsLoading, this.props.isFeedsLoading) ||
      !_.isEqual(nextProps.isProjectProcessing, this.props.isProjectProcessing) ||
      !_.isEqual(nextProps.attachmentsAwaitingPermission, this.props.attachmentsAwaitingPermission) ||
      !_.isEqual(nextProps.attachmentPermissions, this.props.attachmentPermissions) ||
      !_.isEqual(nextProps.notifications, this.props.notifications) ||
      !_.isEqual(nextState.showDeleteConfirm, this.state.showDeleteConfirm) ||
      nextProps.activeChannelId !== this.props.activeChannelId
  }

  setDuration({duration, status}) {

    this.setState({duration: setDuration(duration || {}, status)})
  }

  componentWillMount() {
    const { project, isFeedsLoading, feeds, phases, phasesTopics, loadPhaseFeed, location } = this.props

    this.setDuration(project)

    // load feeds from dashboard if they are not currently loading or loaded yet
    // also it will load feeds, if we already loaded them, but it was 0 feeds before
    if (!isFeedsLoading && feeds.length < 1) {
      this.loadAllFeeds()
    }

    // load phases feeds if they are not loaded yet
    // note: old projects doesn't have phases, so we check if there are any phases at all first
    phases && phasesTopics && phases.forEach((phase) => {
      if (!phasesTopics[phase.id]) {
        loadPhaseFeed(project.id, phase.id)
      }
    })

    // handle url hash
    if (!_.isEmpty(location.hash)) {
      this.handleUrlHash(this.props)
    }
  }

  componentWillReceiveProps(props) {
    const { project, location } = props

    this.setDuration(project)

    if (!_.isEmpty(location.hash) && location.hash !== this.props.location.hash) {
      this.handleUrlHash(props)
    }
  }

  toggleProjectDelete() {
    this.setState({ showDeleteConfirm: !this.state.showDeleteConfirm })
  }

  onConfirmDelete() {
    this.onDeleteProject()
  }

  // this is just to see if the comment/feed/post/phase the url hash is attempting to scroll to is loaded or not
  // if its not loaded then we load the appropriate item
  handleUrlHash(props) {
    const { project, isFeedsLoading, phases, phasesTopics, feeds, loadProjectPlan, loadPhaseFeed, location } = props
    const hashParts = _.split(location.hash.substring(1), '-')
    const hashPrimaryId = parseInt(hashParts[1], 10)

    switch (hashParts[0]) {
    case 'comment': {
      if (!isFeedsLoading && !this.foundCommentInFeeds(feeds, hashPrimaryId)) {
        this.loadAllFeeds()
      }
      break
    }

    case 'feed': {
      if (!isFeedsLoading && !_.some(feeds, { id: hashPrimaryId})) {
        this.loadAllFeeds()
      }
      break
    }

    case 'phase': {
      const postId = parseInt(hashParts[3], 10)

      if (phases && phasesTopics) {
        if (!_.some(phases, { id: hashPrimaryId})) {
          let existingUserIds = _.map(project.members, 'userId')
          existingUserIds= _.union(existingUserIds, _.map(project.invites, 'userId'))
          loadProjectPlan(project.id, existingUserIds)
        } else if(postId && !(phasesTopics[hashPrimaryId].topic && phasesTopics[hashPrimaryId].topic.postIds.includes(postId))) {
          loadPhaseFeed(project.id, hashPrimaryId)
        }
      }
      break
    }
    }
  }

  loadAllFeeds() {
    const { canAccessPrivatePosts, loadDashboardFeeds, loadProjectMessages, project } = this.props

    loadDashboardFeeds(project.id)
    canAccessPrivatePosts && loadProjectMessages(project.id)
  }

  foundCommentInFeeds(feeds, commentId) {
    let commentFound = false

    _.forEach(feeds, feed => _.forEach(feed.posts, post => {
      if (post.id === commentId) {
        commentFound = true
        return false
      }
    }))

    return commentFound
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

  onEditAttachment(attachmentId, title, allowedUsers) {
    const { project, updateProjectAttachment } = this.props
    const updatedAttachment = {
      title,
      allowedUsers
    }
    const attachment = project.attachments.find(attachment => attachment.id === attachmentId)
    if (attachment) {
      updateProjectAttachment(project.id,
        attachment.id,
        updatedAttachment
      )
    }
  }

  removeAttachment(attachmentId) {
    const { project } = this.props
    this.props.removeProjectAttachment(project.id, attachmentId)
  }

  onDeleteProject() {
    const { deleteProject, project } = this.props
    deleteProject(project.id)
  }

  onAddFile() {
  }

  onUploadAttachment(attachment) {
    const { project } = this.props
    this.props.uploadProjectAttachments(project.id, attachment)
  }

  onSubmitForReview() {
    const { updateProject, project } = this.props
    updateProject(project.id, { status: 'in_review'})
  }

  extractHtmlLink(str) {
    const links = []
    const regex = /<a[^>]+href="(.*?)"[^>]*>([\s\S]*?)<\/a>/gm
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm // eslint-disable-line no-useless-escape
    const rawLinks = regex.exec(str)

    if (Array.isArray(rawLinks)) {
      let i = 0
      while (i < rawLinks.length) {
        const title = rawLinks[i + 2]
        const address = rawLinks[i + 1]

        if (urlRegex.test(address)) {
          links.push({
            title,
            address
          })
        }

        i = i + 3
      }
    }

    return links
  }

  extractMarkdownLink(str) {
    const links = []
    const regex = /(?:__|[*#])|\[(.*?)\]\((.*?)\)/gm
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm // eslint-disable-line no-useless-escape
    const rawLinks = regex.exec(str)

    if (Array.isArray(rawLinks)) {
      let i = 0
      while (i < rawLinks.length) {
        const title = rawLinks[i + 1]
        const address = rawLinks[i + 2]

        if (urlRegex.test(address)) {
          links.push({
            title,
            address
          })
        }

        i = i + 3
      }
    }

    return links
  }

  extractRawLink(str) {
    let links = []
    const regex = /(\s|^)(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}[\s])(\s|$)/igm // eslint-disable-line no-useless-escape
    const rawLinks = str.match(regex)

    if (Array.isArray(rawLinks)) {
      links = rawLinks
        .filter(link => !link.includes(']'))
        .map(link => {
          const name = link.trim()
          const url = !/^https?:\/\//i.test(name) ? 'http://' + name : name

          return {
            title: name,
            address: url
          }
        })
    }

    return links
  }

  extractLinksFromPosts(feeds) {
    const links = []
    feeds.forEach(feed => {
      let childrenLinks = []
      feed.posts.forEach(post => {
        childrenLinks = childrenLinks.concat([
          ...this.extractHtmlLink(post.rawContent),
          ...this.extractMarkdownLink(post.rawContent),
          ...this.extractRawLink(post.rawContent)
        ])
      })

      if (childrenLinks.length > 0) {
        links.push({
          title: feed.title,
          children: childrenLinks
        })
      }
    })

    return links
  }

  getFileAttachmentName(originalFileName) {
    return /^.*.\/[^_]+_(.*.)$/.exec(originalFileName)[1]
  }

  extractAttachmentLinksFromPosts(feeds) {
    const attachmentLinks = []
    feeds.forEach(feed => {
      const attachmentLinksPerFeed = []
      feed.posts.forEach(post => {
        post.attachments.forEach(attachment => {
          attachmentLinksPerFeed.unshift({
            title: this.getFileAttachmentName(attachment.originalFileName),
            address: `/projects/messages/attachments/${attachment.id}`,
            attachmentId: attachment.id,
            attachment: true,
            deletable: true,
            createdBy: attachment.createdBy,
            postId: post.id,
            topicId: feed.id,
            topicTag: feed.tag
          })
        })
      })

      if (attachmentLinksPerFeed.length > 0) {
        attachmentLinks.push({
          title: feed.title,
          children: attachmentLinksPerFeed
        })
      }
    })

    return attachmentLinks
  }

  deletePostAttachment({ topicId, postId, attachmentId, topicTag }) {
    const { feeds, phasesTopics, saveFeedComment } = this.props

    let feed
    if (topicTag === 'PRIMARY') {
      feed = feeds.find(feed => feed.id === topicId)
    } else {
      const phaseFeeds = Object.keys(phasesTopics)
        .map(key => phasesTopics[key].topic)
      feed = phaseFeeds.find(feed => feed.id && feed.id === topicId)
    }
    if (feed) {
      const post = feed.posts.find(post => post.id === postId)
      if (post) {
        const attachments = post.attachments
          .filter(attachment => attachment.id !== attachmentId)
        const attachmentIds = attachments.map(attachment => attachment.id)
        saveFeedComment(topicId, feed.tag, {
          id: postId,
          content: post.rawContent,
          attachmentIds
        })
      }
    }
  }

  render() {
    const { duration, showDeleteConfirm } = this.state
    const { project, currentMemberRole, isSuperUser, phases, hideInfo, hideMembers,
      productsTimelines, isProjectProcessing, notifications } = this.props
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

    const projectNotReadNotifications = filterReadNotifications(filterNotificationsByProjectId(notifications, project.id))
    const notReadMessageNotifications = filterPostsMentionNotifications(projectNotReadNotifications)

    const navLinks = getProjectNavLinks(project, project.id).map((navLink) => {
      if (navLink.label === 'Messages') {
        navLink.count = notReadMessageNotifications.length
      }

      return navLink
    })

    const canEdit = (
      project.status !== PROJECT_STATUS_COMPLETED && (isSuperUser || (currentMemberRole
      && (_.indexOf([PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER], currentMemberRole) > -1)))
    )

    const progress = _.get(process, 'percent', 0)

    const hasReviewedOrActivePhases = !!_.find(phases, (phase) => _.includes([PHASE_STATUS_REVIEWED, PHASE_STATUS_ACTIVE], phase.status))
    const isProjectActive = project.status === PROJECT_STATUS_ACTIVE
    const isV3Project = project.version === 'v3'
    const projectCanBeActive =  !isV3Project || (!isProjectActive && hasReviewedOrActivePhases) || isProjectActive

    return (
      <div>
        <div className="sideAreaWrapper">
          <div styleName="all-project-link-wrapper">
            <Link to="/projects">
              <div styleName="breadcrumb">
                <TailLeft styleName="icon-tail-left" />
                <span>ALL PROJECTS</span>
              </div>
            </Link>
            {canDeleteProject && !showDeleteConfirm &&
            <div className="project-delete-icon">
              <Panel.DeleteBtn onClick={this.toggleProjectDelete} />
            </div>}
          </div>

          {/* Separator above project description */}
          {!hideInfo && <hr styleName="separator" />}
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
              onSubmitForReview={this.onSubmitForReview}
              isProjectProcessing={isProjectProcessing}
              toggleProjectDelete={this.toggleProjectDelete}
              onConfirmDelete={this.onConfirmDelete}
              showDeleteConfirm={showDeleteConfirm}
            />
          }

          {/* Separator above menulist */}
          <hr styleName="separator" />
          <div styleName="menulist-container">
            <MenuList navLinks={navLinks} />
          </div>

          {/* Separator above administration section */}
          {!hideInfo && <hr styleName="separator separator-margin-bottom"/>}
          {!hideInfo &&
          <div styleName="administration-section">
            <div styleName="administration-title">
              ADMINISTRATION
            </div>
            <ProjectDirectLinks
              directLinks={directLinks}
            />
          </div>}

          {!hideInfo && <div styleName="project-status-toggle">
            {(project.status !== PROJECT_STATUS_ACTIVE || progress === 0) &&
              <EnhancedProjectStatus
                status={project.status}
                projectCanBeActive={projectCanBeActive}
                showText
                withoutLabel
                currentMemberRole={currentMemberRole}
                canEdit={canEdit}
                unifiedHeader={false}
                onChangeStatus={this.onChangeStatus}
                projectId={project.id}
              />
            }
          </div>}

          {/* Separator above project and topcoder team section */}
          {!hideInfo && <hr styleName="separator separator-margin-top"/>}
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
  feeds: PropTypes.array,
  phasesTopics: PropTypes.array,
  project: PropTypes.object.isRequired,
  isSuperUser: PropTypes.bool,
  isManageUser: PropTypes.bool,
  productsTimelines : PropTypes.object.isRequired,
  isProjectPlan: PropTypes.bool,
  isProjectProcessing: PropTypes.bool,
  canAccessPrivatePosts: PropTypes.bool.isRequired,
}

const mapStateToProps = ({ templates, notifications }) => {
  const canAccessPrivatePosts = checkPermission(PERMISSIONS.ACCESS_PRIVATE_POST)
  return ({
    projectTemplates : templates.projectTemplates,
    canAccessPrivatePosts,
    notifications: notifications.notifications,
  })
}

const mapDispatchToProps = { updateProject, deleteProject, updateProjectAttachment,
  loadProjectMessages, uploadProjectAttachments, loadDashboardFeeds, loadPhaseFeed,
  removeProjectAttachment, loadProjectPlan, saveFeedComment }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectInfoContainer))
