/**
 * Create a new post for mobile devices
 *
 * It's done in two steps:
 * - enter post title (status)
 * - enter post/comment text
 */
import React from 'react'
import cn from 'classnames'
import MobilePage from '../MobilePage/MobilePage'
import RichTextArea from '../RichTextArea/RichTextArea'

import XMartIcon from '../../assets/icons/x-mark-white.svg'
import './NewPostMobile.scss'

export const NEW_POST_STEP = {
  STATUS: 'STATUS',
  COMMENT: 'COMMENT'
}

const removeInvisibleCharacters = (str) => str.replace(/[\u200B-\u200D\uFEFF]/g, '')

class NewPostMobile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      step: props.step,
      statusValue: '',
      commentValue: ''
    }

    this.setStep = this.setStep.bind(this)
    this.onStatusChange = this.onStatusChange.bind(this)
    this.onCommentChange = this.onCommentChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCreating !== this.props.isCreating && !nextProps.isCreating && !nextProps.hasError) {
      this.props.onClose()
    }
  }

  setStep(step) {
    this.setState({ step })
  }

  onStatusChange() {
    this.setState({ statusValue: this.refs.status.value })
    if (this.props.onPostChange) {
      this.props.onPostChange(this.refs.status.value, this.state.commentValue)
    }
  }

  onCommentChange(commentValue) {
    this.setState({ commentValue })
    if (this.props.onPostChange) {
      this.props.onPostChange(this.state.statusValue, commentValue)
    }
  }

  render() {
    const {
      statusTitle, commentTitle, commentPlaceholder, submitText, onPost, onClose, allMembers, currentUser,
      isCreating, hasError, nextStepText, statusPlaceholder
    } = this.props
    const { step, statusValue, commentValue } = this.state

    let authorName = currentUser.firstName
    if (authorName && currentUser.lastName) {
      authorName += ' ' + currentUser.lastName
    }

    const composerClasses = cn(
      'modal',
      'action-card',
      'new-post-composer'
    )

    return (
      <MobilePage>
        <div styleName="header">
          <div styleName="close-wrapper"><XMartIcon onClick={onClose} /></div>
          <div styleName="title">{step === NEW_POST_STEP.STATUS ? statusTitle : commentTitle}</div>
          <div styleName="plug"/>
        </div>
        {step === NEW_POST_STEP.STATUS ? (
          <div styleName="body">
            <textarea
              ref="status"
              value={statusValue}
              styleName="status-textarea"
              placeholder={statusPlaceholder}
              onChange={this.onStatusChange}
            />
            <div styleName="submit-wrapper">
              <button
                className="tc-btn tc-btn-primary tc-btn-md"
                onClick={() => this.setStep(NEW_POST_STEP.COMMENT)}
                disabled={!statusValue.trim()}
              >{nextStepText}</button>
            </div>
          </div>
        ) : (
          <div styleName="body">
            <RichTextArea
              className={composerClasses}
              onPost={onPost}
              onPostChange={(title, comment) => this.onCommentChange(comment)}
              isCreating={isCreating}
              hasError={hasError}
              avatarUrl={currentUser.photoURL}
              authorName={authorName}
              allMembers={allMembers}
              contentPlaceholder={commentPlaceholder}
            />
            {isCreating && <div styleName="overlay" />}
            <div styleName="submit-wrapper">
              <button
                className="tc-btn tc-btn-primary tc-btn-md"
                onClick={() => onPost({
                  title: statusValue,
                  content: commentValue
                })}
                disabled={!removeInvisibleCharacters(commentValue).trim() || isCreating}
              >{isCreating ? 'Posting...' : submitText}</button>
            </div>
          </div>
        )}
      </MobilePage>
    )
  }
}

NewPostMobile.defaultProps = {
  step: NEW_POST_STEP.STATUS
}

export default NewPostMobile
