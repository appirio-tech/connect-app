import React from 'react'
import { connect } from 'react-redux'
import { Prompt } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import {
  groupBy,
  includes,
  sortBy,
  mapValues,
  isNil,
  keyBy,
  pickBy,
  noop,
  trim
} from 'lodash'

import Sticky from '../../../components/Sticky'
import NewPost from '../../../components/Feed/NewPost'
import ProjectInfoContainer from './ProjectInfoContainer'
import TwoColsLayout from '../../../components/TwoColsLayout'
import TopicGroup from '../../../components/TopicGroup/TopicGroup'
import NewPostMobile from '../../../components/Feed/NewPostMobile'
import ChatButton from '../../../components/ChatButton/ChatButton'

import {
  loadDashboardFeeds,
  loadProjectMessages,
  createProjectTopic
} from '../../actions/projectTopics'

import PERMISSIONS from '../../../config/permissions'
import { checkPermission } from '../../../helpers/permissions'

import {
  SCREEN_BREAKPOINT_MD,
  PROJECT_FEED_TYPE_PRIMARY,
  PROJECT_FEED_TYPE_MESSAGES,
  EVENT_TYPE
} from '../../../config/constants'
import TopicDrawer from '../../../components/TopicDrawer/TopicDrawer'

import styles from './MessagesTabContainer.scss'
import PostsRefreshPrompt from '../components/PostsRefreshPrompt'

/**
 * MessagesTabContainer container
 * displays content of the Messages tab
 */
class MessagesTabContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isNewPostMobileOpen: false,
      newPost: {}
    }

    this.onTopicDrawerClose = this.onTopicDrawerClose.bind(this)
    this.toggleNewPostMobile = this.toggleNewPostMobile.bind(this)
    this.onNewPost = this.onNewPost.bind(this)
    this.onNewPostChange = this.onNewPostChange.bind(this)
    this.isChanged = this.isChanged.bind(this)
    this.onRefreshFeeds = this.onRefreshFeeds.bind(this)
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onLeave)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onLeave)
  }

  /**
   * Groups feeds into new and old based on unread notifications.
   * @returns {Object} - Object with keys 'old' and 'new'. The values will be an array of topics
   */
  getTopicsByType(notificationsByTopic) {
    const { feeds } = this.props

    const topicsByType = groupBy(feeds, f =>
      f.id in notificationsByTopic ? 'new' : 'old'
    )

    return topicsByType
  }

  /**
   * Groups notifications by topic id.
   * @returns {Object} - Object with topic ids as keys and notifications as values
   */
  getNewNotificationsByTopic() {
    const { project, notifications } = this.props

    const projectId = project.id
    const notificationsForCurrentProject = notifications.filter(
      n =>
        projectId === Number(n.contents.projectId) &&
        !n.isRead &&
        includes(
          [
            EVENT_TYPE.POST.CREATED,
            EVENT_TYPE.POST.UPDATED,
            EVENT_TYPE.POST.MENTION,
            EVENT_TYPE.TOPIC.CREATED
          ],
          n.eventType
        )
    )
    const notificationsByTopic = groupBy(
      notificationsForCurrentProject,
      n => n.contents.topicId
    )
    const sortedNotificationsByTopic = mapValues(notificationsByTopic, n =>
      sortBy(n, n.date)
    )

    return sortedNotificationsByTopic
  }

  /**
   * Returns the sidebar content
   */
  getSidebarContent() {
    const {
      location,
      currentMemberRole,
      project,
      phases,
      isSuperUser,
      isManageUser,
      feeds,
      isFeedsLoading,
      productsTimelines,
      phasesTopics,
      isProcessing
    } = this.props

    const leftArea = (
      <ProjectInfoContainer
        location={location}
        currentMemberRole={currentMemberRole}
        project={project}
        phases={phases}
        isSuperUser={isSuperUser}
        isManageUser={isManageUser}
        feeds={feeds}
        isFeedsLoading={isFeedsLoading}
        productsTimelines={productsTimelines}
        phasesTopics={phasesTopics}
        isProjectProcessing={isProcessing}
      />
    )

    return (
      <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
        {matches => {
          if (matches) {
            return <Sticky top={60}>{leftArea}</Sticky>
          } else {
            return leftArea
          }
        }}
      </MediaQuery>
    )
  }

  // navigate back to messages tab on drawer close
  onTopicDrawerClose() {
    const { history, location } = this.props
    history.push(location.pathname.replace(/messages\/\d+/, 'messages/'))
  }

  toggleNewPostMobile() {
    this.setState({ isNewPostMobileOpen: !this.state.isNewPostMobileOpen })
  }

  onNewPost({ title, content, isPrivate = false, attachmentIds }) {
    const { project } = this.props
    const newFeed = {
      title,
      body: content,
      tag: isPrivate ? PROJECT_FEED_TYPE_MESSAGES : PROJECT_FEED_TYPE_PRIMARY
    }
    if (attachmentIds) {
      Object.assign(newFeed, { attachmentIds })
    }
    this.props.createProjectTopic(project.id, newFeed)
  }

  isChanged() {
    const { newPost } = this.state
    const notEmpty = str => str && !!trim(str).length

    return notEmpty(newPost.title) || notEmpty(newPost.content)
  }

  // Notify user if they navigate away while the form is modified.
  onLeave(e = {}) {
    if (this.isChanged()) {
      return (e.returnValue =
        'You haven\'t posted your message. If you leave this page, your message will not be saved. Are you sure you want to leave?')
    }
  }

  // refreshes the feeds and display new feeds
  onRefreshFeeds() {
    const {
      loadDashboardFeeds,
      loadProjectMessages,
      project,
      canAccessPrivatePosts
    } = this.props
    loadDashboardFeeds(project.id)
    canAccessPrivatePosts && loadProjectMessages(project.id)
  }

  onNewPostChange(title, content) {
    this.setState({
      newPost: { title, content }
    })
  }

  render() {
    const {
      allMembers,
      project,
      currentUser,
      match,
      error,
      isCreatingFeed,
      currentMemberRole,
      projectMembers,
      canAccessPrivatePosts,
      isSuperUser,
      notificationsState
    } = this.props
    const { isNewPostMobileOpen } = this.state

    const notificationsByTopic = this.getNewNotificationsByTopic()
    const topicsByType = this.getTopicsByType(notificationsByTopic)
    const leftArea = this.getSidebarContent()
    const selectedTopic = match.params.topicId
    const isTopicDrawerOpen = !isNil(selectedTopic)
    const onLeaveMessage = this.onLeave()

    const commonTopicGroupProps = {
      notificationsByTopic,
      authors: allMembers,
      projectId: project.id
    }

    return (
      <TwoColsLayout>
        <TwoColsLayout.Sidebar wrapperClass="gray-bg">
          {leftArea}
        </TwoColsLayout.Sidebar>

        <TwoColsLayout.Content>
          {/* Automatically refresh topics */}
          <PostsRefreshPrompt
            preventShowing={!!this.isChanged()}
            toggleNotificationRead={noop} // shouldn't mark notifications as read. We're just shwoing the topics. Actual posts will be shown in drawer
            refreshFeeds={this.onRefreshFeeds}
            notifications={notificationsState}
            projectId={project.id}
          />

          {/* Alert user if they try to navigate while unsaved changes are pending */}
          <Prompt
            when={!!onLeaveMessage}
            message={location =>
              location.pathname.match(/projects\/\d+\/messages/)
                ? true
                : onLeaveMessage
            }
          />

          {/* New post input for desktop screens */}
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            <div className={styles.newpostContainer}>
              <NewPost
                currentUser={currentUser}
                allMembers={allMembers}
                projectMembers={projectMembers}
                onPost={this.onNewPost}
                isCreating={isCreatingFeed}
                hasError={error}
                heading="NEW STATUS POST"
                onNewPostChange={this.onNewPostChange}
                titlePlaceholder="Start a new discussion"
                expandedTitlePlaceholder="Add your discussion title"
                contentPlaceholder="Add your first post"
                canAccessPrivatePosts={canAccessPrivatePosts}
              />
            </div>
          </MediaQuery>

          {/* New messages */}
          <TopicGroup
            {...commonTopicGroupProps}
            unread
            groupTitle="NEW MESSAGES"
            topics={topicsByType.new}
          />

          {/* Earlier messages */}
          <TopicGroup
            {...commonTopicGroupProps}
            groupTitle="EARLIER MESSAGES"
            topics={topicsByType.old}
          />

          {/* New post button for mobile screens */}
          {!isNewPostMobileOpen && (
            <MediaQuery maxWidth={SCREEN_BREAKPOINT_MD - 1}>
              <div>
                <ChatButton onClick={this.toggleNewPostMobile} />
              </div>
            </MediaQuery>
          )}

          {/* New post screen for mobiles */}
          {isNewPostMobileOpen && (
            <NewPostMobile
              statusTitle="NEW STATUS"
              commentTitle="WRITE POST"
              statusPlaceholder="Start a new discussion"
              commentPlaceholder="Add your first post"
              submitText="Post"
              nextStepText="Add post"
              onClose={this.toggleNewPostMobile}
              allMembers={allMembers}
              currentUser={currentUser}
              onPost={this.onNewPost}
              isCreating={isCreatingFeed}
              hasError={error}
              onNewPostChange={this.onNewPostChange}
              canAccessPrivatePosts={canAccessPrivatePosts}
            />
          )}

          {/* Topic drawer that shows post under selected topic */}
          <TopicDrawer
            open={isTopicDrawerOpen}
            onClose={this.onTopicDrawerClose}
            currentMemberRole={currentMemberRole}
            topic={Number(selectedTopic)}
            isSuperUser={isSuperUser}
            project={project}
          />
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}

const mapStateToProps = ({
  projectTopics,
  phasesTopics,
  projectState,
  notifications,
  loadUser,
  members
}) => {
  const project = projectState.project

  // all feeds includes primary as well as private topics if user has access to private topics
  let allFeed = projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics
  const canAccessPrivatePosts = checkPermission(PERMISSIONS.ACCESS_PRIVATE_POST)
  if (canAccessPrivatePosts) {
    allFeed = [
      ...allFeed,
      ...projectTopics.feeds[PROJECT_FEED_TYPE_MESSAGES].topics
    ]
  }

  const allMembers = members.members
  const projectMembersMap = keyBy(project.members, 'userId')
  const projectMembers = mapValues(
    pickBy(allMembers, m => projectMembersMap.hasOwnProperty(m.userId)),
    m => ({ ...m, role: projectMembersMap[m.userId].role })
  )

  return {
    feeds: allFeed,
    currentUser: loadUser.user,
    isFeedsLoading: projectTopics.isLoading,
    isCreatingFeed: projectTopics.isCreatingFeed,
    isProcessing: projectState.processing,
    phases: projectState.phases,
    notifications: notifications.notifications,
    notificationsState: notifications,
    error: projectTopics.error,
    projectMembers,
    phasesTopics,
    allMembers
  }
}

const mapDispatchToProps = {
  createProjectTopic,
  loadDashboardFeeds,
  loadProjectMessages
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagesTabContainer)
