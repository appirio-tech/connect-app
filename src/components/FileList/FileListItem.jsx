import _ from 'lodash'
import React, {PropTypes} from 'react'
import filesize from 'filesize'
import { Icons } from 'appirio-tech-react-components'

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
    this.onTitleChange = this.onTitleChange.bind(this)
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
      this.setState({ errors })
    } else {
      this.props.onSave(this.props.id, {title, description: this.refs.desc.value}, e)
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
    }
  }

  onTitleChange() {
    const errors = this.state.errors || {}
    this.validateTitle(errors)
    if (!_.isEmpty(errors)) {
      this.setState({ errors })
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
        <textarea defaultValue={description} ref="desc" maxLength={250} className="tc-textarea" />
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
    let iconPath
    try {
      iconPath = require('./images/' + this.props.contentType.split('/')[1] +'.svg')
    } catch(err) {
      iconPath = require('./images/default.svg')
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
