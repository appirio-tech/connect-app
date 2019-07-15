import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import DeleteFileLinkModal from '../LinksMenu/DeleteFileLinkModal'
import ItemOperations from './ItemOperations'
import FolderIcon from '../../assets/icons/v.2.5/icon-folder-small.svg'

import './GridView.scss'
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

  render() {
    const { link, renderLink, goBack, formatModifyDate } = this.props
    const { linkToDelete } = this.state
    return (
      <div styleName={cn({'assets-gridview-container-active': (linkToDelete >= 0)}, '')}>
        {(linkToDelete >= 0) && <div styleName="assets-gridview-modal-overlay"/>}
        <div styleName="assets-gridview-title">{link.title}</div>
        <ul>
          <li styleName="assets-gridview-header" key="assets-gridview-header">
            <div styleName="flex-item-title item-type">Type</div>
            <div styleName="flex-item-title item-name">Name</div>
            <div styleName="flex-item-title item-modified">Modified</div>
            <div styleName="flex-item-title item-action"/>
          </li>
          <li styleName="assets-gridview-row" key="assets-gridview-subfolder" onClick={goBack}>
            <div styleName="flex-item item-type"><FolderIcon /></div>
            <div styleName="flex-item item-name hand">..</div>
            <div styleName="flex-item item-modified"/>
            <div styleName="flex-item item-action"/>
          </li>
          {
            link.children.map((childLink, i) => {
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
              let iconPath
              try {
                if (this.isURLValid(childLink.title)) {
                  //Link Icon here
                  iconPath = require('../../assets/icons/link-12.svg')
                } else {
                  iconPath = require('../../assets/icons/' + childLink.title.split('.')[1] +'.svg')
                }
              } catch(err) {
                iconPath = require('../../assets/icons/default.svg')
              }
              return (<li styleName="assets-gridview-row" key={`childlink-${childLink.address}-${i}`}>
                <div styleName="flex-item item-type"><img width={42} height={42} src={ iconPath } /></div>
                <div styleName="flex-item item-name"> {renderLink(childLink)}</div>
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
  formatModifyDate: PropTypes.func.isRequired,
}

export default SubFolder
