/**
 * Create a new post for mobile devices
 *
 * It's done in two steps:
 * - enter post title (status)
 * - enter post/comment text
 *
 * This component use native textarea instead of DraftJS editor for mobile devices
 * because DraftJS editor has critical bug on mobile devices https://github.com/facebook/draft-js/issues/1077
 * and it's not officially support them https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#mobile-not-yet-supported
 */
import React from 'react'
import PropTypes from 'prop-types'
import MobilePage from '../MobilePage/MobilePage'

import SwitchButton from 'appirio-tech-react-components/components/SwitchButton/SwitchButton'
import XMartIcon from '../../assets/icons/x-mark.svg'
import './NewPostMobile.scss'
import * as filepicker from 'filestack-js'
import {
  FILE_PICKER_API_KEY,
  FILE_PICKER_CNAME,
  FILE_PICKER_FROM_SOURCES,
  FILE_PICKER_SUBMISSION_CONTAINER_NAME, PROJECT_ATTACHMENTS_FOLDER
} from '../../config/constants'
import BtnRemove from '../../assets/icons/ui-16px-1_trash-simple.svg'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { createTopicAttachment } from '../../api/messages'

export const NEW_POST_STEP = {
  STATUS: 'STATUS',
  COMMENT: 'COMMENT'
}

const fileUploadClient = filepicker.init(FILE_PICKER_API_KEY, {
  cname: FILE_PICKER_CNAME
})

// we need it to calulate body height based on the actual mobile browser viewport height
const HEADER_HEIGHT = 50

class NewPostMobile extends React.Component {
  constructor(props) {
    super(props)

    const projectId = props.match.params.projectId
    this.state = {
      step: props.step,
      statusValue: '',
      commentValue: '',
      browserActualViewportHeigth: document.documentElement.clientHeight,
      isPrivate: false,
      isAttachmentUploaderOpen: false,
      rawFiles: [],
      attachmentsStorePath: `${PROJECT_ATTACHMENTS_FOLDER}/${projectId}/`,
    }

    this.setStep = this.setStep.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.updateBrowserHeight = this.updateBrowserHeight.bind(this)
    this.openFileUpload = this.openFileUpload.bind(this)
    this.processUploadedFiles = this.processUploadedFiles.bind(this)
    this.removeRawFile = this.removeRawFile.bind(this)
    this.onPost = this.onPost.bind(this)
  }

  componentWillMount() {
    window.addEventListener('resize', this.updateBrowserHeight)
    this.updateBrowserHeight()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateBrowserHeight)
  }

  updateBrowserHeight() {
    this.setState({ browserActualViewportHeigth: document.documentElement.clientHeight })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCreating !== this.props.isCreating && !nextProps.isCreating && !nextProps.hasError) {
      this.props.onClose()
    }
  }

  setStep(step) {
    this.setState({ step })
  }

  onValueChange() {
    if (this.state.step === NEW_POST_STEP.STATUS) {
      this.setState({ statusValue: this.refs.value.value })
      if (this.props.onPostChange) {
        this.props.onPostChange(this.refs.value.value, this.state.commentValue)
      }
    } else {
      this.setState({ commentValue: this.refs.value.value })
      if (this.props.onPostChange) {
        this.props.onPostChange(this.state.statusValue, this.refs.value.value)
      }
    }
  }

  openFileUpload() {
    if (fileUploadClient) {
      if (this.state.isAttachmentUploaderOpen) return
      const picker = fileUploadClient.picker({
        storeTo: {
          location: 's3',
          path: this.state.attachmentsStorePath,
          container: FILE_PICKER_SUBMISSION_CONTAINER_NAME,
          region: 'us-east-1'
        },
        maxFiles: 4,
        fromSources: FILE_PICKER_FROM_SOURCES,
        uploadInBackground: false,
        onFileUploadFinished: (files) => {
          this.processUploadedFiles(files)
        },
        onOpen: () => {
          this.setState({isAttachmentUploaderOpen: true})
        },
        onClose: () => {
          this.setState({isAttachmentUploaderOpen: false})
        }
      })

      picker.open()
    }
  }

  processUploadedFiles(fpFiles) {
    fpFiles = _.isArray(fpFiles) ? fpFiles : [fpFiles]
    const rawFiles = fpFiles.map(f => ({
      filename: f.key,
      bucket: f.container,
      title: f.filename
    }))

    this.setState({ rawFiles })
  }

  removeRawFile(index) {
    const rawFiles = _.cloneDeep(this.state.rawFiles)
    rawFiles.splice(index, 1)
    this.setState({
      rawFiles
    })
  }

  onPost() {
    const { statusValue, commentValue, isPrivate, rawFiles } = this.state
    if (rawFiles.length > 0) {
      const promises = rawFiles.map(f => createTopicAttachment(_.omit(f, ['title'])))
      Promise.all(promises)
        .then(results => {
          const rawFilesattachmentIds = results.map(content => content.result.id)
          const attachmentIds = [
            ...rawFilesattachmentIds
          ]
          this.props.onPost({
            title: statusValue,
            content: commentValue,
            isPrivate,
            attachmentIds
          })
        })
    } else {
      this.props.onPost({
        title: statusValue,
        content: commentValue,
        isPrivate
      })
    }
  }

  render() {
    const {
      statusTitle, commentTitle, commentPlaceholder, submitText, onClose,
      isCreating, nextStepText, statusPlaceholder, canAccessPrivatePosts
    } = this.props
    const { step, statusValue, commentValue, browserActualViewportHeigth, isPrivate, rawFiles } = this.state

    let value
    let title
    let placeholder
    let onBtnClick
    let btnText

    if (step === NEW_POST_STEP.STATUS) {
      value = statusValue
      title = statusTitle
      placeholder = statusPlaceholder
      onBtnClick = () => {
        this.setStep(NEW_POST_STEP.COMMENT)
      }
      btnText = nextStepText
    } else {
      value = commentValue
      title = commentTitle
      placeholder = commentPlaceholder
      onBtnClick = () => { this.onPost() }
      btnText = submitText
    }

    return (
      <MobilePage>
        <div styleName="header">
          {canAccessPrivatePosts ?
            <SwitchButton
              name="private-post"
              onChange={(evt) => this.setState({isPrivate: evt.target.checked})}
              checked={isPrivate}
              label="Private"
            /> :
            <div styleName="plug" />
          }
          <div styleName="title">{title}</div>
          <div styleName="close-wrapper"><XMartIcon onClick={onClose} /></div>
        </div>
        <div styleName="body" style={{ height: browserActualViewportHeigth - HEADER_HEIGHT }}>
          <textarea
            ref="value"
            value={value}
            styleName="textarea"
            placeholder={placeholder}
            onChange={this.onValueChange}
            disabled={isCreating}
          />
          <div>
            <div styleName="attachment-wrapper">
              <div styleName="attachment-files-mobile">
                <ul>
                  {
                    rawFiles.map((f, index) => (
                      <li key={`file-${index}`}>
                        {f.title}
                        <div styleName="button-group">
                          <div styleName="buttons">
                            <button onClick={(index) => {this.removeRawFile(index)}} type="button">
                              <BtnRemove />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div styleName="tc-attachment-button" onClick={this.openFileUpload}>
                <a>Attach a file</a>
              </div>
            </div>
            <div styleName="submit-wrapper">
              <button
                className="tc-btn tc-btn-primary tc-btn-md"
                onClick={onBtnClick}
                disabled={!value.trim() || isCreating}
              >{isCreating ? 'Posting...' : btnText}</button>
            </div>
          </div>
        </div>
      </MobilePage>
    )
  }
}

NewPostMobile.defaultProps = {
  step: NEW_POST_STEP.STATUS
}

NewPostMobile.propTypes = {
  statusTitle: PropTypes.string,
  commentTitle: PropTypes.string,
  statusPlaceholder: PropTypes.string,
  commentPlaceholder: PropTypes.string,
  submitText: PropTypes.string,
  nextStepText: PropTypes.string,
  onPost: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isCreating: PropTypes.bool,
  hasError: PropTypes.bool,
  canAccessPrivatePosts: PropTypes.bool,
}

export default withRouter(NewPostMobile)
