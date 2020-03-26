import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import * as filepicker from 'filestack-js'
import moment from 'moment'
import LinksGridView from '../../../components/AssetsLibrary/LinksGridView'
import FilesGridView from '../../../components/AssetsLibrary/FilesGridView'
import AssetsStatistics from '../../../components/AssetsLibrary/AssetsStatistics'
import NotificationsReader from '../../../components/NotificationsReader'
import { loadMembers } from '../../../actions/members'
import { loadDashboardFeeds, loadProjectMessages } from '../../actions/projectTopics'
import { loadTopic } from '../../../actions/topics'
import { loadProjectPlan } from '../../actions/projectPlan'
import {
  PROJECT_ATTACHMENTS_FOLDER,
  PHASE_STATUS_DRAFT,
  PROJECT_FEED_TYPE_MESSAGES,
  FILE_PICKER_API_KEY,
  FILE_PICKER_FROM_SOURCES,
  FILE_PICKER_CNAME,
  FILE_PICKER_SUBMISSION_CONTAINER_NAME,
  FILE_PICKER_ACCEPT,
  PROJECT_ASSETS_SHARED_WITH_TOPCODER_MEMBERS,
  PROJECT_ASSETS_SHARED_WITH_ALL_MEMBERS,
  PROJECT_ASSETS_SHARED_WITH_ADMIN,
  EVENT_TYPE,
} from '../../../config/constants'
import AddLink from '../../../components/AssetsLibrary/AddLink'
import PERMISSIONS from '../../../config/permissions'
import { checkPermission } from '../../../helpers/permissions'
import {
  addProjectAttachment, updateProjectAttachment, uploadProjectAttachments, discardAttachments, changeAttachmentPermission,
  removeProjectAttachment, updateProductAttachment
} from '../../actions/projectAttachment'
import { saveFeedComment } from '../../actions/projectTopics'

import './AssetsInfoContainer.scss'

class AssetsInfoContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeAssetsType: null,
      ifModalOpen: false,
      gridFilter: {
        name: {
          name: '',
          tag: ''
        },
        sharedWith: '',
        date: {
          from: '',
          to: ''
        }
      }
    }
    this.onAddNewLink = this.onAddNewLink.bind(this)
    this.onDeleteLink = this.onDeleteLink.bind(this)
    this.onEditLink = this.onEditLink.bind(this)
    this.onEditAttachment = this.onEditAttachment.bind(this)
    this.onAddFile = this.onAddFile.bind(this)
    this.onUploadAttachment = this.onUploadAttachment.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.extractLinksFromPosts = this.extractLinksFromPosts.bind(this)
    this.extractMarkdownLink = this.extractMarkdownLink.bind(this)
    this.extractHtmlLink = this.extractHtmlLink.bind(this)
    this.extractRawLink = this.extractRawLink.bind(this)
    this.getFileAttachmentName = this.getFileAttachmentName.bind(this)
    this.extractAttachmentLinksFromPosts = this.extractAttachmentLinksFromPosts.bind(this)
    this.deletePostAttachment = this.deletePostAttachment.bind(this)
    this.activeAssetsTypeChange = this.activeAssetsTypeChange.bind(this)
    this.onNewLinkModalChange = this.onNewLinkModalChange.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.getFilterValue = this.getFilterValue.bind(this)
    this.clearFilter = this.clearFilter.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return !_.isEqual(nextProps.project, this.props.project) ||
      !_.isEqual(nextProps.feeds, this.props.feeds) ||
      !_.isEqual(nextProps.phases, this.props.phases) ||
      !_.isEqual(nextProps.phasesTopics, this.props.phasesTopics) ||
      !_.isEqual(nextProps.isFeedsLoading, this.props.isFeedsLoading) ||
      !_.isEqual(nextProps.attachmentsAwaitingPermission, this.props.attachmentsAwaitingPermission) ||
      !_.isEqual(nextProps.attachmentPermissions, this.props.attachmentPermissions) ||
      !_.isEqual(nextProps.attachmentTags, this.props.attachmentTags) ||
      !_.isEqual(nextProps.isSharingAttachment, this.props.isSharingAttachment) ||
      !_.isEqual(nextProps.assetsMembers, this.props.assetsMembers) ||
      !_.isEqual(nextState.activeAssetsType, this.state.activeAssetsType) ||
      !_.isEqual(nextState.ifModalOpen, this.state.ifModalOpen)
  }

  componentWillMount() {
    const { project, isFeedsLoading, feeds, phases, phasesTopics, loadTopic, location } = this.props

    // load feeds from dashboard if they are not currently loading or loaded yet
    // also it will load feeds, if we already loaded them, but it was 0 feeds before
    if (!isFeedsLoading && feeds.length < 1) {
      this.loadAllFeeds()
    }

    // load phases feeds if they are not loaded yet
    // note: old projects doesn't have phases, so we check if there are any phases at all first
    phases && phasesTopics && phases.forEach((phase) => {
      if (!phasesTopics[`phase#${phase.id}`]) {
        loadTopic(project.id, `phase#${phase.id}`)
      }
    })

    // handle url hash
    if (!_.isEmpty(location.hash)) {
      this.handleUrlHash(this.props)
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
    const { project, isFeedsLoading, phases, phasesTopics, feeds, loadProjectPlan, loadTopic, location } = props
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
          loadTopic(project.id, `phase#${hashPrimaryId}`)
        }
      }
      break
    }
    }
  }

  activeAssetsTypeChange(assetsType) {
    this.setState({activeAssetsType: assetsType})
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
    const { project, addProjectAttachment } = this.props
    addProjectAttachment(project.id, {
      title: link.title,
      tags: link.tags,
      type: 'link',
      path: link.address
    })
  }

  onDeleteLink(id) {
    const { project, removeProjectAttachment } = this.props
    removeProjectAttachment(project.id, id)
  }

  onEditLink(id, title, address, tags) {
    const { project, updateProjectAttachment } = this.props

    updateProjectAttachment(project.id, id, {
      title,
      path: address,
      tags
    })
  }

  onEditAttachment(originalAttachment, title, allowedUsers, tags) {
    const { project, updateProjectAttachment, phases, updateProductAttachment } = this.props
    const updatedAttachment = {
      title,
      allowedUsers,
      tags
    }

    // If it's a product attachment
    if (originalAttachment.category && originalAttachment.category.indexOf('product') === 0) {
      let phase
      let product
      let attachment

      // Find phase and product to which the attachment belongs to
      for (let i = 0; i < phases.length && !attachment; i++) {
        const products = phases[i].products || []
        for (let j = 0; j < products.length; j++) {
          attachment = products[j].attachments.find(a => a.id === originalAttachment.id)

          if (attachment) {
            phase = phases[i]
            product = products[i]
            break
          }
        }
      }

      if (attachment) {
        updateProductAttachment(project.id, phase.id, product.id, attachment.id, updatedAttachment)
      }
    } else {
      // If it's a project attachment
      const attachment = project.attachments.find(attachment => attachment.id === originalAttachment.id)
      if (attachment) {
        updateProjectAttachment(project.id,
          attachment.id,
          updatedAttachment
        )
      }
    }
  }

  removeAttachment(attachmentId) {
    const { project } = this.props
    this.props.removeProjectAttachment(project.id, attachmentId)
  }

  setFilter(name, filter) {
    const gridFilter = {
      name: this.state.gridFilter.name,
      sharedWith: this.state.gridFilter.sharedWith,
      date: this.state.gridFilter.date,
    }

    let target = gridFilter

    name.split('.').forEach((key, index, list) => {
      if (index !== list.length - 1) {
        target = target[key]
      } else {
        target[key] = filter
      }
    })

    this.setState({ gridFilter })
    this.forceUpdate()
  }

  getFilterValue(name) {
    let target = this.state.gridFilter

    name.split('.').forEach(key => {
      target = target[key]
    })

    return target
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

  extractHtmlLink(post) {
    const links = []
    const regex = /<a[^>]+href="(.*?)"[^>]*>([\s\S]*?)<\/a>/gm
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm // eslint-disable-line no-useless-escape
    const rawLinks = regex.exec(post.rawContent)

    if (Array.isArray(rawLinks)) {
      let i = 0
      while (i < rawLinks.length) {
        const title = rawLinks[i + 2]
        const path = rawLinks[i + 1]

        if (urlRegex.test(path)) {
          links.push({
            title,
            path,
            // use created at `date` to show as modified time for links inside folders
            updatedAt: post.date,
            createdBy: post.userId
          })
        }

        i = i + 3
      }
    }

    return links
  }

  extractMarkdownLink(post) {
    const links = []
    const regex = /(?:__|[*#])|\[(.*?)\]\((.*?)\)/gm
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm // eslint-disable-line no-useless-escape
    const rawLinks = regex.exec(post.rawContent)

    if (Array.isArray(rawLinks)) {
      let i = 0
      while (i < rawLinks.length) {
        const title = rawLinks[i + 1]
        const path = rawLinks[i + 2]

        if (urlRegex.test(path)) {
          links.push({
            title,
            path,
            // use created at `date` to show as modified time for links inside folders
            updatedAt: post.date,
            createdBy: post.userId
          })
        }

        i = i + 3
      }
    }

    return links
  }

  extractRawLink(post) {
    let links = []
    const regex = /(\s|^)(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}[\s])(\s|$)/igm // eslint-disable-line no-useless-escape
    const rawLinks = post.rawContent.match(regex)

    if (Array.isArray(rawLinks)) {
      links = rawLinks
        .filter(link => !link.includes(']'))
        .map(link => {
          const name = link.trim()
          const url = !/^https?:\/\//i.test(name) ? 'http://' + name : name

          return {
            title: name,
            path: url,
            // use created at `date` to show as modified time for links inside folders
            updatedAt: post.date,
            createdBy: post.userId
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
          ...this.extractHtmlLink(post),
          ...this.extractMarkdownLink(post),
          ...this.extractRawLink(post)
        ])
      })

      if (childrenLinks.length > 0) {
        links.push({
          title: feed.title,
          createdBy: feed.userId,
          // use created at `date` to show as modified time for folders
          updatedAt: feed.date,
          children: childrenLinks.map(link => {
            link.tag = feed.tag
            return link
          }),
          tag: feed.tag
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
            deletable: false,
            createdAt: post.date,
            createdBy: attachment.createdBy,
            postId: post.id,
            topicId: feed.id,
            topicTag: feed.tag,
            updatedAt: feed.updatedDate
          })
        })
      })

      if (attachmentLinksPerFeed.length > 0) {
        attachmentLinks.push({
          title: feed.title,
          createdBy: feed.userId,
          // use created at `date` to show as modified time for folders
          updatedAt: feed.date,
          children: attachmentLinksPerFeed,
          tag: feed.tag
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
        .map(key => phasesTopics[`phase#${key}`].topic)
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

  setAttachmentUserDetails(attachments) {
    attachments.forEach((attachment) => {
      if (attachment.allowedUsers) {
        const needToBeLoaded = attachment.allowedUsers.filter(userId => !this.props.projectMembers[userId])

        if (needToBeLoaded.length > 0) {
          this.props.loadMembers(needToBeLoaded)
        }

        attachment.userHandles = attachment.allowedUsers.map(userId => this.props.projectMembers[userId])
      }
    })
  }

  getLinksAndAttachments() {
    const { project, isSuperUser, phases, feeds,
      isManageUser, phasesTopics, canAccessPrivatePosts } = this.props

    let attachments = _.filter(project.attachments, a => a.type === 'file')
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
        tags: attachment.tags,
        category: attachment.category
      }))

    // get list of phase topic in same order as phases
    // note: for old projects which doesn't have phases we return an empty array
    const visiblePhases = phases && phases.filter((phase) => (
      isSuperUser || isManageUser || phase.status !== PHASE_STATUS_DRAFT
    )) || []

    const phaseFeeds = _.compact(
      visiblePhases.map((phase) => {
        const topic = _.get(phasesTopics, `[phase#${phase.id}].topic`)

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

    // extract links from posts
    const topicLinks = this.extractLinksFromPosts(feeds)
    const publicTopicLinks = topicLinks.filter(link => link.tag !== PROJECT_FEED_TYPE_MESSAGES)
    const privateTopicLinks = topicLinks.filter(link => link.tag === PROJECT_FEED_TYPE_MESSAGES)
    const phaseLinks = this.extractLinksFromPosts(phaseFeeds)

    let links = _.filter(project.attachments, a => a.type === 'link')
    links = links.concat(publicTopicLinks)
    if (canAccessPrivatePosts) {
      links = links.concat(privateTopicLinks)
    }
    links = links.concat(phaseLinks)

    // extract attachment from posts
    attachments = [
      ...attachments,
      ...this.extractAttachmentLinksFromPosts(feeds),
      ...this.extractAttachmentLinksFromPosts(phaseFeeds)
    ]

    this.setAttachmentUserDetails(attachments)

    links = this.filterAssetList(links)
    attachments = this.filterAssetList(attachments)

    return ({
      links,
      attachments,
    })
  }

  filterAssetList(list) {
    const {name: nameAndTag, sharedWith, date} = this.state.gridFilter
    const {from, to} = date
    const {name, tag} = nameAndTag

    return list.filter(item => {
      if (item.children) {
        item.children = this.filterAssetList(item.children)

        return item.children.length > 0
      } else {
        let nameMatch = true
        let tagMatch = true
        let sharedWithMatch = true
        let fromDateMatch = true
        let toDateMatch = true

        // filter name
        if (name) {
          nameMatch = item.title.toLowerCase().indexOf(name.toLowerCase()) !== -1
        }

        if (tag) {
          tagMatch = _.some(item.tags, t => t.toLowerCase().indexOf(tag.toLowerCase()) !== -1)
        }

        // filter user handle
        if (sharedWith) {
          const sharedWithLowerCase = sharedWith.toLowerCase()
          if (item.tag || item.topicTag) {
            // when tag is exists
            if ((item.tag || item.topicTag) === PROJECT_FEED_TYPE_MESSAGES) {
              // filter with only topcoder members text
              sharedWithMatch = PROJECT_ASSETS_SHARED_WITH_TOPCODER_MEMBERS.toLowerCase().indexOf(sharedWithLowerCase) !== -1
            } else {
              // filter with all project members text
              sharedWithMatch = PROJECT_ASSETS_SHARED_WITH_ALL_MEMBERS.toLowerCase().indexOf(sharedWithLowerCase) !== -1
            }
          } else if (item.allowedUsers instanceof Array) {
            // when allowed users exists
            if (item.allowedUsers.length > 0) {
              // filter by user handle, first or last name
              sharedWithMatch = _.some(item.userHandles, user => (
                _.get(user, 'handle', '').toLowerCase().indexOf(sharedWithLowerCase) !== -1 ||
                _.get(user, 'firstName', '').toLowerCase().indexOf(sharedWithLowerCase) !== -1 ||
                _.get(user, 'lastName', '').toLowerCase().indexOf(sharedWithLowerCase) !== -1
              ))
            } else {
              // filter by only admins text
              sharedWithMatch = PROJECT_ASSETS_SHARED_WITH_ADMIN.toLowerCase().indexOf(sharedWithLowerCase) !== -1
            }
          } else {
            // no tag and allowed users
            // filter with all project members text
            sharedWithMatch = PROJECT_ASSETS_SHARED_WITH_ALL_MEMBERS.toLowerCase().indexOf(sharedWithLowerCase) !== -1
          }
        }

        if (from || to) {
          const date = moment(item.updatedAt)

          if (from) {
            const fromDate = moment(from)

            fromDateMatch = date.isSameOrAfter(fromDate, 'day')
          }

          if (to) {
            const toDate = moment(to)

            toDateMatch = date.isSameOrBefore(toDate, 'day')
          }
        }

        return nameMatch && sharedWithMatch && fromDateMatch && toDateMatch && tagMatch
      }
    })
  }

  checkFilterDirty() {
    const {name: nameAndTag, sharedWith, date} = this.state.gridFilter
    const {from, to} = date
    const {name, tag} = nameAndTag

    return !!name || !!tag || !!sharedWith || !!from || !!to
  }

  componentDidMount() {
    const {loadMembers } = this.props
    const {links, attachments} = this.getLinksAndAttachments()

    let tmpUserIds = []
    let userIds = []
    _.forEach(links, link => {
      tmpUserIds = _.union(tmpUserIds, _.map(link.children, 'createdBy'))
      tmpUserIds = _.union(tmpUserIds, [link.createdBy])
      tmpUserIds = _.union(tmpUserIds, [link.updatedBy])
    })

    _.forEach(attachments, attachment => {
      tmpUserIds = _.union(tmpUserIds, _.map(attachment.children, 'createdBy'))
      tmpUserIds = _.union(tmpUserIds, [attachment.createdBy])
    })

    _.forEach(tmpUserIds, userId => {
      userIds = _.union(userIds, [_.parseInt(userId)])
    })
    _.remove(userIds, i => !i)

    loadMembers(userIds)
  }

  clearFilter() {
    this.setState({
      gridFilter: {
        name: {
          name: '',
          tag: ''
        },
        sharedWith: '',
        date: {
          from: '',
          to: ''
        }
      }
    })

    this.forceUpdate()
  }

  render() {
    const { project, currentMemberRole, isSuperUser, projectTemplates, hideLinks,
      attachmentsAwaitingPermission, addProjectAttachment, discardAttachments, attachmentPermissions, attachmentTags,
      changeAttachmentPermission, projectMembers, loggedInUser, isSharingAttachment, assetsMembers } = this.props
    const { ifModalOpen } = this.state

    const canManageLinks = !!currentMemberRole || isSuperUser

    let devices = []
    const primaryTarget = _.get(project, 'details.appDefinition.primaryTarget')
    if (primaryTarget && !primaryTarget.seeAttached) {
      devices.push(primaryTarget.value)
    } else {
      devices = _.get(project, 'details.devices', [])
    }

    const {links, attachments} = this.getLinksAndAttachments()

    const attachmentsStorePath = `${PROJECT_ATTACHMENTS_FOLDER}/${project.id}/`
    let enableFileUpload = true
    if(project.version !== 'v2') {
      const templateId = _.get(project, 'templateId')
      const projectTemplate = _.find(projectTemplates, template => template.id === templateId)
      enableFileUpload = _.some(projectTemplate.scope.sections, section => {
        return _.some(section.subSections, subSection => subSection.id === 'files')
      })
    }

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
          path: f.key,
          type: 'file',
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
          accept: FILE_PICKER_ACCEPT,
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

    const filterDirty = this.checkFilterDirty()

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
            {(showAddNewButton) && (
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
          {(enableFileUpload && activeAssetsType === 'Files') && (
            <div>
              <NotificationsReader
                id="assets-library-files"
                criteria={[
                  { eventType: EVENT_TYPE.PROJECT.FILE_UPLOADED, contents: { projectId: project.id } }
                ]}
              />
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
                selectedTags={attachmentTags}
                projectMembers={projectMembers}
                assetsMembers={assetsMembers}
                pendingAttachments={attachmentsAwaitingPermission}
                loggedInUser={loggedInUser}
                attachmentsStorePath={attachmentsStorePath}
                onDeletePostAttachment={this.deletePostAttachment}
                formatModifyDate={formatModifyDate}
                formatFolderTitle={formatFolderTitle}
                setFilter={this.setFilter}
                getFilterValue={this.getFilterValue}
                clearFilter={this.clearFilter}
                filtered={filterDirty}
              />
            </div>
          )}
          {(!hideLinks && activeAssetsType === 'Links') && (
            <div>
              <NotificationsReader
                id="assets-library-files"
                criteria={[
                  { eventType: EVENT_TYPE.PROJECT.LINK_CREATED, contents: { projectId: project.id } }
                ]}
              />
              <LinksGridView
                links={links}
                assetsMembers={assetsMembers}
                canDelete={canManageLinks}
                canEdit={canManageLinks}
                onDelete={this.onDeleteLink}
                onEdit={this.onEditLink}
                formatModifyDate={formatModifyDate}
                formatFolderTitle={formatFolderTitle}
                setFilter={this.setFilter}
                getFilterValue={this.getFilterValue}
                clearFilter={this.clearFilter}
                filtered={filterDirty}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}

AssetsInfoContainer.PropTypes = {
  currentMemberRole: PropTypes.string,
  phases: PropTypes.array,
  feeds: PropTypes.array,
  phasesTopics: PropTypes.array,
  project: PropTypes.object.isRequired,
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
    attachmentTags: projectState.attachmentTags,
    isSharingAttachment: projectState.processingAttachments,
    projectMembers:  _.keyBy(projectMembers, 'userId'),
    assetsMembers: _.keyBy(members.members, 'userId'),
    loggedInUser: loadUser.user,
    canAccessPrivatePosts
  })
}

const mapDispatchToProps = { loadMembers, addProjectAttachment, updateProjectAttachment, updateProductAttachment,
  loadProjectMessages, discardAttachments, uploadProjectAttachments, loadDashboardFeeds, loadTopic, changeAttachmentPermission,
  removeProjectAttachment, loadProjectPlan, saveFeedComment }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AssetsInfoContainer))
