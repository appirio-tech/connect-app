import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import DeleteFileLinkModal from '../LinksMenu/DeleteFileLinkModal'
import ItemOperations from './ItemOperations'
import UserTooltip from '../User/UserTooltip'
import FolderIcon from '../../assets/icons/v.2.5/icon-folder-small.svg'
import FileIcon from '../../components/FileIcon'

import './GridView.scss'
import {
  PROJECT_ASSETS_SHARED_WITH_ALL_MEMBERS,
  PROJECT_ASSETS_SHARED_WITH_TOPCODER_MEMBERS,
  PROJECT_FEED_TYPE_MESSAGES
} from '../../config/constants'
import FilterColHeader from './FilterColHeader'
class SubFolder extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      linkToDelete: -1
    }
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this)
    this.onDeleteCancel = this.onDeleteCancel.bind(this)
    this.deleteLink = this.deleteLink.bind(this)
    this.hasAccess = this.hasAccess.bind(this)
    this.clearFieldValues = this.clearFieldValues.bind(this)
    this.wrappedSetFilter = this.wrappedSetFilter.bind(this)
  }

  componentDidMount() {
    // scroll to the top when open
    document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  onDeleteConfirm() {
    const link = this.props.link.children[this.state.linkToDelete]
    if (link) {
      this.props.onDeletePostAttachment({ topicId: link.topicId, postId: link.postId, attachmentId: link.attachmentId, topicTag: link.topicTag })
      this.onDeleteCancel()
    }
  }

  onDeleteCancel() {
    this.setState({
      linkToDelete: -1
    })
  }

  deleteLink(idx) {
    this.setState({
      linkToDelete: idx
    })
  }

  hasAccess(createdBy) {
    const { loggedInUser } = this.props
    return Number.parseInt(createdBy) === loggedInUser.userId
  }

  isURLValid(linkAddress) {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(linkAddress)
  }

  clearFieldValues() {
    this.nameFieldRef.clearFilter()
    this.sharedWithFieldRef.clearFilter()
    this.dateFieldRef.clearFilter()
  }

  wrappedSetFilter(name, value) {
    this.props.setFilter(name, value)
    this.props.updateSubContents()
  }

  render() {
    const {
      link,
      renderLink,
      goBack,
      formatModifyDate,
      isLinkSubFolder,
      assetsMembers,
      getFilterValue,
      clearFilter,
      clearSubContents,
      filtered
    } = this.props
    const { linkToDelete } = this.state

    return (
      <div styleName={cn({'assets-gridview-container-active': (linkToDelete >= 0)}, '')}>
        {(linkToDelete >= 0) && <div styleName="assets-gridview-modal-overlay"/>}
        <div styleName="assets-gridview-title">
          {filtered && 'Filtered '}{link.title}
          {filtered && (
            <button
              className="tc-btn tc-btn-default"
              onClick={() => {
                clearFilter()
                this.clearFieldValues()
                clearSubContents()
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
        <ul>
          <li styleName="assets-gridview-header" key="assets-gridview-header">
            <div styleName="flex-item-title item-type">Type</div>
            <div styleName="flex-item-title item-name">
              <FilterColHeader
                ref={comp => this.nameFieldRef = comp}
                title="Name"
                filterName="name.name"
                setFilter={this.wrappedSetFilter}
                value={getFilterValue('name.name')}
              />
            </div>
            <div styleName="flex-item-title item-shared-with">
              <FilterColHeader
                ref={comp => this.sharedWithFieldRef = comp}
                title="Shared With"
                filterName="sharedWith"
                setFilter={this.wrappedSetFilter}
                value={getFilterValue('sharedWith')}
              />
            </div>
            <div styleName="flex-item-title item-created-by">Created By</div>
            <div styleName="flex-item-title item-modified">
              <FilterColHeader
                ref={comp => this.dateFieldRef = comp}
                type="date"
                title="Date"
                setFilter={this.wrappedSetFilter}
                from={getFilterValue('date.from')}
                to={getFilterValue('date.to')}
              />
            </div>
            <div styleName="flex-item-title item-action"/>
          </li>
          <li styleName="assets-gridview-row" key="assets-gridview-subfolder" onClick={goBack}>
            <div styleName="flex-item item-type"><FolderIcon /></div>
            <div styleName="flex-item item-name hand">..</div>
            <div styleName="flex-item item-shared-with"/>
            <div styleName="flex-item item-created-by"/>
            <div styleName="flex-item item-modified"/>
            <div styleName="flex-item item-action"/>
          </li>
          {
            link.children.map((childLink, i) => {
              const owner = _.find(assetsMembers, m => m.userId === _.parseInt(childLink.createdBy))
              if (linkToDelete === i) {
                return (
                  <li styleName="delete-confirmation-modal" key={'delete-confirmation-post-attachment-' + i}>
                    <DeleteFileLinkModal
                      link={link}
                      onCancel={this.onDeleteCancel}
                      onConfirm={this.onDeleteConfirm}
                    />
                  </li>
                )
              }
              let iconKey
              if (isLinkSubFolder) {
                // Key Icon here
                iconKey = 'link-12'
              } else {
                iconKey = childLink.title.split('.')[1]
              }
              return (<li styleName="assets-gridview-row" key={`childlink-${childLink.address}-${i}`}>
                <div styleName="flex-item item-type">
                  <FileIcon type={iconKey} />
                </div>
                <div styleName="flex-item item-name"><p>{renderLink(childLink)}</p></div>
                <div styleName="flex-item item-shared-with">
                  <p>
                    {(link.tag || link.topicTag) === PROJECT_FEED_TYPE_MESSAGES
                      ? PROJECT_ASSETS_SHARED_WITH_TOPCODER_MEMBERS : PROJECT_ASSETS_SHARED_WITH_ALL_MEMBERS}
                  </p>
                </div>
                <div styleName="flex-item item-created-by">
                  {!owner && childLink.createdBy !== 'CoderBot' && (<div className="user-block txt-italic">Unknown</div>)}
                  {!owner && childLink.createdBy === 'CoderBot' && (<div className="user-block">CoderBot</div>)}
                  {owner && (
                    <div className="spacing">
                      <div className="user-block">
                        <UserTooltip usr={owner} id={i} size={35} />
                      </div>
                    </div>)}
                </div>
                <div styleName="flex-item item-modified">{formatModifyDate(childLink)}</div>
                <div styleName="flex-item item-action">
                  {childLink.deletable && this.hasAccess(childLink.createdBy) && (
                    <ItemOperations
                      canDelete={childLink.deletable && this.hasAccess(childLink.createdBy)}
                      handleDeleteClick={() => this.deleteLink(i)}
                    />)}
                </div>
              </li>)
            })
          }
        </ul>
      </div>
    )
  }
}

SubFolder.propTypes = {
  link: PropTypes.object.isRequired,
  renderLink: PropTypes.func.isRequired,
  onDeletePostAttachment: PropTypes.func,
  goBack: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object,
  setFilter: PropTypes.func.isRequired,
  getFilterValue: PropTypes.func.isRequired,
  clearFilter: PropTypes.func.isRequired,
  updateSubContents: PropTypes.func.isRequired,
  clearSubContents: PropTypes.func.isRequired,
  filtered: PropTypes.bool
}

export default SubFolder
