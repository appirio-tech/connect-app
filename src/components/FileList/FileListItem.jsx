import React, {PropTypes} from 'react'

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
    this.props.onSave({title: this.refs.title.value, description: this.refs.desc.value}, e)
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
            <a href="javascript:" className="icon-save" onClick={this.handleSave} />
            <a href="javascript:" className="icon-close" onClick={onExitEdit} />
          </div>
        </div>
        <textarea defaultValue={description} ref="desc" className="tc-textarea" />
      </div>
    )
  }

  renderReadOnly() {
    const {title, description, size, isEditable, onDelete} = this.props
    return (
      <div>
        <div className="title">
          <h4>{title}</h4>
          <div className="size">
            {size}
          </div>
          {isEditable && <div className="edit-icons">
            <a href="javascript:" className="icon-edit" onClick={this.startEdit}/>
            <a href="javascript:" className="icon-trash" onClick={onDelete} />
          </div>}
        </div>
        <p>{description}</p>
      </div>
    )
  }

  render() {
    const {isEditing} = this.state

    return (
      <div className="file-list-item">
        <div className="icon-col">
          <i className="icon-gzip-file" />
        </div>
        <div className="content-col">
          {isEditing ? this.renderEditing() : this.renderReadOnly()}
        </div>
        <div>

        </div>
      </div>
    )
  }
}


FileListItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
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
