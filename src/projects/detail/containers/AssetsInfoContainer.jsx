import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import update from 'react-addons-update'
import _ from 'lodash'
import * as filepicker from 'filestack-js'
import moment from 'moment'
import LinksGridView from '../../../components/AssetsLibrary/LinksGridView'
import FilesGridView from '../../../components/AssetsLibrary/FilesGridView'
import AssetsStatistics from '../../../components/AssetsLibrary/AssetsStatistics'
import { updateProject, deleteProject } from '../../actions/project'
import { loadDashboardFeeds, loadProjectMessages } from '../../actions/projectTopics'
import { loadTopic } from '../../../actions/topics'
import { loadProjectPlan } from '../../actions/projectPlan'
import { PROJECT_ATTACHMENTS_FOLDER,
  PHASE_STATUS_DRAFT,
  PROJECT_FEED_TYPE_MESSAGES,
  FILE_PICKER_API_KEY,
  FILE_PICKER_FROM_SOURCES,
  FILE_PICKER_CNAME,
  FILE_PICKER_SUBMISSION_CONTAINER_NAME } from '../../../config/constants'
import AddLink from '../../../components/AssetsLibrary/AddLink'
import PERMISSIONS from '../../../config/permissions'
import { checkPermission } from '../../../helpers/permissions'
import {extractAttachmentLinksFromPosts, extractLinksFromPosts} from '../../../helpers/posts'
import {
  addProjectAttachment, updateProjectAttachment, uploadProjectAttachments, discardAttachments, changeAttachmentPermission,
  removeProjectAttachment
} from '../../actions/projectAttachment'
import { saveFeedComment } from '../../actions/projectTopics'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'

import './AssetsInfoContainer.scss'

class AssetsInfoContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeAssetsType: null,
      ifModalOpen: false,
      isThisFolderAllowAddNew: true,
    }
    this.onAddNewLink = this.onAddNewLink.bind(this)
    this.onDeleteLink = this.onDeleteLink.bind(this)
    this.onEditLink = this.onEditLink.bind(this)
    this.onEditAttachment = this.onEditAttachment.bind(this)
    this.onAddFile = this.onAddFile.bind(this)
    this.onUploadAttachment = this.onUploadAttachment.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.deletePostAttachment = this.deletePostAttachment.bind(this)
    this.activeAssetsTypeChange = this.activeAssetsTypeChange.bind(this)
    this.onNewLinkModalChange = this.onNewLinkModalChange.bind(this)
    this.isThisFolderAllowAddNewChange = this.isThisFolderAllowAddNewChange.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return !_.isEqual(nextProps.project, this.props.project) ||
      !_.isEqual(nextProps.feeds, this.props.feeds) ||
      !_.isEqual(nextProps.phases, this.props.phases) ||
      !_.isEqual(nextProps.allTopics, this.props.allTopics) ||
      !_.isEqual(nextProps.isFeedsLoading, this.props.isFeedsLoading) ||
      !_.isEqual(nextProps.attachmentsAwaitingPermission, this.props.attachmentsAwaitingPermission) ||
      !_.isEqual(nextProps.attachmentPermissions, this.props.attachmentPermissions) ||
      !_.isEqual(nextProps.isSharingAttachment, this.props.isSharingAttachment) ||
      !_.isEqual(nextState.activeAssetsType, this.state.activeAssetsType) ||
      !_.isEqual(nextState.ifModalOpen, this.state.ifModalOpen) ||
      !_.isEqual(nextState.isThisFolderAllowAddNew, this.state.isThisFolderAllowAddNew)
  }

  componentWillMount() {
    const { project, isFeedsLoading, feeds, phases, allTopics, loadTopic, location, loadProjectPlan } = this.props

    // load feeds from dashboard if they are not currently loading or loaded yet
    // also it will load feeds, if we already loaded them, but it was 0 feeds before
    if (!isFeedsLoading && feeds.length < 1) {
      this.loadAllFeeds()
    }

    // load phases feeds if they are not loaded yet
    // note: old projects doesn't have phases, so we check if there are any phases at all first
    phases && allTopics && phases.forEach((phase) => {
      if (!allTopics[`phase#${phase.id}`]) {
        loadTopic(project.id, `phase#${phase.id}`)
      }
    })

    // handle url hash
    if (!_.isEmpty(location.hash)) {
      this.handleUrlHash(this.props)
    }

    if (!phases) {
      loadProjectPlan(project, true)
    }
  }

  componentWillReceiveProps(props) {
    const { location } = props

    if (!_.isEmpty(location.hash) && location.hash !== this.props.location.hash) {
      this.handleUrlHash(props)
    }
  }

  // this is just to see if the comment/feed/post/phase the url hash is attempting to scroll to is loaded or not
  // if its not loaded then we load the appropriate item
  handleUrlHash(props) {
    const { project, isFeedsLoading, phases, allTopics, feeds, loadTopic, location } = props
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

      if (phases && allTopics) {
        if (
          _.some(phases, { id: hashPrimaryId}) &&
          postId &&
          !(allTopics[hashPrimaryId].topic && allTopics[hashPrimaryId].topic.postIds.includes(postId))) {
          loadTopic(project.id, `phase#${hashPrimaryId}`)
        }
      }
      break
    }
    }
  }

  activeAssetsTypeChange(assetsType) {
    this.setState({activeAssetsType: assetsType, isThisFolderAllowAddNew: true})
  }

  /**
   * update isThisFolderAllowAddNew in state
   * @param {Object} folder folder object
   */
  isThisFolderAllowAddNewChange(folder) {

    let expectedAllowAddNew = true
    if (folder && folder.canAddNew === false) {
      expectedAllowAddNew = false
    }

    if (expectedAllowAddNew !== this.state.isThisFolderAllowAddNew) {
      this.setState({ isThisFolderAllowAddNew : expectedAllowAddNew })
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

  onAddFile() {
  }

  onNewLinkModalChange(status){
    this.setState({ifModalOpen: status})
  }

  onUploadAttachment(attachment) {
    const { project } = this.props
    this.props.uploadProjectAttachments(project.id, attachment)
  }

  deletePostAttachment({ topicId, postId, attachmentId, topicTag }) {
    const { feeds, allTopics, saveFeedComment } = this.props

    let feed
    if (topicTag === 'PRIMARY') {
      feed = feeds.find(feed => feed.id === topicId)
    } else {
      const phaseFeeds = Object.keys(allTopics)
        .map(key => allTopics[`phase#${key}`].topic)
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
    const { project, currentMemberRole, isSuperUser, phases, feeds,
      isManageUser, allTopics, projectTemplates, hideLinks,
      attachmentsAwaitingPermission, addProjectAttachment, discardAttachments, attachmentPermissions,
      changeAttachmentPermission, projectMembers, loggedInUser, isSharingAttachment, canAccessPrivatePosts,
      isFeedsLoading, workTopics } = this.props

    const isLoadingFilesAndLinks = isFeedsLoading || !phases || !workTopics
    const { ifModalOpen, isThisFolderAllowAddNew } = this.state

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
        id: attachment.id,
        title: attachment.title,
        address: attachment.downloadUrl,
        allowedUsers: attachment.allowedUsers,
        createdBy : attachment.createdBy,
        updatedAt: attachment.updatedAt,
      }))

    // get list of phase topic in same order as phases
    // note: for old projects which doesn't have phases we return an empty array
    const visiblePhases = phases && phases.filter((phase) => (
      isSuperUser || isManageUser || phase.status !== PHASE_STATUS_DRAFT
    )) || []

    const phaseFeeds = _.compact(
      visiblePhases.map((phase) => {
        const topic = _.get(allTopics, `[phase#${phase.id}].topic`)

        if (!topic) {
          return null
        }

        return ({
          ...topic,
          phaseId: phase.id,
          phaseName: phase.name,
        })
      })
    )

    const attachmentsStorePath = `${PROJECT_ATTACHMENTS_FOLDER}/${project.id}/`
    let enableFileUpload = true
    if(project.version !== 'v2') {
      const templateId = _.get(project, 'templateId')
      const projectTemplate = _.find(projectTemplates, template => template.id === templateId)
      enableFileUpload = _.some(projectTemplate.scope.sections, section => {
        return _.some(section.subSections, subSection => subSection.id === 'files')
      })
    }

    // extract links from posts
    const topicLinks = extractLinksFromPosts(feeds)
    const publicTopicLinks = topicLinks.filter(link => link.tag !== PROJECT_FEED_TYPE_MESSAGES)
    const privateTopicLinks = topicLinks.filter(link => link.tag === PROJECT_FEED_TYPE_MESSAGES)
    const phaseLinks = extractLinksFromPosts(phaseFeeds)
    const workLinks = extractLinksFromPosts(workTopics ? workTopics : [])

    let links = []
    links = links.concat(project.bookmarks)
    links = links.concat(publicTopicLinks)
    if (canAccessPrivatePosts) {
      links = links.concat(privateTopicLinks)
    }
    links = links.concat(phaseLinks)
    links = links.concat(workLinks.map((workLink) => ({...workLink, canAddNew: false})))

    // extract attachment from posts
    attachments = [
      ...attachments,
      ...extractAttachmentLinksFromPosts(feeds),
      ...extractAttachmentLinksFromPosts(phaseFeeds),
      ...extractAttachmentLinksFromPosts(workTopics ? workTopics : []).map((workFile) => ({...workFile, canAddNew: false})),
    ]

    const assetsData = []
    enableFileUpload && assetsData.push({name: 'Files', total: _.toString(attachments.length)})
    !hideLinks && assetsData.push({name: 'Links', total: _.toString(links.length)})

    let activeAssetsType
    if (this.state.activeAssetsType) {
      activeAssetsType = this.state.activeAssetsType
    } else if (assetsData.length > 0) {
      activeAssetsType = assetsData[0].name
    }

    const fileUploadClient = filepicker.init(FILE_PICKER_API_KEY, {
      cname: FILE_PICKER_CNAME
    })
    const processUploadedFiles = (fpFiles, category) => {
      const attachments = []
      this.onAddFile(false)
      fpFiles = _.isArray(fpFiles) ? fpFiles : [fpFiles]
      _.forEach(fpFiles, f => {
        const attachment = {
          title: f.filename,
          description: '',
          category,
          size: f.size,
          filePath: f.key,
          contentType: f.mimetype || 'application/unknown'
        }
        attachments.push(attachment)
      })
      this.onUploadAttachment(attachments)
    }

    let category
    const openFileUpload = () => {
      if (fileUploadClient) {
        const picker = fileUploadClient.picker({
          storeTo: {
            location: 's3',
            path: attachmentsStorePath,
            container: FILE_PICKER_SUBMISSION_CONTAINER_NAME,
            region: 'us-east-1'
          },
          maxFiles: 4,
          fromSources: FILE_PICKER_FROM_SOURCES,
          uploadInBackground: false,
          onFileUploadFinished: (files) => {
            processUploadedFiles(files, category)
          },
          onOpen: () => {
            this.onAddFile(true)
          },
          onClose: () => {
            this.onAddFile(false)
          }
        })

        picker.open()
      }
    }
    const newButtonClick = () => {
      if (activeAssetsType === 'Files') {
        openFileUpload()
      } else if (activeAssetsType === 'Links') {
        this.onNewLinkModalChange(true)
      }
    }
    let showAddNewButton = false
    if (activeAssetsType === 'Files' && enableFileUpload) {
      showAddNewButton = true
    } else if (activeAssetsType === 'Links' && canManageLinks) {
      showAddNewButton = true
    }

    const formatModifyDate = (link) => ((link.updatedAt) ? moment(link.updatedAt).format('MM/DD/YYYY h:mm A') : '—')

    const formatFolderTitle = (linkTitle) => linkTitle

    return (
      <div>
        <div styleName="assets-info-wrapper">
          {ifModalOpen && (
            <AddLink
              onAdd={(link) => {
                if (link.address.indexOf('http') !== 0)
                  link.address = `http://${link.address}`
                this.onAddNewLink(link)
                this.onNewLinkModalChange(false)
              }}
              onClose={() => {
                this.onNewLinkModalChange(false)
              }}
            />)}
          <div>
            <div styleName="section-title">
              Assets Library
            </div>
            {(!isLoadingFilesAndLinks && showAddNewButton && isThisFolderAllowAddNew) && (
              <div styleName="assets-header-button">
                <button type="button" onClick={newButtonClick} styleName="add-new-button">Add new...</button>
              </div>)}
          </div>

          {(assetsData.length > 0) && (
            <AssetsStatistics
              assetsData={assetsData}
              onClickAction={this.activeAssetsTypeChange}
              activeAssetsType={activeAssetsType}
            />)}
          {isLoadingFilesAndLinks && (<LoadingIndicator />)}
          {(!isLoadingFilesAndLinks && enableFileUpload && activeAssetsType === 'Files') &&
            <FilesGridView
              links={attachments}
              title="Files"
              onDelete={this.removeAttachment}
              onEdit={this.onEditAttachment}
              onAddAttachment={addProjectAttachment}
              onUploadAttachment={this.onUploadAttachment}
              isSharingAttachment={isSharingAttachment}
              discardAttachments={discardAttachments}
              onChangePermissions={changeAttachmentPermission}
              selectedUsers={attachmentPermissions}
              projectMembers={projectMembers}
              pendingAttachments={attachmentsAwaitingPermission}
              loggedInUser={loggedInUser}
              onDeletePostAttachment={this.deletePostAttachment}
              formatModifyDate={formatModifyDate}
              formatFolderTitle={formatFolderTitle}
              onSelectedItem={this.isThisFolderAllowAddNewChange}
            />}
          {(!isLoadingFilesAndLinks && !hideLinks && activeAssetsType === 'Links') &&
            <LinksGridView
              links={links}
              canDelete={canManageLinks}
              canEdit={canManageLinks}
              onDelete={this.onDeleteLink}
              onEdit={this.onEditLink}
              formatModifyDate={formatModifyDate}
              formatFolderTitle={formatFolderTitle}
              onSelectedItem={this.isThisFolderAllowAddNewChange}
            />}
        </div>
      </div>
    )
  }
}

AssetsInfoContainer.PropTypes = {
  currentMemberRole: PropTypes.string,
  phases: PropTypes.array,
  feeds: PropTypes.array,
  workTopics: PropTypes.array,
  allTopics: PropTypes.array,
  project: PropTypes.object.isRequired,
  isPhaseTopicLoading: PropTypes.bool.isRequired,
  isSuperUser: PropTypes.bool,
  isManageUser: PropTypes.bool,
  canAccessPrivatePosts: PropTypes.bool.isRequired,
}

const mapStateToProps = ({ templates, projectState, members, loadUser }) => {
  const project = projectState.project
  const projectMembers = _.filter(members.members, m => _.some(project.members, pm => pm.userId === m.userId))
  const canAccessPrivatePosts = checkPermission(PERMISSIONS.ACCESS_PRIVATE_POST)
  return ({
    projectTemplates : templates.projectTemplates,
    attachmentsAwaitingPermission: projectState.attachmentsAwaitingPermission,
    attachmentPermissions: projectState.attachmentPermissions,
    isSharingAttachment: projectState.processingAttachments,
    projectMembers:  _.keyBy(projectMembers, 'userId'),
    loggedInUser: loadUser.user,
    canAccessPrivatePosts
  })
}

const mapDispatchToProps = { updateProject, deleteProject, addProjectAttachment, updateProjectAttachment,
  loadProjectMessages, discardAttachments, uploadProjectAttachments, loadDashboardFeeds, loadTopic, changeAttachmentPermission,
  removeProjectAttachment, loadProjectPlan, saveFeedComment }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AssetsInfoContainer))
