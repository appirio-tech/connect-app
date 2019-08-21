import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import _ from 'lodash'
import moment from 'moment'
import LinksGridView from '../../../components/AssetsLibrary/LinksGridView'
import FilesGridView from '../../../components/AssetsLibrary/FilesGridView'
import AssetsStatistics from '../../../components/AssetsLibrary/AssetsStatistics'
import {updateProject, deleteProject} from '../../actions/project'
import {loadDashboardFeeds, loadProjectMessages} from '../../actions/projectTopics'
import {loadTopic} from '../../../actions/topics'
import {loadProjectPlan} from '../../actions/projectPlan'
import {
  PROJECT_FEED_TYPE_MESSAGES,
} from '../../../config/constants'
import PERMISSIONS from '../../../config/permissions'
import {checkPermission} from '../../../helpers/permissions'
import {extractAttachmentLinksFromPosts, extractLinksFromPosts} from '../../../helpers/posts'
import {
  addProjectAttachment,
  updateProjectAttachment,
  uploadProjectAttachments,
  discardAttachments,
  changeAttachmentPermission,
  removeProjectAttachment
} from '../../actions/projectAttachment'
import {saveFeedComment} from '../../actions/projectTopics'

import './WorkAssetsContainer.scss'

class WorkAssetsContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeAssetsType: null
    }
    this.activeAssetsTypeChange = this.activeAssetsTypeChange.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return !_.isEqual(nextProps.project, this.props.project) ||
      !_.isEqual(nextProps.isFeedsLoading, this.props.isFeedsLoading) ||
      !_.isEqual(nextProps.attachmentsAwaitingPermission, this.props.attachmentsAwaitingPermission) ||
      !_.isEqual(nextProps.attachmentPermissions, this.props.attachmentPermissions) ||
      !_.isEqual(nextProps.isSharingAttachment, this.props.isSharingAttachment) ||
      !_.isEqual(nextState.activeAssetsType, this.state.activeAssetsType)
  }

  activeAssetsTypeChange(assetsType) {
    this.setState({activeAssetsType: assetsType})
  }

  render() {
    const {
      hideLinks, feeds,
      attachmentsAwaitingPermission, discardAttachments, attachmentPermissions,
      projectMembers, loggedInUser, isSharingAttachment, canAccessPrivatePosts
    } = this.props

    // extract links from posts
    const topicLinks = extractLinksFromPosts(feeds)
    const publicTopicLinks = topicLinks.filter(link => link.tag !== PROJECT_FEED_TYPE_MESSAGES)
    const privateTopicLinks = topicLinks.filter(link => link.tag === PROJECT_FEED_TYPE_MESSAGES)

    let links = []
    links = links.concat(publicTopicLinks)
    if (canAccessPrivatePosts) {
      links = links.concat(privateTopicLinks)
    }

    // extract attachment from posts
    const attachments = extractAttachmentLinksFromPosts(feeds)

    const assetsData = [{name: 'Files', total: _.toString(attachments.length)}]
    !hideLinks && assetsData.push({name: 'Links', total: _.toString(links.length)})

    let activeAssetsType
    if (this.state.activeAssetsType) {
      activeAssetsType = this.state.activeAssetsType
    } else if (assetsData.length > 0) {
      activeAssetsType = assetsData[0].name
    }

    const formatModifyDate = (link) => ((link.updatedAt) ? moment(link.updatedAt).format('MM/DD/YYYY h:mm A') : '—')

    const formatFolderTitle = (linkTitle) => linkTitle

    return (
      <div>
        <div styleName="assets-info-wrapper">

          {(assetsData.length > 0) && (
            <AssetsStatistics
              assetsData={assetsData}
              onClickAction={this.activeAssetsTypeChange}
              activeAssetsType={activeAssetsType}
            />)}
          { activeAssetsType === 'Files' &&
          <FilesGridView
            links={attachments}
            title="Files"
            isSharingAttachment={isSharingAttachment}
            discardAttachments={discardAttachments}
            selectedUsers={attachmentPermissions}
            projectMembers={projectMembers}
            pendingAttachments={attachmentsAwaitingPermission}
            loggedInUser={loggedInUser}
            attachmentsStorePath=""
            formatModifyDate={formatModifyDate}
            formatFolderTitle={formatFolderTitle}
          />}
          {(!hideLinks && activeAssetsType === 'Links') &&
          <LinksGridView
            links={links}
            formatModifyDate={formatModifyDate}
            formatFolderTitle={formatFolderTitle}
          />}
        </div>
      </div>
    )
  }
}

WorkAssetsContainer.PropTypes = {
  currentMemberRole: PropTypes.string,
  feeds: PropTypes.array,
  isSuperUser: PropTypes.bool,
  isManageUser: PropTypes.bool,
  canAccessPrivatePosts: PropTypes.bool.isRequired,
}

const mapStateToProps = ({ projectState, members, loadUser}) => {
  const project = projectState.project
  const projectMembers = _.filter(members.members, m => _.some(project.members, pm => pm.userId === m.userId))
  const canAccessPrivatePosts = checkPermission(PERMISSIONS.ACCESS_PRIVATE_POST)
  return ({
    attachmentsAwaitingPermission: projectState.attachmentsAwaitingPermission,
    attachmentPermissions: projectState.attachmentPermissions,
    isSharingAttachment: projectState.processingAttachments,
    projectMembers: _.keyBy(projectMembers, 'userId'),
    loggedInUser: loadUser.user,
    canAccessPrivatePosts
  })
}

const mapDispatchToProps = {
  updateProject,
  deleteProject,
  addProjectAttachment,
  updateProjectAttachment,
  loadProjectMessages,
  discardAttachments,
  uploadProjectAttachments,
  loadDashboardFeeds,
  loadTopic,
  changeAttachmentPermission,
  removeProjectAttachment,
  loadProjectPlan,
  saveFeedComment
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkAssetsContainer))
