import _ from 'lodash'
import React, {PropTypes} from 'react'
import filesize from 'filesize'
import { Icons } from 'appirio-tech-react-components'
import FileIcons from './FileIcons'

const { TrashIcon, CloseIcon, EditIcon, SaveIcon } = Icons

export default class FileListItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
      description: props.description,
      isEditing: false
    }
    this.handleSave = this.handleSave.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.validateForm = this.validateForm.bind(this)
    this.validateTitle = this.validateTitle.bind(this)
    this.validateDesc = this.validateDesc.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onDescChange = this.onDescChange.bind(this)
  }

  onDelete() {
    this.props.onDelete(this.props.id)
  }

  startEdit() {
    const {title, description} = this.props
    this.setState({
      title,
      description,
      isEditing: true
    })
  }

  handleSave(e) {
    const title = this.refs.title.value
    const errors = this.validateForm()
    if (!_.isEmpty(errors)) {
      this.setState({ errors : errors })
    } else {
      this.props.onSave(this.props.id, {title: title, description: this.refs.desc.value}, e)
      this.setState({isEditing: false})
    }
  }

  validateForm() {
    const errors = this.state.errors || {}
    this.validateTitle(errors)
    this.validateDesc(errors)
    return errors
  }

  validateTitle(errors) {
    const title = this.refs.title.value
    if (!title || title.trim().length === 0) {
      errors['title'] = 'The file name cannot be blank.'
    }
  }

  validateDesc(errors) {
    const desc = this.refs.desc.value
    if (!desc || desc.trim().length === 0) {
      errors['desc'] = 'Description cannot be blank.'
    }
  }

  onTitleChange() {
    const errors = this.state.errors || {}
    this.validateTitle(errors)
    if (!_.isEmpty(errors)) {
      this.setState({ errors : errors })
    }
  }

  onDescChange() {
    const errors = this.state.errors || {}
    this.validateDesc(errors)
    if (!_.isEmpty(errors)) {
      this.setState({ errors : errors })
    }
  }

  renderEditing() {
    const {title, description} = this.props
    const { errors } = this.state
    const onExitEdit = () => this.setState({isEditing: false, errors: {} })
    return (
      <div>
        <div className="title-edit">
          <input type="text" defaultValue={title} ref="title" maxLength={50} onChange={ this.onTitleChange }/>
          <div className="save-icons">
            <a href="javascript:" className="icon-save" onClick={this.handleSave}><SaveIcon /></a>
            <a href="javascript:" className="icon-close" onClick={onExitEdit}><CloseIcon /></a>
          </div>
        </div>
        { (errors && errors.title) && <div className="error-message">{ errors.title }</div> }
        <textarea defaultValue={description} ref="desc" maxLength={250} className="tc-textarea" onChange={ this.onDescChange } />
        { (errors && errors.desc) && <div className="error-message">{ errors.desc }</div> }
      </div>
    )
  }

  renderReadOnly() {
    const {title, description, size, isEditable} = this.props
    return (
      <div>
        <div className="title">
          <h4>{title}</h4>
          <div className="size">
            {filesize(size)}
          </div>
          {isEditable && <div className="edit-icons">
            <a href="javascript:" className="icon-edit" onClick={this.startEdit}><EditIcon /></a>
            <a href="javascript:" className="icon-trash" onClick={this.onDelete}><TrashIcon /></a>
          </div>}
        </div>
        <p>{description}</p>
      </div>
    )
  }
  
  render() {
    const {isEditing} = this.state
    // const Icon = this.getFileIcon(this.props.contentType)

    return (
      <div className="file-list-item">
        <div className="icon-col">
          <FileIcons.Default width={42} height={42}/>
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
  onDelete: PropTypes.func.isRequired
}

FileListItem.defaultProps = {
  isEditable: true
}
