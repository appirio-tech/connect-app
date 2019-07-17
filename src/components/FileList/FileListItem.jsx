import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import filesize from 'filesize'
import moment from 'moment'
import Tooltip from 'appirio-tech-react-components/components/Tooltip/Tooltip'
import UserWithName from '../User/UserWithName'
import { TOOLTIP_DEFAULT_DELAY } from '../../config/constants'
import TrashIcon from  '../../assets/icons/icon-trash.svg'
import CloseIcon from  '../../assets/icons/icon-close.svg'
import EditIcon from  '../../assets/icons/icon-edit.svg'
import SaveIcon from  '../../assets/icons/icon-save.svg'
import UserAutoComplete from '../UserAutoComplete/UserAutoComplete'


export default class FileListItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
      description: props.description,
      allowedUsers: props.allowedUsers,
      isEditing: false
    }
    this.handleSave = this.handleSave.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.validateForm = this.validateForm.bind(this)
    this.validateTitle = this.validateTitle.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onUserIdChange = this.onUserIdChange.bind(this)
  }

  onDelete() {
    this.props.onDelete(this.props.id)
  }

  startEdit() {
    const {title, description, allowedUsers} = this.props
    this.setState({
      title,
      description,
      allowedUsers,
      isEditing: true
    })
  }

  handleSave(e) {
    const title = this.refs.title.value
    const errors = this.validateForm()
    if (!_.isEmpty(errors)) {
      this.setState({ errors })
    } else {
      this.props.onSave(this.props.id, {title, description: this.refs.desc.value, allowedUsers: this.state.allowedUsers}, e)
      this.setState({isEditing: false})
    }
  }

  validateForm() {
    const errors = this.state.errors || {}
    this.validateTitle(errors)
    return errors
  }

  validateTitle(errors) {
    const title = this.refs.title.value
    if (!title || title.trim().length === 0) {
      errors['title'] = 'The file name cannot be blank.'
    } else {
      delete errors['title']
    }
  }

  onTitleChange() {
    const errors = this.state.errors || {}
    this.validateTitle(errors)
    this.setState({ errors })
  }

  onUserIdChange(selectedHandles = '') {
    this.setState({
      allowedUsers: this.handlesToUserIds(selectedHandles.split(','))
    })
  }

  userIdsToHandles(allowedUsers) {
    const { projectMembers } = this.props
    allowedUsers = allowedUsers || []
    return allowedUsers.map(userId => _.get(projectMembers[userId], 'handle'))
  }

  handlesToUserIds(handles) {
    const { projectMembers } = this.props
    const projectMembersByHandle = _.mapKeys(projectMembers, value => value.handle)
    handles = handles || []
    return handles.filter(handle => handle).map(handle => _.get(projectMembersByHandle[handle], 'userId'))
  }

  renderEditing() {
    const { title, description, projectMembers, loggedInUser, askForPermissions } = this.props
    const { errors, allowedUsers } = this.state
    const onExitEdit = () => this.setState({isEditing: false, errors: {} })
    return (
      <div>
        <div className="title-edit">
          <input type="text" defaultValue={title} ref="title" maxLength={50} onChange={ this.onTitleChange }/>
          <div className="save-icons">
            <a href="javascript:" className="icon-save" onClick={this.handleSave} title="Save"><SaveIcon /></a>
            <a href="javascript:" className="icon-close" onClick={onExitEdit} title="Cancel"><CloseIcon /></a>
          </div>
        </div>
        { (errors && errors.title) && <div className="error-message">{ errors.title }</div> }
        <textarea defaultValue={description} ref="desc" maxLength={250} className="tc-textarea" />
        { (errors && errors.desc) && <div className="error-message">{ errors.desc }</div> }
        { askForPermissions &&
          <UserAutoComplete
            onUpdate={this.onUserIdChange}
            projectMembers={projectMembers}
            loggedInUser={loggedInUser}
            selectedUsers={this.userIdsToHandles(allowedUsers).map((handle) => ({ value: handle, label: handle }))}
          />
        }
      </div>
    )
  }

  renderReadOnly() {
    const {title, downloadUrl, description, size, isEditable, updatedAt, createdAt, createdByUser, updatedByUser, canModify} = this.props

    return (
      <div>
        <div className="title">
          <h4><a href={downloadUrl} target="_blank" rel="noopener noreferrer">{title}</a></h4>
          <div className="size">
            {filesize(size)}
            <Tooltip theme="light" tooltipDelay={TOOLTIP_DEFAULT_DELAY}>
              <div className="tooltip-target">
                <p className="date">{moment(updatedAt || createdAt).format('MMM DD, YYYY')}</p>
              </div>
              <div className="tooltip-body">
                <UserWithName {...(updatedByUser || createdByUser)} isLink />
              </div>
            </Tooltip>
          </div>
          {isEditable && canModify && <div className="edit-icons">
            <i className="icon-edit" onClick={this.startEdit} title="edit"><EditIcon /></i>
            <i className="icon-trash" onClick={this.onDelete} title="trash"><TrashIcon /></i>
          </div>}
        </div>
        <p>{description}</p>
      </div>
    )
  }

  render() {
    const { isEditing } = this.state
    let iconPath
    try {
      iconPath = require('../../assets/icons/' + this.props.contentType.split('/')[1] +'.svg')
    } catch(err) {
      iconPath = require('../../assets/icons/default.svg')
    }

    return (
      <div className="file-list-item">
        <div className="icon-col">
          <img width={42} height={42} src={ iconPath } />
        </div>
        <div className="content-col">
          {isEditing ? this.renderEditing() : this.renderReadOnly()}
        </div>
      </div>
    )
  }
}


FileListItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  contentType: PropTypes.string,
  isEditable: PropTypes.bool,
  updatedAt: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
  updatedByUser: PropTypes.object,
  createdByUser: PropTypes.object.isRequired,
  projectMembers: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  allowedUsers: PropTypes.array,

  /**
   * Callback fired when a save button is clicked
   *
   * ```js
   * function (
   * 	String title,
   * 	String description,
   * 	SyntheticEvent event?
   * )
   *
   */
  onSave: PropTypes.func.isRequired,

  /**
   * Callback fired when a delete button is clicked
   *
   * ```js
   * function (
   * 	SyntheticEvent event?
   * )
   *
   */
  onDelete: PropTypes.func.isRequired,
  canModify: PropTypes.bool.isRequired
}

FileListItem.defaultProps = {
  isEditable: true
}
