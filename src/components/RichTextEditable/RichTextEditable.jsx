import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import RichTextArea from '../RichTextArea/RichTextArea'
import styles from './RichTextEditable.scss'

function RichTextEditable(props) {

  return (
    <RichTextArea
      cancelButtonText="CANCEL"
      okButtonText="DONE"
      {...props}
      className={`${props.className} ${styles['rich-text-editable']}`}
      hideTitle
      editMode
    />
  )
}

RichTextEditable.defaultProps = {
  hideTitle: false,
  onPostChange: () => {}
}

RichTextEditable.propTypes = {
  expandedTitlePlaceholder: PropTypes.string,
  onPost: PropTypes.func.isRequired,
  onPostChange: PropTypes.func,
  cancelEdit: PropTypes.func,
  isCreating: PropTypes.bool,
  disableTitle: PropTypes.bool,
  hideTitle: PropTypes.bool,
  disableContent: PropTypes.bool,
  editMode: PropTypes.bool,
  hasError: PropTypes.bool,
  avatarUrl: PropTypes.string,
  authorName: PropTypes.string,
  className: PropTypes.string,
  titlePlaceholder: PropTypes.string,
  contentPlaceholder: PropTypes.string,
  oldTitle: PropTypes.string,
  oldContent: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  allMembers: PropTypes.object,
  projectMembers: PropTypes.object,
  editingTopic: PropTypes.bool,
  hasPrivateSwitch: PropTypes.bool,
  canUploadAttachment: PropTypes.bool,
  attachments: PropTypes.array,
  textAreaOnly: PropTypes.bool
}

export default withRouter(RichTextEditable)
