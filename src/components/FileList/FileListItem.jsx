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
    this.props.onSave(this.props.id, {title: this.refs.title.value, description: this.refs.desc.value}, e)
    this.setState({isEditing: false})
  }

  renderEditing() {
    const {title, description} = this.props
    const onExitEdit = () => this.setState({isEditing: false})
    return (
      <div>
        <div className="title-edit">
          <input type="text" defaultValue={title} ref="title" />
          <div className="save-icons">
            <a href="javascript:" className="icon-save" onClick={this.handleSave}><SaveIcon /></a>
            <a href="javascript:" className="icon-close" onClick={onExitEdit}><CloseIcon /></a>
          </div>
        </div>
        <textarea defaultValue={description} ref="desc" maxLength={250} className="tc-textarea" />
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
